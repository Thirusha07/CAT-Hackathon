"use client"; // This component uses client-side hooks and interactivity

import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Divider,
    Button,
    CircularProgress,
    Alert,
    createTheme,
    ThemeProvider,
    CssBaseline,
    Grid, // Using Grid for the dashboard layout
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, // For route optimization table
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton // For modals
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudIcon from '@mui/icons-material/Cloud'; // Weather icon
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Location icon
import AltRouteIcon from '@mui/icons-material/AltRoute'; // Route icon
import CloseIcon from '@mui/icons-material/Close'; // Close icon for modal
import WarningIcon from '@mui/icons-material/Warning'; // Warning icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Success icon

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
        success: {
            main: '#4CAF50', // Green for success
        },
        warning: {
            main: '#FF9800', // Orange for warnings
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
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:active': {
                        transform: 'scale(0.98)',
                    },
                },
            },
        },
    }
});

// Helper function to calculate distance between two points (mock)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in km
};

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [currentSymptoms, setCurrentSymptoms] = useState([]); // Operator Health
    const [medicationList, setMedicationList] = useState(''); // Operator Health
    const [preExistingConditions, setPreExistingConditions] = useState(''); // Operator Health

    // Mock real-time biometric/environmental data
    const [heartRate, setHeartRate] = useState(75);
    const [bodyTemp, setBodyTemp] = useState(36.8);
    const [cabinTemp, setCabinTemp] = useState(23.2);
    const [cabinHumidity, setCabinHumidity] = useState(49);
    const [cabinCO2, setCabinCO2] = useState(484); // ppm

    // Mock Dashboard Data
    const [scheduledTasks, setScheduledTasks] = useState([
        { id: 1, title: 'Excavation for Foundation', time: '08:00 AM - 12:00 PM', status: 'On Track', location: 'Site A, Zone 3' },
        { id: 2, title: 'Material Hauling', time: '01:00 PM - 03:00 PM', status: 'Scheduled', location: 'Site A to Stockpile B' },
        { id: 3, title: 'Equipment Inspection', time: '03:30 PM - 04:00 PM', status: 'Scheduled', location: 'Maintenance Bay' },
    ]);

    const [machineMetrics, setMachineMetrics] = useState({
        engineHours: 1526.5,
        fuelUsed: 55, // Liters
        loadCycles: 15,
        idlingPercentage: 10,
        safetyAlertsTriggered: 2,
    });

    // New states for dashboard enhancements
    const [weatherForecast, setWeatherForecast] = useState(null);
    const [taskAllocationSuggestion, setTaskAllocationSuggestion] = useState(null);
    const [routeOptimizationSuggestion, setRouteOptimizationSuggestion] = useState(null);
    const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
    const [isTaskAllocationModalOpen, setIsTaskAllocationModalOpen] = useState(false);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

    useEffect(() => {
        // Simulate real-time health data updates
        const healthInterval = setInterval(() => {
            setHeartRate(Math.floor(Math.random() * (90 - 60 + 1)) + 60);
            setBodyTemp(parseFloat((36.5 + Math.random() * 1).toFixed(1)));
            setCabinTemp(parseFloat((20 + Math.random() * 5).toFixed(1)));
            setCabinHumidity(Math.floor(Math.random() * (70 - 40 + 1)) + 40);
            setCabinCO2(Math.floor(Math.random() * (800 - 400 + 1)) + 400);
        }, 3000); // Update every 3 seconds

        // Simulate machine metrics updates
        const machineMetricsInterval = setInterval(() => {
            setMachineMetrics(prev => ({
                ...prev,
                engineHours: parseFloat((prev.engineHours + 0.1).toFixed(1)),
                fuelUsed: parseFloat((prev.fuelUsed + Math.random() * 0.5).toFixed(1)),
                loadCycles: prev.loadCycles + Math.floor(Math.random() * 2),
                idlingPercentage: parseFloat((Math.random() * 15).toFixed(1)),
                safetyAlertsTriggered: prev.safetyAlertsTriggered + (Math.random() < 0.05 ? 1 : 0) // Small chance of new alert
            }));
        }, 5000); // Update every 5 seconds

        // Simulate fetching weather data (e.g., from a weather API)
        const fetchWeather = () => {
            // Mock severe weather for demonstration
            const mockSevereWeather = {
                date: 'Today',
                conditions: 'Heavy Rain',
                temperature: '18°C',
                windSpeed: '40 km/h',
                warnings: ['Flash Flood Advisory', 'Reduced Visibility', 'High Wind Warning'],
                impact: 'Severe impact on outdoor excavation and hauling tasks. Consider rescheduling.'
            };
            // Or mock clear weather:
            // const mockClearWeather = {
            //     date: 'Today',
            //     conditions: 'Clear Sky',
            //     temperature: '25°C',
            //     windSpeed: '10 km/h',
            //     warnings: [],
            //     impact: 'Optimal conditions for all tasks.'
            // };
            setWeatherForecast(mockSevereWeather);
        };

        // Simulate task allocation suggestion
        const fetchTaskAllocation = () => {
            const currentMachineLocation = { lat: 34.0522, lon: -118.2437, id: 'EXC001' };
            const newTask = { id: 'T004', name: 'Emergency Debris Removal', location: 'Downtown Area', lat: 34.0580, lon: -118.2550 };
            const otherMachines = [
                { id: 'LD002', lat: 34.0600, lon: -118.2500, status: 'Idle', type: 'Wheel Loader' },
                { id: 'TRK003', lat: 34.0400, lon: -118.2300, status: 'Operating', type: 'Dump Truck' },
                { id: 'EXC005', lat: 34.0500, lon: -118.2450, status: 'Idle', type: 'Excavator' } // Closer excavator
            ];

            const distances = otherMachines.map(machine => ({
                id: machine.id,
                type: machine.type,
                status: machine.status,
                distance: calculateDistance(newTask.lat, newTask.lon, machine.lat, machine.lon)
            })).sort((a, b) => a.distance - b.distance);

            setTaskAllocationSuggestion({
                newTask: newTask,
                optimalMachine: distances[0], // Closest machine
                otherNearby: distances.slice(1)
            });
        };

        // Simulate route optimization
        const fetchRouteOptimization = () => {
            const origin = 'Site A';
            const destination = 'Stockpile B';
            const routes = [
                { id: 1, name: 'Main Highway Route', duration: '30 min', congestion: 'Heavy', alternative: false },
                { id: 2, name: 'Local Roads Bypass', duration: '20 min', congestion: 'Light', alternative: true }
            ];
            setRouteOptimizationSuggestion({ origin, destination, routes });
        };

        fetchWeather();
        fetchTaskAllocation();
        fetchRouteOptimization();

        setLoading(false);

        return () => {
            clearInterval(healthInterval);
            clearInterval(machineMetricsInterval);
        };
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
            <Container
                component="main"
                maxWidth="lg" // Larger container for dashboard
                sx={{
                    py: { xs: 4, sm: 6, md: 8 },
                    background: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)',
                    minHeight: '100vh',
                }}
            >
                <Paper sx={{ p: { xs: 3, sm: 4, md: 5 }, mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <DashboardIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
                        <Typography component="h1" variant="h4">
                            Operator Dashboard
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                            <CircularProgress />
                            <Typography variant="h6" sx={{ ml: 2 }}>Loading Dashboard Data...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={4}>
                            {/* Daily Task Dashboard */}
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <AssignmentIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} />
                                        <Typography variant="h5">Daily Tasks</Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    {scheduledTasks.length > 0 ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {scheduledTasks.map(task => (
                                                <Paper key={task.id} variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                    <Typography variant="h6" color="text.primary">{task.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Time: {task.time}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Location: {task.location}</Typography>
                                                    <Typography variant="body2" color={task.status === 'On Track' ? 'success.main' : 'text.secondary'}>Status: {task.status}</Typography>
                                                </Paper>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body1" color="text.secondary">No tasks scheduled for today.</Typography>
                                    )}
                                </Paper>
                            </Grid>

                            {/* Machine Overview */}
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <LocalGasStationIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} />
                                        <Typography variant="h5">Machine Overview</Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Typography variant="body1">Engine Hours: <Typography component="span" fontWeight="bold" color="primary.main">{machineMetrics.engineHours}</Typography></Typography>
                                        <Typography variant="body1">Fuel Used: <Typography component="span" fontWeight="bold" color="primary.main">{machineMetrics.fuelUsed} L</Typography></Typography>
                                        <Typography variant="body1">Load Cycles: <Typography component="span" fontWeight="bold" color="primary.main">{machineMetrics.loadCycles}</Typography></Typography>
                                        <Typography variant="body1">Idling Percentage: <Typography component="span" fontWeight="bold" color={machineMetrics.idlingPercentage > 10 ? 'warning.main' : 'success.main'}>{machineMetrics.idlingPercentage}%</Typography></Typography>
                                        <Typography variant="body1">Safety Alerts Triggered: <Typography component="span" fontWeight="bold" color={machineMetrics.safetyAlertsTriggered > 0 ? 'error.main' : 'success.main'}>{machineMetrics.safetyAlertsTriggered}</Typography></Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Weather-aware Scheduling */}
                            {weatherForecast && (
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, height: '100%', bgcolor: weatherForecast.warnings.length > 0 ? 'error.lightest' : 'background.paper' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <CloudIcon sx={{ fontSize: 32, color: weatherForecast.warnings.length > 0 ? 'error.main' : 'info.main', mr: 1.5 }} />
                                            <Typography variant="h5">Weather Impact</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography variant="body1" fontWeight="bold">Conditions: {weatherForecast.conditions} ({weatherForecast.temperature}, {weatherForecast.windSpeed})</Typography>
                                        {weatherForecast.warnings.length > 0 ? (
                                            <Box sx={{ mt: 1, mb: 2 }}>
                                                <Typography variant="body2" color="error.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <WarningIcon sx={{ mr: 0.5 }} fontSize="small" /> Weather Warnings:
                                                </Typography>
                                                <List dense sx={{ ml: 1 }}>
                                                    {weatherForecast.warnings.map((warning, index) => (
                                                        <ListItem key={index} disablePadding> {/* Corrected ListItem structure */}
                                                            <ListItemText primary={<Typography variant="body2" color="error.main">- {warning}</Typography>} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    **Recommendation:** {weatherForecast.impact}
                                                </Typography>
                                                <Button variant="contained" color="error" size="small" sx={{ mt: 2 }} onClick={() => setIsWeatherModalOpen(true)}>View Details & Reschedule</Button>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <CheckCircleIcon sx={{ mr: 0.5 }} fontSize="small" /> Optimal weather conditions.
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            )}

                            {/* Location-specific Task Allocation */}
                            {taskAllocationSuggestion && (
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, height: '100%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <LocationOnIcon sx={{ fontSize: 32, color: 'info.main', mr: 1.5 }} />
                                            <Typography variant="h5">Task Allocation Suggestion</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            **New Task:** {taskAllocationSuggestion.newTask.name} at {taskAllocationSuggestion.newTask.location}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            **Optimal Machine:** {taskAllocationSuggestion.optimalMachine.id} ({taskAllocationSuggestion.optimalMachine.type}) - {taskAllocationSuggestion.optimalMachine.distance} km away. (Status: {taskAllocationSuggestion.optimalMachine.status})
                                        </Typography>
                                        <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={() => setIsTaskAllocationModalOpen(true)}>View Other Options</Button>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Route Optimization */}
                            {routeOptimizationSuggestion && (
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, height: '100%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <AltRouteIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} />
                                            <Typography variant="h5">Route Optimization</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            **Route from {routeOptimizationSuggestion.origin} to {routeOptimizationSuggestion.destination}:**
                                        </Typography>
                                        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Route Name</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Congestion</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {routeOptimizationSuggestion.routes.map((route) => (
                                                        <TableRow key={route.id} sx={{ bgcolor: route.alternative ? 'info.lightest' : 'inherit' }}>
                                                            <TableCell>{route.name} {route.alternative && '(Recommended)'}</TableCell>
                                                            <TableCell>{route.duration}</TableCell>
                                                            <TableCell sx={{ color: route.congestion === 'Heavy' ? 'error.main' : 'success.main' }}>{route.congestion}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={() => setIsRouteModalOpen(true)}>View Map & Traffic</Button>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Operator Health Details */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <HealthAndSafetyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
                                        <Typography variant="h5">Operator Health Details</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        *This information is used for proactive safety alerts and intelligent climate control. Highly sensitive data (medications, pre-existing conditions) is optional and handled with strict privacy protocols.
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    {/* Real-time Biometrics */}
                                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Real-time Biometrics (Simulated)</Typography>
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item xs={6} sm={4}>
                                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="body1" fontWeight="bold">Heart Rate</Typography>
                                                <Typography variant="h5" color="primary.main">{heartRate} bpm</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={4}>
                                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="body1" fontWeight="bold">Body Temp</Typography>
                                                <Typography variant="h5" color="primary.main">{bodyTemp}°C</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="body1" fontWeight="bold">Cabin Temp/Humidity</Typography>
                                                <Typography variant="h6" color="primary.main">{cabinTemp}°C / {cabinHumidity}%</Typography>
                                                <Typography variant="body2" color="text.secondary">CO2: {cabinCO2} ppm</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* Current Symptoms (Self-Reported) */}
                                    <Typography variant="h6" sx={{ mb: 1 }}>Current Symptoms (Self-Reported)</Typography>
                                    <FormGroup row sx={{ mb: 2 }}>
                                        <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Drowsy')} onChange={handleSymptomChange} value="Drowsy" />} label="Feeling Drowsy" />
                                        <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Headache')} onChange={handleSymptomChange} value="Headache" />} label="Headache" />
                                        <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Dizzy')} onChange={handleSymptomChange} value="Dizzy" />} label="Dizzy" />
                                        <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Nausea')} onChange={handleSymptomChange} value="Nausea" />} label="Nausea" />
                                        <FormControlLabel control={<Checkbox checked={currentSymptoms.includes('Fatigued')} onChange={handleSymptomChange} value="Fatigued" />} label="Fatigued" />
                                    </FormGroup>

                                    {/* Medication List & Pre-existing Conditions */}
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Medication List (Optional)" multiline rows={2} value={medicationList} onChange={(e) => setMedicationList(e.target.value)} placeholder="e.g., Ibuprofen, Allergy medication" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Pre-existing Conditions (Optional)" multiline rows={2} value={preExistingConditions} onChange={(e) => setPreExistingConditions(e.target.value)} placeholder="e.g., Diabetes, Hypertension" />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </Container>

            {/* Weather Modal */}
            <Dialog open={isWeatherModalOpen} onClose={() => setIsWeatherModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'error.main', color: 'white' }}>
                    Weather Alert & Task Adjustment
                    <IconButton aria-label="close" onClick={() => setIsWeatherModalOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 3 }}>
                    {weatherForecast && (
                        <Box>
                            <Typography variant="h6" color="error.main" sx={{ mb: 1 }}>
                                Current Conditions: {weatherForecast.conditions}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Temperature: {weatherForecast.temperature}, Wind: {weatherForecast.windSpeed}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>Warnings:</Typography>
                            <List dense sx={{ ml: 1 }}>
                                {weatherForecast.warnings.map((warning, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemText primary={<Typography variant="body2" color="error.main">- {warning}</Typography>} />
                                    </ListItem>
                                ))}
                            </List>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                **Impact:** {weatherForecast.impact}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                                Suggested Action:
                            </Typography>
                            <Typography variant="body2">
                                Reschedule "Excavation for Foundation" to a later time or day with better weather.
                                Consider indoor tasks or maintenance during severe weather.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsWeatherModalOpen(false)} variant="outlined">Close</Button>
                    <Button variant="contained" color="error">Reschedule Task</Button>
                </DialogActions>
            </Dialog>

            {/* Task Allocation Modal */}
            <Dialog open={isTaskAllocationModalOpen} onClose={() => setIsTaskAllocationModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'info.main', color: 'white' }}>
                    Task Allocation Details
                    <IconButton aria-label="close" onClick={() => setIsTaskAllocationModalOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 3 }}>
                    {taskAllocationSuggestion && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>New Task: {taskAllocationSuggestion.newTask.name}</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>Location: {taskAllocationSuggestion.newTask.location}</Typography>

                            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>Optimal Machine:</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {taskAllocationSuggestion.optimalMachine.id} ({taskAllocationSuggestion.optimalMachine.type}) - {taskAllocationSuggestion.optimalMachine.distance} km away. (Status: {taskAllocationSuggestion.optimalMachine.status})
                            </Typography>

                            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>Other Nearby Machines:</Typography>
                            <List dense>
                                {taskAllocationSuggestion.otherNearby.length > 0 ? (
                                    taskAllocationSuggestion.otherNearby.map((machine, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemText primary={`${machine.id} (${machine.type}) - ${machine.distance} km away. (Status: ${machine.status})`} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItemText primary="No other nearby machines." />
                                )}
                            </List>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsTaskAllocationModalOpen(false)} variant="outlined">Close</Button>
                    <Button variant="contained" color="info">Assign Task</Button>
                </DialogActions>
            </Dialog>

            {/* Route Optimization Modal */}
            <Dialog open={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                    Route Details & Map
                    <IconButton aria-label="close" onClick={() => setIsRouteModalOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 3 }}>
                    {routeOptimizationSuggestion && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Route from {routeOptimizationSuggestion.origin} to {routeOptimizationSuggestion.destination}
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Route Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Congestion</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {routeOptimizationSuggestion.routes.map((route) => (
                                            <TableRow key={route.id} sx={{ bgcolor: route.alternative ? 'info.lightest' : 'inherit' }}>
                                                <TableCell>{route.name} {route.alternative && '(Recommended)'}</TableCell>
                                                <TableCell>{route.duration}</TableCell>
                                                <TableCell sx={{ color: route.congestion === 'Heavy' ? 'error.main' : 'success.main' }}>{route.congestion}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                *In a real application, an interactive map showing the routes would be displayed here.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsRouteModalOpen(false)} variant="outlined">Close</Button>
                    <Button variant="contained" color="secondary">Start Navigation</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}