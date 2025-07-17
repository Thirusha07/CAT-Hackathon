import React, { useState, FormEvent } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Paper,
    Divider,
    createTheme,
    ThemeProvider,
    CssBaseline
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icon for sign-up

// Define a custom theme for consistency
const theme = createTheme({
    palette: {
        primary: {
            main: '#FFC72C', // Caterpillar Yellow
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
        h4: {
            fontWeight: 700,
            color: '#1A1A1A',
        },
        h5: {
            fontWeight: 600,
            color: '#1A1A1A',
            marginBottom: '16px',
        },
        h6: {
            fontWeight: 600,
            color: '#1A1A1A',
            marginBottom: '12px',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
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
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiFormControl: {
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
    }
});

// Mock data for dropdowns
const machineTypes = ['Excavator', 'Wheel Loader', 'Dozer', 'Grader', 'Dump Truck'];
const sites = ['Site A - North', 'Site B - Central', 'Site C - South'];
const languages = ['English', 'Spanish', 'French', 'German'];
const roles = ['General Operator', 'Grading Specialist', 'Hauling Specialist', 'Excavation Lead'];
const yearsOfExperienceOptions = Array.from({ length: 30 }, (_, i) => i + 1);

// Mock account creation function
const mockCreateAccount = async (accountData) => {
    console.log("Creating account with data:", accountData);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (accountData.email === 'existing@example.com') {
                reject({ success: false, message: 'Email already registered.' });
            } else if (accountData.password !== accountData.confirmPassword) {
                reject({ success: false, message: 'Passwords do not match.' });
            }
            else {
                resolve({ success: true, message: 'Account created successfully!' });
            }
        }, 1500);
    });
};

export default function SignUpPage() {
    const [fullName, setFullName] = useState('');
    const [operatorId, setOperatorId] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [assignedMachineType, setAssignedMachineType] = useState('');
    const [primarySite, setPrimarySite] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

    // Optional details
    const [profilePicture, setProfilePicture] = useState(null); // For file input
    const [preferredLanguage, setPreferredLanguage] = useState('');
    const [yearsExperience, setYearsExperience] = useState('');
    // const [certifications, setCertifications] = useState(''); // Removed
    const [roleSpecialization, setRoleSpecialization] = useState('');

    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        setAlertMessage(null);
        setLoading(true);

        const accountData = {
            fullName, operatorId, companyId, email, password, confirmPassword,
            assignedMachineType, primarySite,
            emergencyContactName, emergencyContactPhone,
            profilePicture: profilePicture ? profilePicture.name : null, // Just name for mock
            preferredLanguage, yearsExperience, // certifications, // Removed
            roleSpecialization,
        };

        try {
            const response = await mockCreateAccount(accountData);
            if (response.success) {
                setAlertMessage({ type: 'success', message: response.message + ' You can now log in.' });
                // Clear form or redirect to login page
                setFullName(''); setEmail(''); setPassword(''); setConfirmPassword('');
                setOperatorId(''); setCompanyId(''); setAssignedMachineType(''); setPrimarySite('');
                setEmergencyContactName(''); setEmergencyContactPhone('');
                setProfilePicture(null); setPreferredLanguage(''); setYearsExperience('');
                // setCertifications(''); // Removed
                setRoleSpecialization('');
            } else {
                setAlertMessage({ type: 'error', message: response.message });
            }
        } catch (err) {
            console.error("Account creation error:", err);
            setAlertMessage({ type: 'error', message: err.message || 'An unexpected error occurred during account creation.' });
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePictureChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setProfilePicture(event.target.files[0]);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
                component="main"
                maxWidth="md"
                sx={{
                    py: { xs: 4, sm: 6, md: 8 },
                    background: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)',
                    minHeight: '100vh',
                }}
            >
                <Paper sx={{ p: { xs: 3, sm: 4, md: 5 }, mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
                        <Typography component="h1" variant="h4">
                            Operator Sign-Up
                        </Typography>
                    </Box>

                    {alertMessage && (
                        <Alert severity={alertMessage.type} sx={{ mb: 3, width: '100%' }}>
                            {alertMessage.message}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleCreateAccount} noValidate>
                        <Typography variant="h5" sx={{ mb: 2 }}>Mandatory Details</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Operator ID" value={operatorId} onChange={(e) => setOperatorId(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Company/Fleet ID" value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth required>
                                    <InputLabel id="machine-type-label">Assigned Machine Type(s)</InputLabel>
                                    <Select
                                        labelId="machine-type-label"
                                        value={assignedMachineType}
                                        label="Assigned Machine Type(s)"
                                        onChange={(e) => setAssignedMachineType(e.target.value)}
                                    >
                                        {machineTypes.map((type) => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth required>
                                    <InputLabel id="primary-site-label">Primary Site/Location</InputLabel>
                                    <Select
                                        labelId="primary-site-label"
                                        value={primarySite}
                                        label="Primary Site/Location"
                                        onChange={(e) => setPrimarySite(e.target.value)}
                                    >
                                        {sites.map((site) => (
                                            <MenuItem key={site} value={site}>{site}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Emergency Contact Name" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Emergency Contact Phone" type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h5" sx={{ mb: 2 }}>Optional Details</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 10,
                                        borderColor: 'secondary.main',
                                        color: 'secondary.main',
                                        '&:hover': {
                                            borderColor: 'secondary.dark',
                                            bgcolor: 'secondary.light',
                                            color: 'white',
                                        }
                                    }}
                                >
                                    Upload Profile Picture
                                    <input type="file" hidden accept="image/*" onChange={handleProfilePictureChange} />
                                </Button>
                                {profilePicture && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                        {profilePicture.name} selected
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth>
                                    <InputLabel id="language-label">Preferred Language</InputLabel>
                                    <Select
                                        labelId="language-label"
                                        value={preferredLanguage}
                                        label="Preferred Language"
                                        onChange={(e) => setPreferredLanguage(e.target.value)}
                                    >
                                        {languages.map((lang) => (
                                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth>
                                    <InputLabel id="experience-label">Years of Experience</InputLabel>
                                    <Select
                                        labelId="experience-label"
                                        value={yearsExperience}
                                        label="Years of Experience"
                                        onChange={(e) => setYearsExperience(e.target.value)}
                                    >
                                        {yearsOfExperienceOptions.map((year) => (
                                            <MenuItem key={year} value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* Certifications field removed */}
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth>
                                    <InputLabel id="role-label">Role/Specialization</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        value={roleSpecialization}
                                        label="Role/Specialization"
                                        onChange={(e) => setRoleSpecialization(e.target.value)}
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>{role}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 5,
                                py: 1.8,
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}
