"use client"; // This component uses client-side hooks and interactivity

import React, { useState, FormEvent } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    CircularProgress,
    Alert,
    InputAdornment,
    IconButton,
    createTheme,
    ThemeProvider,
    CssBaseline // Import CssBaseline for consistent baseline styles
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ConstructionIcon from '@mui/icons-material/Construction'; // Importing a dummy MUI logo icon

// Define a custom theme for better aesthetics, matching a "Cat" industrial feel
const theme = createTheme({
    palette: {
        primary: {
            main: '#FFC72C', // Caterpillar Yellow
            light: '#FFD966', // Lighter yellow for subtle accents
            dark: '#E0B000', // Darker yellow for hover
            contrastText: '#1A1A1A', // Dark text for yellow background
        },
        secondary: {
            main: '#4A4A4A', // Dark gray for accents
            light: '#666666',
            dark: '#333333',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F0F2F5', // Light gray background for the overall page
            paper: '#FFFFFF', // White for cards/forms
        },
        text: {
            primary: '#1A1A1A', // Dark text for main content
            secondary: '#555555', // Lighter text for secondary info
        },
        error: {
            main: '#D32F2F', // Standard error red
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif', // Ensure Inter font is used
        h5: {
            fontWeight: 700, // Bold for headings
            color: '#1A1A1A', // Ensure heading text is dark
        },
        button: {
            textTransform: 'none', // Prevent uppercase transformation for buttons
            fontWeight: 600, // Slightly bolder button text
        },
        body2: {
            color: '#555555', // Default color for links and small text
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10, // More rounded buttons
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:active': {
                        transform: 'scale(0.98)', // Slight press effect
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10, // More rounded input fields
                        '& fieldset': {
                            borderColor: '#CCCCCC', // Lighter border color
                        },
                        '&:hover fieldset': {
                            borderColor: '#999999', // Darker on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FFC72C', // Primary color on focus
                            borderWidth: '2px', // Thicker border on focus
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#555555', // Label color
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#FFC72C', // Label color on focus
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Rounded alerts
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for alerts
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#555555', // Default link color
                    textDecoration: 'none', // No underline by default
                    '&:hover': {
                        textDecoration: 'underline', // Underline on hover
                        color: '#333333', // Darker text on hover
                    },
                },
            },
        },
    }
});

// Mock login function for demonstration purposes
interface LoginResponse {
    success: boolean;
    message: string;
}

const mockLogin = async (email: string, password: string): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'operator@cat.com' && password === 'password123') {
                resolve({ success: true, message: 'Login successful!' });
            } else {
                reject({ success: false, message: 'Invalid email or password.' });
            }
        }, 1500); // Simulate network delay
    });
};

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleLogin = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);

        try {
            const response = await mockLogin(email, password);
            if (response.success) {
                console.log(response.message);
                alert('Login successful! Redirecting to Dashboard (simulated).');
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || 'An unexpected error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = (): void => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
    };

    return (
        // ThemeProvider and CssBaseline should ideally wrap your entire app in layout.tsx
        // For demonstration purposes, they are included here to show the styling.
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Applies global reset and theme background color */}
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: { xs: 2, sm: 3, md: 4 },
                    // Lighter, more inviting background gradient
                    background: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)', // Light blue-gray gradient
                    // Or a gradient with a hint of the primary color:
                    // background: 'linear-gradient(135deg, #F0F2F5 0%, #FFFAE0 100%)', // Light gray to light yellow
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        p: { xs: 3, sm: 4, md: 5 },
                        borderRadius: 3,
                        boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.15)', // More pronounced, softer shadow
                        bgcolor: 'background.paper', // White background for the form card
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ mb: 3 }}>
                        <ConstructionIcon sx={{ fontSize: 100, color: 'primary.main' }} />
                    </Box>

                    <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                        Operator Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                borderRadius: 10,
                                fontWeight: 'bold',
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)', // Initial shadow
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)', // More shadow on hover
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
