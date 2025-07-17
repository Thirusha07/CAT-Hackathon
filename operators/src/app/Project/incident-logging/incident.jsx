// src/app/Project/incident-logging/page.jsx (or equivalent path)

'use client';

import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Slider,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Define the theme directly in this file
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
        MuiAccordion: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: 'none',
                    border: '1px solid #E0E0E0',
                    '&:before': {
                        display: 'none',
                    },
                    '&.Mui-expanded': {
                        margin: 'auto',
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    borderRadius: '8px 8px 0 0',
                    backgroundColor: '#FAFAFA',
                    '&.Mui-expanded': {
                        minHeight: 48,
                    },
                },
                content: {
                    '&.Mui-expanded': {
                        margin: '12px 0',
                    },
                },
            },
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    borderTop: '1px solid #E0E0E0',
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

// Helper function to get random integer for default values
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

// Helper function to pick a random element from an array
const getRandomArrayElement = (arr) => arr[Math.floor(Math.random() * arr.length)];


// Main Component
export default function IncidentPredictionDemo() {
  const [mounted, setMounted] = useState(false);

  // Initialize states with *fixed, non-random* default values for SSR
  const [operatorFatigueScore, setOperatorFatigueScore] = useState(0.3);
  const [shiftHours, setShiftHours] = useState(6);
  const [machineTempAnomaly, setMachineTempAnomaly] = useState(1.0);
  const [hydraulicPressureFluctuation, setHydraulicPressureFluctuation] = useState(0.1);
  const [recentHarshEvents, setRecentHarshEvents] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState('Sunny');
  const [locationType, setLocationType] = useState('Open Pit');
  const [operatorExperienceYears, setOperatorExperienceYears] = useState(5);
  const [timeOfDayCategory, setTimeOfDayCategory] = useState('Day');
  const [taskType, setTaskType] = useState('Digging');

  const [predictedIncidentType, setPredictedIncidentType] = useState('None');
  const [predictionProbabilities, setPredictionProbabilities] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [loading, setLoading] = useState(false);

  // Use useEffect to set random initial values ONLY after the component mounts on the client
  useEffect(() => {
    const weatherOptions = ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Stormy', 'Foggy'];
    const locationOptions = ['Open Pit', 'Confined Area', 'Haul Road', 'Workshop Area', 'Processing Plant'];
    const timeOfDayOptions = ['Day', 'Night', 'Dawn/Dusk'];
    const taskOptions = ['Digging', 'Loading', 'Hauling', 'Grading', 'Maintenance'];

    setOperatorFatigueScore(getRandomFloat(0.1, 0.8));
    setShiftHours(getRandomInt(4, 11));
    setMachineTempAnomaly(getRandomFloat(-3, 8));
    setHydraulicPressureFluctuation(getRandomFloat(0.05, 0.6));
    setRecentHarshEvents(getRandomInt(0, 3));
    setWeatherCondition(getRandomArrayElement(weatherOptions));
    setLocationType(getRandomArrayElement(locationOptions));
    setOperatorExperienceYears(getRandomInt(1, 18));
    setTimeOfDayCategory(getRandomArrayElement(timeOfDayOptions));
    setTaskType(getRandomArrayElement(taskOptions));
    
    setMounted(true);
  }, []);

  // --- Call ML Prediction API ---
  const callPredictionAPI = async () => {
    setLoading(true);
    setAlertMessage('');
    setAlertSeverity('info');
    setPredictedIncidentType('None');
    setPredictionProbabilities({});

    const payload = {
      operatorFatigueScore,
      shiftHours,
      machineTempAnomaly,
      hydraulicPressureFluctuation,
      recentHarshEvents,
      weatherCondition,
      locationType,
      operatorExperienceYears,
      timeOfDayCategory,
      taskType
    };

    try {
      // Call your Next.js API route
      const response = await fetch('/api/predict', { // This points to your Next.js API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction from API');
      }

      const data = await response.json();
      const { predictedIncidentType: mlPredictedType, predictionProbabilities: mlProbabilities } = data;

      setPredictedIncidentType(mlPredictedType);
      setPredictionProbabilities(mlProbabilities);

      if (mlPredictedType !== 'None') {
        setAlertMessage(`CRITICAL ALERT! High probability of a ${mlPredictedType} incident!`);
        setAlertSeverity(mlPredictedType === 'Fatigue' || mlPredictedType === 'Collision/Proximity' ? 'error' : 'warning');
      } else {
        setAlertMessage('No immediate incident predicted. Continue safe operation.');
        setAlertSeverity('success');
      }

    } catch (error) {
      console.error('Error during prediction API call:', error);
      setAlertMessage(`Error: ${error.message}. Check console for details.`);
      setAlertSeverity('error');
      setPredictedIncidentType('Error');
      setPredictionProbabilities({});
    } finally {
      setLoading(false);
    }
  };

  // Function to map prediction to Chip color
  const getChipColor = (type) => {
    switch (type) {
      case 'None': return 'success';
      case 'Fatigue': return 'error';
      case 'Mechanical': return 'warning';
      case 'Collision/Proximity': return 'error';
      case 'Environmental': return 'warning';
      case 'Error': return 'error'; // For error state
      default: return 'info';
    }
  };

  // Render null or a loading spinner until component is mounted to prevent hydration errors
  if (!mounted) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading Companion Interface...</Typography>
            </Box>
        </ThemeProvider>
    );
  }

  // Once mounted, render the full content
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            CAT Intelligent Operator Companion
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Simulating Real-time Incident Prediction for Mining Operations
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Input Panel */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Simulate Current Conditions</Typography>

              {/* Operator Status */}
              <Typography variant="h6" sx={{ mt: 3 }}>Operator Status</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="time-of-day-label">Time of Day</InputLabel>
                    <Select
                      labelId="time-of-day-label"
                      id="time-of-day-select"
                      value={timeOfDayCategory}
                      label="Time of Day"
                      onChange={(e) => setTimeOfDayCategory(e.target.value)}
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Night">Night</MenuItem>
                      <MenuItem value="Dawn/Dusk">Dawn/Dusk</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Shift Hours"
                    type="number"
                    value={shiftHours}
                    onChange={(e) => setShiftHours(Number(e.target.value) || 0)}
                    inputProps={{ min: 0, max: 12, step: 0.5 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>Operator Fatigue Score (0=Alert, 1=Very Fatigued)</Typography>
                  <Slider
                    value={operatorFatigueScore}
                    onChange={(e, newValue) => setOperatorFatigueScore(newValue)}
                    aria-labelledby="fatigue-slider"
                    min={0}
                    max={1}
                    step={0.05}
                    valueLabelDisplay="auto"
                    marks
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Operator Experience (Years)"
                    type="number"
                    value={operatorExperienceYears}
                    onChange={(e) => setOperatorExperienceYears(Number(e.target.value) || 0)}
                    inputProps={{ min: 1, max: 50, step: 1 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Machine Status */}
              <Typography variant="h6" sx={{ mt: 3 }}>Machine Status</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>Machine Temp Anomaly (Deg C from normal)</Typography>
                  <Slider
                    value={machineTempAnomaly}
                    onChange={(e, newValue) => setMachineTempAnomaly(newValue)}
                    aria-labelledby="temp-anomaly-slider"
                    min={-5}
                    max={10}
                    step={0.5}
                    valueLabelDisplay="auto"
                    marks
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>Hydraulic Pressure Fluctuation (0=Stable, 0.8=High)</Typography>
                  <Slider
                    value={hydraulicPressureFluctuation}
                    onChange={(e, newValue) => setHydraulicPressureFluctuation(newValue)}
                    aria-labelledby="pressure-fluctuation-slider"
                    min={0}
                    max={0.8}
                    step={0.05}
                    valueLabelDisplay="auto"
                    marks
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Environmental & Context */}
              <Typography variant="h6" sx={{ mt: 3 }}>Environmental & Context</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="weather-label">Weather Condition</InputLabel>
                    <Select
                      labelId="weather-label"
                      id="weather-select"
                      value={weatherCondition}
                      label="Weather Condition"
                      onChange={(e) => setWeatherCondition(e.target.value)}
                    >
                      <MenuItem value="Sunny">Sunny</MenuItem>
                      <MenuItem value="Rainy">Rainy</MenuItem>
                      <MenuItem value="Cloudy">Cloudy</MenuItem>
                      <MenuItem value="Windy">Windy</MenuItem>
                      <MenuItem value="Stormy">Stormy</MenuItem>
                      <MenuItem value="Foggy">Foggy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="location-label">Location Type</InputLabel>
                    <Select
                      labelId="location-label"
                      id="location-select"
                      value={locationType}
                      label="Location Type"
                      onChange={(e) => setLocationType(e.target.value)}
                    >
                      <MenuItem value="Open Pit">Open Pit</MenuItem>
                      <MenuItem value="Confined Area">Confined Area</MenuItem>
                      <MenuItem value="Haul Road">Haul Road</MenuItem>
                      <MenuItem value="Workshop Area">Workshop Area</MenuItem>
                      <MenuItem value="Processing Plant">Processing Plant</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Recent Harsh Events (Count)"
                    type="number"
                    value={recentHarshEvents}
                    onChange={(e) => setRecentHarshEvents(Number(e.target.value) || 0)}
                    inputProps={{ min: 0, max: 5, step: 1 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="task-type-label">Current Task Type</InputLabel>
                    <Select
                      labelId="task-type-label"
                      id="task-type-select"
                      value={taskType}
                      label="Current Task Type"
                      onChange={(e) => setTaskType(e.target.value)}
                    >
                      <MenuItem value="Digging">Digging</MenuItem>
                      <MenuItem value="Loading">Loading</MenuItem>
                      <MenuItem value="Hauling">Hauling</MenuItem>
                      <MenuItem value="Grading">Grading</MenuItem>
                      <MenuItem value="Maintenance">Maintenance</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 4, py: 1.5 }}
                onClick={callPredictionAPI} // Call the API function
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Incident Prediction'}
              </Button>
            </Paper>
          </Grid>

          {/* Output Panel */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Prediction Results</Typography>

              {alertMessage && (
                <Alert severity={alertSeverity} sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="body1" fontWeight="bold">{alertMessage}</Typography>
                  {predictedIncidentType !== 'None' && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Predicted incident type: <Chip label={predictedIncidentType} color={getChipColor(predictedIncidentType)} size="small" />
                    </Typography>
                  )}
                </Alert>
              )}

              <Typography variant="h6" sx={{ mt: 3 }}>Incident Probabilities:</Typography>
              {Object.keys(predictionProbabilities).length > 0 ? (
                <Grid container spacing={1}>
                  {Object.entries(predictionProbabilities)
                    .sort(([, probA], [, probB]) => probB - probA) // Sort by probability descending
                    .map(([type, prob]) => (
                      <Grid item xs={12} key={type}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1">{type}:</Typography>
                          <Chip
                            label={`${(prob * 100).toFixed(1)}%`}
                            color={getChipColor(type)}
                            size="medium"
                            sx={{ minWidth: '70px', justifyContent: 'flex-end' }}
                          />
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">Run a prediction to see probabilities.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}