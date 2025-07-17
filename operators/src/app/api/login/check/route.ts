import { NextRequest, NextResponse } from 'next/server';
import Operator from '../../../../../models/operator'; // Adjust if needed
import connectDB from '../../../../../lib/mongo';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const operator = await Operator.findOne({ email });

        if (!operator) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Compare provided password with hashed password stored in DB
        const isMatch = await bcrypt.compare(password, operator.password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Ensure you have JWT_SECRET in your .env.local
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return NextResponse.json({ message: 'JWT_SECRET not set in environment' }, { status: 500 });
        }

        const token = jwt.sign(
            {
                operatorId: operator.operatorId,
                email: operator.email,
            },
            secret,
            { expiresIn: '1h' }
        );

        return NextResponse.json({ message: 'Login successful', token }, { status: 200 });

    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
