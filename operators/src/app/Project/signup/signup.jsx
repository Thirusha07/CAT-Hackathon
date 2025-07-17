"use client";

import React, { useState } from 'react';
import axios from 'axios';
import {
    Container, Box, Typography, TextField, Button, CircularProgress, Alert, MenuItem,
    Select, InputLabel, FormControl, Paper, Divider, createTheme, ThemeProvider,
    CssBaseline, Chip, OutlinedInput
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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
        success: {
            main: '#4CAF50',
        },
        info: {
            main: '#2196F3',
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
        body1: {
            color: '#333333',
        },
        body2: {
            color: '#555555',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
                },
            },
        },
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
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
    }
});


// Constants for dropdowns - updated for the new schema
const machineTypes = ['Excavator', 'Wheel Loader', 'Dozer', 'Grader', 'Dump Truck'];
const sites = ['Site A - North', 'Site B - Central', 'Site C - South'];
const languages = ['English', 'Spanish', 'French', 'German'];
// NEW: Specialization enum values from your schema
const specializations = ["Heavy Machinery", "Earth Moving", "Material Handling", "Electrical", "Mechanical"];
const yearsOfExperienceOptions = Array.from({ length: 30 }, (_, i) => i + 1);

// API call function
    const createAccount = async (accountData) => {
    try {
        const response = await axios.post('/api/operator/create', accountData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to create account');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};


export default function SignUpPage() {
    // Form State - updated to match schema fields
    const [fullName, setFullName] = useState('');
    const [operatorId, setOperatorId] = useState('');
    const [sectorId, setSectorId] = useState(''); // Renamed from companyId
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [assignedMachines, setAssignedMachines] = useState([]); // Changed to array for multiple selections
    const [primeSiteLocation, setPrimeSiteLocation] = useState(''); // Renamed from primarySite
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [preferredLanguage, setPreferredLanguage] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState(''); // Now required
    const [specialization, setSpecialization] = useState(''); // Renamed and now required

    // Document status
    const [healthCheckupValidUntil, setHealthCheckupValidUntil] = useState(''); // New required field
    const [medicalFitnessValidUntil, setMedicalFitnessValidUntil] = useState('');
    const [audiometryValidUntil, setAudiometryValidUntil] = useState('');
    const [visionValidUntil, setVisionValidUntil] = useState('');
    const [trainingCertValidUntil, setTrainingCertValidUntil] = useState('');

    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        
        if (password !== confirmPassword) {
            setAlertMessage({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setAlertMessage(null);
        setLoading(true);

        // Construct the data object to match the Mongoose Schema
        const accountData = {
            fullName,
            operatorId,
            sectorId,
            email,
            password,
            assignedMachines,
            primeSiteLocation,
            emergencyContactName,
            emergencyContactPhone,
            profilePicture: profilePicture ? profilePicture.name : null,
            preferredLanguage,
            yearsOfExperience,
            specialization,
            healthCheckupValidUntil,
            documentStatus: { // Nested object as per schema
                medicalFitnessValidUntil,
                audiometryValidUntil,
                visionValidUntil,
                trainingCertValidUntil,
            },
        };

        try {
            const response = await createAccount(accountData);
            setAlertMessage({ type: 'success', message: response.message });
            // Clear form
            setFullName(''); setEmail(''); setPassword(''); setConfirmPassword('');
            setOperatorId(''); setSectorId(''); setAssignedMachines([]); setPrimeSiteLocation('');
            setEmergencyContactName(''); setEmergencyContactPhone('');
            setProfilePicture(null); setPreferredLanguage(''); setYearsOfExperience('');
            setSpecialization('');
            setHealthCheckupValidUntil(''); setMedicalFitnessValidUntil('');
            setAudiometryValidUntil(''); setVisionValidUntil(''); setTrainingCertValidUntil('');
        } catch (err) {
            setAlertMessage({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePictureChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setProfilePicture(event.target.files[0]);
        }
    };

    const handleMachineSelectChange = (event) => {
        const { target: { value } } = event;
        setAssignedMachines(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="md" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
                <Paper sx={{ p: { xs: 3, sm: 4, md: 5 }, mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
                        <Typography component="h1" variant="h4">Operator Sign-Up</Typography>
                    </Box>

                    {alertMessage && (
                        <Alert severity={alertMessage.type} sx={{ mb: 3 }}>{alertMessage.message}</Alert>
                    )}

                    <Box component="form" onSubmit={handleCreateAccount} noValidate>
                        <Typography variant="h5">Mandatory Details</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                            {/* Full Name, Operator ID - unchanged */}
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Operator ID" value={operatorId} onChange={(e) => setOperatorId(e.target.value)} />
                            </Box>
                            {/* Sector ID */}
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Sector ID" value={sectorId} onChange={(e) => setSectorId(e.target.value)} />
                            </Box>
                            {/* Email, Passwords - unchanged */}
                             <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </Box>
                            {/* Assigned Machines - Multiple Select */}
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth required>
                                    <InputLabel id="assigned-machines-label">Assigned Machine(s)</InputLabel>
                                    <Select
                                        labelId="assigned-machines-label"
                                        multiple
                                        value={assignedMachines}
                                        onChange={handleMachineSelectChange}
                                        input={<OutlinedInput label="Assigned Machine(s)" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (<Chip key={value} label={value} />))}
                                            </Box>
                                        )}
                                    >
                                        {machineTypes.map((type) => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* Prime Site Location */}
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth required>
                                    <InputLabel id="prime-site-label">Prime Site/Location</InputLabel>
                                    <Select labelId="prime-site-label" value={primeSiteLocation} label="Prime Site/Location" onChange={(e) => setPrimeSiteLocation(e.target.value)}>
                                        {sites.map((site) => (<MenuItem key={site} value={site}>{site}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Box>
                             {/* Years of Experience - Required */}
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth required>
                                    <InputLabel id="experience-label">Years of Experience</InputLabel>
                                    <Select labelId="experience-label" value={yearsOfExperience} label="Years of Experience" onChange={(e) => setYearsOfExperience(e.target.value)}>
                                        {yearsOfExperienceOptions.map((year) => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* Specialization - Required */}
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth required>
                                    <InputLabel id="specialization-label">Specialization</InputLabel>
                                    <Select labelId="specialization-label" value={specialization} label="Specialization" onChange={(e) => setSpecialization(e.target.value)}>
                                        {specializations.map((spec) => (<MenuItem key={spec} value={spec}>{spec}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* Emergency Contacts - unchanged */}
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Emergency Contact Name" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Emergency Contact Phone" type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Optional Details Section */}
                        <Typography variant="h5">Optional Details</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5 }}>
                                    Upload Profile Picture
                                    <input type="file" hidden accept="image/*" onChange={handleProfilePictureChange} />
                                </Button>
                                {profilePicture && (<Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>{profilePicture.name} selected</Typography>)}
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <FormControl fullWidth>
                                    <InputLabel id="language-label">Preferred Language</InputLabel>
                                    <Select labelId="language-label" value={preferredLanguage} label="Preferred Language" onChange={(e) => setPreferredLanguage(e.target.value)}>
                                        {languages.map((lang) => (<MenuItem key={lang} value={lang}>{lang}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        
                        <Divider sx={{ my: 4 }} />

                        {/* Document Status Section */}
                        <Typography variant="h5">Document Status (Required)</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                             <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Health Checkup Valid Until" type="date" InputLabelProps={{ shrink: true }} value={healthCheckupValidUntil} onChange={(e) => setHealthCheckupValidUntil(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Medical Fitness Certificate Valid Until" type="date" InputLabelProps={{ shrink: true }} value={medicalFitnessValidUntil} onChange={(e) => setMedicalFitnessValidUntil(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Audiometry Report Valid Until" type="date" InputLabelProps={{ shrink: true }} value={audiometryValidUntil} onChange={(e) => setAudiometryValidUntil(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Vision Test Report Valid Until" type="date" InputLabelProps={{ shrink: true }} value={visionValidUntil} onChange={(e) => setVisionValidUntil(e.target.value)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                <TextField required fullWidth label="Training Certifications Valid Until" type="date" InputLabelProps={{ shrink: true }} value={trainingCertValidUntil} onChange={(e) => setTrainingCertValidUntil(e.target.value)} />
                            </Box>
                        </Box>

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 5, py: 1.8 }} disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}