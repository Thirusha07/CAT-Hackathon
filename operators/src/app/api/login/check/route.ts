import { NextRequest, NextResponse } from 'next/server';
import Operator from '../../../../../models/operator'; // Adjust if needed
import connectDB from '../../../../../lib/mongo';

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const { email, password } = await req.json();
        console.log("email",email)
        console.log("pass",password)

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const operator = await Operator.findOne({ email });
        console.log("operator",operator)

        if (!operator) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Compare provided password directly with the one stored in DB
        const isMatch = password === operator.password;

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Login is successful, but no token is generated.
        // You might want to return some user data instead.
        return NextResponse.json({
            message: 'Login successful',
            operator: {
                operatorId: operator.operatorId,
                email: operator.email,
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

