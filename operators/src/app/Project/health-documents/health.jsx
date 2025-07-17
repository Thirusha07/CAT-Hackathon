"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    FormGroup,
    FormControlLabel,
    Checkbox,
    createTheme,
    ThemeProvider,
    CssBaseline
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'; // Icon for health
import DescriptionIcon from '@mui/icons-material/Description'; // Icon for documents

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
        }
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
    }
});

export default function OperatorHealthAndDocuments() {
    // Health Info (Self-Reported)
    const [currentSymptoms, setCurrentSymptoms] = useState([]);
    const [medicationList, setMedicationList] = useState('');
    const [preExistingConditions, setPreExistingConditions] = useState('');

    // Document Status
    const [medicalFitnessValidUntil, setMedicalFitnessValidUntil] = useState('');
    const [audiometryValidUntil, setAudiometryValidUntil] = useState('');
    const [visionValidUntil, setVisionValidUntil] = useState('');
    const [trainingCertValidUntil, setTrainingCertValidUntil] = useState('');

    // Mock real-time biometric/environmental data
    const [heartRate, setHeartRate] = useState(75);
    const [bodyTemp, setBodyTemp] = useState(36.8);
    const [cabinTemp, setCabinTemp] = useState(23.2);
    const [cabinHumidity, setCabinHumidity] = useState(49);
    const [cabinCO2, setCabinCO2] = useState(484); // ppm

    useEffect(() => {
        // Simulate real-time health data updates
        const healthInterval = setInterval(() => {
            setHeartRate(Math.floor(Math.random() * (90 - 60 + 1)) + 60);
            setBodyTemp(parseFloat((36.5 + Math.random() * 1).toFixed(1)));
            setCabinTemp(parseFloat((20 + Math.random() * 5).toFixed(1)));
            setCabinHumidity(Math.floor(Math.random() * (70 - 40 + 1)) + 40);
            setCabinCO2(Math.floor(Math.random() * (800 - 400 + 1)) + 400);
        }, 3000); // Update every 3 seconds

        return () => clearInterval(healthInterval);
    }, []);

    const handleSymptomChange = (event) => {
        const { value, checked } = event.target;
        setCurrentSymptoms((prev) =>
            checked ? [...prev, value] : prev.filter((symptom) => symptom !== value)
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Paper sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HealthAndSafetyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
                    <Typography variant="h5">Operator Health Details</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    *This information is used for proactive safety alerts and intelligent climate control. Highly sensitive data (medications, pre-existing conditions) is optional and handled with strict privacy protocols.
                </Typography>
                {/* Replaced Grid container with Box with flex properties */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flexBasis: '100%' }}>
                        <Typography variant="h6">Current Symptoms (Self-Reported)</Typography>
                        <FormGroup row>
                            <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Drowsy')} onChange={handleSymptomChange} value="Drowsy" />} label="Feeling Drowsy" />
                            <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Headache')} onChange={handleSymptomChange} value="Headache" />} label="Headache" />
                            <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Dizzy')} onChange={handleSymptomChange} value="Dizzy" />} label="Dizzy" />
                            <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Nausea')} onChange={handleSymptomChange} value="Nausea" />} label="Nausea" />
                            <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Fatigued')} onChange={handleSymptomChange} value="Fatigued" />} label="Fatigued" />
                        </FormGroup>
                    </Box>
                    <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                        <TextField fullWidth label="Medication List (Optional)" multiline rows={2} value={medicationList} onChange={(e) => setMedicationList(e.target.value)} placeholder="e.g., Ibuprofen, Allergy medication" />
                    </Box>
                    <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                        <TextField fullWidth label="Pre-existing Conditions (Optional)" multiline rows={2} value={preExistingConditions} onChange={(e) => setPreExistingConditions(e.target.value)} placeholder="e.g., Diabetes, Hypertension" />
                    </Box>
                    <Box sx={{ flexBasis: '100%' }}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Real-time Biometrics (Simulated)</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(33% - 10px)' } }}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body1" fontWeight="bold">Heart Rate</Typography>
                                    <Typography variant="h5" color="primary.main">{heartRate} bpm</Typography>
                                </Paper>
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(33% - 10px)' } }}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body1" fontWeight="bold">Body Temp</Typography>
                                    <Typography variant="h5" color="primary.main">{bodyTemp}°C</Typography>
                                </Paper>
                            </Box>
                            <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(33% - 10px)' } }}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body1" fontWeight="bold">Cabin Temp/Humidity</Typography>
                                    <Typography variant="h6" color="primary.main">{cabinTemp}°C / {cabinHumidity}%</Typography>
                                    <Typography variant="body2" color="text.secondary">CO2: {cabinCO2} ppm</Typography>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
                    <Typography variant="h5">Document Status</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    *Actual sensitive documents are stored in a secure, compliant HR/Medical system. This section reflects their validity status.
                </Typography>
                {/* Replaced Grid container with Box with flex properties */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                        <TextField fullWidth label="Medical Fitness Certificate Valid Until" value={medicalFitnessValidUntil} onChange={(e) => setMedicalFitnessValidUntil(e.target.value)} placeholder="YYYY-MM-DD" />
                    </Box>
                    <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                        <TextField fullWidth label="Audiometry Report Valid Until" value={audiometryValidUntil} onChange={(e) => setAudiometryValidUntil(e.target.value)} placeholder="YYYY-MM-DD" />
                    </Box>
                    <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                        <TextField fullWidth label="Vision Test Report Valid Until" value={visionValidUntil} onChange={(e) => setVisionValidUntil(e.target.value)} placeholder="YYYY-MM-DD" />
                    </Box>
                    <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                        <TextField fullWidth label="Training Certifications Valid Until" value={trainingCertValidUntil} onChange={(e) => setTrainingCertValidUntil(e.target.value)} placeholder="YYYY-MM-DD" />
                    </Box>
                    {/* Removed the Button for simulating document upload */}
                </Box>
            </Paper>
        </ThemeProvider>
    );
}
