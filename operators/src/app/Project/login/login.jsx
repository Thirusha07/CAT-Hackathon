"use client";

import React, { useState } from 'react';
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
    CssBaseline
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ConstructionIcon from '@mui/icons-material/Construction';
import axios from 'axios'; // Import axios

// Custom theme matching Caterpillar brand
const theme = createTheme({
    palette: {
        primary: {
            main: '#FFC72C',
            light: '#FFD966',
            dark: '#E0B000',
            contrastText: '#1A1A1A',
        },
        secondary: {
            main: '#4A4A4A',
            light: '#666666',
            dark: '#333333',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F0F2F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#555555',
        },
        error: {
            main: '#D32F2F',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h5: {
            fontWeight: 700,
            color: '#1A1A1A',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
        body2: {
            color: '#555555',
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:active': {
                        transform: 'scale(0.98)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        '& fieldset': {
                            borderColor: '#CCCCCC',
                        },
                        '&:hover fieldset': {
                            borderColor: '#999999',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FFC72C',
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#555555',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#FFC72C',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#555555',
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                        color: '#333333',
                    },
                },
            },
        },
    }
});

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Replace with your actual backend login endpoint
            const response = await axios.post('/api/login/check', {
                email,
                password,
            });

            if (response.status === 200) { // Assuming 200 OK for successful login
                 console.log(response.data.message);
                //  localStorage.setItem('userName', response.data.user.fullName);
    router.push('/Project/daily-task');
            } else {
                // This block might not be strictly necessary if axios throws errors for non-2xx responses
                setError(response.data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error("Login error:", err);
            if (axios.isAxiosError(err) && err.response) {
                // Handle errors from the backend (e.g., 401 Unauthorized, 400 Bad Request)
                setError(err.response.data.message || 'Invalid email or password.');
            } else {
                setError('An unexpected error occurred during login.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
                    background: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)',
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
                        boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.15)',
                        bgcolor: 'background.paper',
                    }}
                >
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
                                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
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