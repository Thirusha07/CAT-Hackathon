"use client"; // This component uses client-side hooks and interactivity 

import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios'; // Ensure axios is imported

import { 
    Container, AppBar ,Toolbar ,
    Box, 
    Typography, 
    Paper, 
    Divider, 
    Button, 
    TextField, 
    CircularProgress, 
    Alert, 
    createTheme, 
    ThemeProvider, 
    CssBaseline, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Link, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails, 
    Chip, 
    Fab, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    IconButton, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem 
} from '@mui/material'; 
import SchoolIcon from '@mui/icons-material/School'; 
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; 
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; 
import BookIcon from '@mui/icons-material/Book'; 
import LightbulbIcon from '@mui/icons-material/Lightbulb'; 
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; 
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import SendIcon from '@mui/icons-material/Send'; 
import CloseIcon from '@mui/icons-material/Close'; 

// Define a custom theme for consistency (your existing theme) 
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

// Mock Data (your existing data) 
const videoModules = [ 
    { id: 'v1', title: 'Excavator: Precision Digging Techniques', machine: 'Excavator', duration: '12 min', recommendation: 'Fuel Efficiency Best Practices' }, 
    { id: 'v2', title: 'Wheel Loader: Optimal Loading Cycles', machine: 'Wheel Loader', duration: '8 min', recommendation: 'Idle Management and Shutdown Policy' }, 
    { id: 'v3', title: 'Dozer: Advanced Grading & Leveling', machine: 'Dozer', duration: '15 min', recommendation: 'Working Safely Around Ground Personnel' }, 
    { id: 'v4', title: 'Safety: Operating in Low Visibility', machine: 'All', duration: '10 min', recommendation: 'Proper Machine Travel and Braking Techniques' }, 
    { id: 'v5', title: 'Maintenance: Daily Fluid Checks', machine: 'All', duration: '5 min' }, 
    { id: 'v6', title: 'Advanced Fuel Saving Strategies', machine: 'All', duration: '7 min', recommendation: 'Fuel Efficiency Best Practices' }, 
    { id: 'v7', title: 'Minimizing Idle Time for Operators', machine: 'All', duration: '9 min', recommendation: 'Idle Management and Shutdown Policy' }, 
    { id: 'v8', title: 'Ground Crew Communication & Safety Protocols', machine: 'All', duration: '11 min', recommendation: 'Working Safely Around Ground Personnel' }, 
    { id: 'v9', title: 'Smooth Braking and Acceleration Drills', machine: 'All', duration: '13 min', recommendation: 'Proper Machine Travel and Braking Techniques' }, 
]; 

const faqs = [ 
    { question: 'How do I report a machine malfunction?', answer: 'Navigate to the Safety page and use the "Incident Logging" section. Select "Equipment Malfunction" and provide details.' }, 
    { question: 'Where can I find my daily task schedule?', answer: 'Your daily tasks are displayed on the Dashboard page upon login.' }, 
    { question: 'What should I do if a proximity alert triggers repeatedly?', answer: 'Immediately stop operation, assess your surroundings, and communicate with ground personnel or other machines. If necessary, log an incident on the Safety page.' }, 
    { question: 'How can I adjust the cabin temperature?', answer: 'The intelligent climate control system adjusts automatically based on your health and environmental data. For manual override, use the physical controls in the cabin.' }, 
]; 

// Mock for operator's current context (would come from real data in a full app) 
const mockOperatorContext = { 
    currentMachineType: 'Excavator', 
    currentWeather: 'Snowy', 
    currentLocation: 'Mountain Site', 
    performanceInsights: { 
        excessiveIdling: true, 
        unsafeOperationPatterns: false, 
        lowFuelEfficiency: true, 
    } 
}; 

// --- Training Hub Page Component --- 
export default function TrainingHubPage() { 
    const [userMessage, setUserMessage] = useState(''); 
    const [chatHistory, setChatHistory] = useState([]); 
    const [isGenerating, setIsGenerating] = useState(false); 
    const [isChatbotOpen, setIsChatbotOpen] = useState(false); 
    const chatContainerRef = useRef(null); 

    // --- New State for Alerts and Recommendations Dropdown --- 
    const [selectedAlert, setSelectedAlert] = useState(''); // Stores the trigger_event ID
    const [fetchedAlertRecommendations, setFetchedAlertRecommendations] = useState([]); // Stores the modules fetched from API
    const [loadingAlertRecommendations, setLoadingAlertRecommendations] = useState(false);
    const [alertRecommendationsError, setAlertRecommendationsError] = useState(null);

    // ... (rest of your component code) ...

// Fetch specific alert recommendations from API based on selectedAlert
useEffect(() => {
  const fetchAlertRecommendations = async () => {
    if (!selectedAlert) {
      setFetchedAlertRecommendations([]);
      return;
    }

    setLoadingAlertRecommendations(true);
    setAlertRecommendationsError(null);

    try {
      // --- THIS IS THE CRITICAL LINE TO CHECK AND CORRECT ---
     const response = await axios.get(
  `/api/traings/videos?alert_type=${encodeURIComponent(selectedAlert)}`
);

      if (response.data && Array.isArray(response.data.trainingModules)) {
        setFetchedAlertRecommendations(response.data.trainingModules);
      } else {
        setFetchedAlertRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching alert-based recommendations:", error);
      setAlertRecommendationsError("Failed to load recommendations. Please try again.");
      setFetchedAlertRecommendations([]);
    } finally {
      setLoadingAlertRecommendations(false);
    }
  };

  fetchAlertRecommendations();
}, [selectedAlert]);

// ... (rest of your component code) ...





    const handleAlertChange = (event) => { 
        setSelectedAlert(event.target.value); 
    }; 

    // Find the primary recommended video based on the first fetched module
    const recommendedVideoForAlert = React.useMemo(() => {
        if (fetchedAlertRecommendations.length === 0) return null;

        // Assuming the first module in the fetched list is the primary recommendation
        // You might want more sophisticated logic here (e.g., filter by type 'video')
        const primaryModule = fetchedAlertRecommendations[0];

        // Find a video in the local videoModules list that matches the fetched module's recommendation
        // This assumes a 'recommendation' field exists in your fetched module, 
        // or you can directly use the module's `title` or a specific ID if available.
        return videoModules.find(video => video.title === primaryModule.title); 
        // OR if your fetched modules directly contain enough info:
        // return {
        //     id: primaryModule._id,
        //     title: primaryModule.title,
        //     machine: primaryModule.machine, // Assuming this field comes from API
        //     duration: primaryModule.duration, // Assuming this field comes from API
        // };
    }, [fetchedAlertRecommendations]);


    // Contextual training recommendations logic (your existing logic) 
    const personalizedRecommendations = React.useMemo(() => { 
        const recommendations = []; 

        if (mockOperatorContext.currentWeather === 'Snowy') { 
            recommendations.push('Operating in Winter Conditions (Video)'); 
            recommendations.push('Snow Removal Techniques (Simulator)'); 
        } else if (mockOperatorContext.currentWeather === 'Rainy') { 
            recommendations.push('Wet Ground Operation Safety (Video)'); 
        } else if (mockOperatorContext.currentWeather === 'Dusty') { 
            recommendations.push('Air Filter Maintenance (Video)'); 
            recommendations.push('Visibility in Dusty Conditions (Guide)'); 
        } 

        if (mockOperatorContext.currentLocation === 'Mountain Site') { 
            recommendations.push('Operating on Slopes & Uneven Terrain (Video)'); 
            recommendations.push('Mountain Site Safety Regulations (Application Guide)'); 
        } else if (mockOperatorContext.currentLocation === 'Coastal Area') { 
            recommendations.push('Corrosion Prevention & Saline Environments (Guide)'); 
        } 

        if (mockOperatorContext.performanceInsights.excessiveIdling) { 
            recommendations.push('Fuel Efficiency Tips: Reducing Idling (Video)'); 
        } 
        if (mockOperatorContext.performanceInsights.unsafeOperationPatterns) { 
            recommendations.push('Smooth Operation & Control Techniques (Simulator)'); 
        } 
        if (mockOperatorContext.performanceInsights.lowFuelEfficiency) { 
            recommendations.push('Optimizing Fuel Consumption (Video)'); 
        } 

        recommendations.push(`${mockOperatorContext.currentMachineType} Controls & Basics (Video)`); 
        recommendations.push(`${mockOperatorContext.currentMachineType} Daily Inspection (Application Guide)`); 

        return [...new Set(recommendations)]; 
    }, [mockOperatorContext]); 

    // Scroll to bottom of chat 
    useEffect(() => { 
        if (chatContainerRef.current) { 
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; 
        } 
    }, [chatHistory]); 

    const handleSendMessage = async (e) => { 
        e.preventDefault(); 
        if (!userMessage.trim() || isGenerating) return; 

        const newUserMessage = { role: "user", parts: [{ text: userMessage }] }; 
        setChatHistory((prev) => [...prev, newUserMessage]); 
        setUserMessage(''); 
        setIsGenerating(true); 

        try { 
            const prompt = chatHistory.map(msg => msg.parts[0].text).join('\n') + '\nUser: ' + userMessage; 

            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] }; 
            const apiKey = "AIzaSyCcMsZfCDbe_pYP0F4dMunPilge5fk3HXs"; // Canvas will provide this API key at runtime 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; 

            const response = await fetch(apiUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            }); 

            if (!response.ok) { 
                const errorData = await response.json(); 
                throw new Error(`API error: ${response.status} - ${errorData.error.message || response.statusText}`); 
            } 

            const result = await response.json(); 
            let modelResponseText = "I'm sorry, I couldn't generate a response."; 

            if (result.candidates && result.candidates.length > 0 && 
                result.candidates[0].content && result.candidates[0].content.parts && 
                result.candidates[0].content.parts.length > 0) { 
                modelResponseText = result.candidates[0].content.parts[0].text; 
            } else { 
                console.warn("Unexpected Gemini API response structure:", result); 
            } 

            setChatHistory((prev) => [...prev, { role: "model", parts: [{ text: modelResponseText }] }]); 

        } catch (error) { 
            console.error("Error calling Gemini API:", error); 
            setChatHistory((prev) => [...prev, { role: "model", parts: [{ text: `Error: ${error.message}. Please try again.` }] }]); 
        } finally { 
            setIsGenerating(false); 
        } 
    }; 

    // Mock progress tracking data 
    const progressData = { 
        completedVideos: 5, 
        totalVideos: 15, 
        completedSimulations: 2, 
        totalSimulations: 5, 
        overallProgress: '45%', 
    }; 

    return ( 
        <ThemeProvider theme={theme}> 
            <CssBaseline /> 
            <AppBar position="static" color="primary" enableColorOnDark>
  <Toolbar sx={{ justifyContent: 'space-between' }}>
    <Typography variant="h6" component="div">
      Smart Operator
    </Typography>
    <Box>
      <Button color="inherit" href="/Project/health-documents">Health Docs</Button>
                    <Button color="inherit" href="/Project/training-hub">Operator Training Hub</Button>
      <Button color="inherit" href="/Project/daily-task">Daily Task</Button>
      <Button color="inherit" href="/Project/operator-profile">Operator Profile</Button>
      <Button color="inherit" href="/Project/login">Login</Button>
      <Button color="inherit" href="/Project/signup">Signup</Button>
      
    </Box>
  </Toolbar>
            <Container 
                component="main" 
                maxWidth="lg" 
                sx={{ 
                    py: { xs: 4, sm: 6, md: 8 }, 
                    background: 'transparent', 
                    minHeight: '100vh', 
                }} 
            > 
                <Paper sx={{ p: { xs: 3, sm: 4, md: 5 }, mb: 4 }}> 
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}> 
                        <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} /> 
                        <Typography component="h1" variant="h4"> 
                            Operator Training Hub 
                        </Typography> 
                    </Box> 

                    {/* --- Section for Alerts and Recommendations Dropdown --- */} 
                    <Box sx={{ mb: 4 }}> 
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> 
                            <LightbulbIcon sx={{ fontSize: 32, color: 'info.main', mr: 1.5 }} /> 
                            <Typography variant="h5">Alert-Based Recommendations</Typography> 
                        </Box> 
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}> 
                            Select an operational alert to see relevant training recommendations: 
                        </Typography> 
                        <FormControl fullWidth sx={{ mb: 3 }}> 
                            <InputLabel id="alert-select-label">Select Alert Type</InputLabel> 
                            <Select 
                                labelId="alert-select-label" 
                                id="alert-select" 
                                value={selectedAlert} 
                                label="Select Alert Type" 
                                onChange={handleAlertChange} 
                            > 
                                <MenuItem value=""> 
                                    <em>None</em> 
                                </MenuItem> 
                                {/* Dynamically generate MenuItems based on available trigger_events from your mock data or a static list */}
                                {/* For now, we'll use a hardcoded list of common triggers matching your API's expected `trigger_event` */}
                                <MenuItem value="High Fuel Consumption">High Fuel Consumption</MenuItem>
                                <MenuItem value="Excessive Idling">Excessive Idling</MenuItem>
                                <MenuItem value="Repeated Proximity Alerts">Repeated Proximity Alerts</MenuItem>
                                <MenuItem value="Frequent Hard Braking Events">Frequent Hard Braking Events</MenuItem>
                                {/* Add more as per your backend's trigger_event values */}
                            </Select> 
                        </FormControl> 

                        {loadingAlertRecommendations && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <CircularProgress size={24} />
                                <Typography sx={{ ml: 2 }}>Loading recommendations...</Typography>
                            </Box>
                        )}

                        {alertRecommendationsError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {alertRecommendationsError}
                            </Alert>
                        )}

                        {!loadingAlertRecommendations && fetchedAlertRecommendations.length > 0 && ( 
                            <Alert severity="info" sx={{ mb: 2 }}> 
                                <Typography variant="body1" fontWeight="bold"> 
                                    Recommended Training: 
                                </Typography> 
                                {/* Display all fetched recommendations */}
                                {fetchedAlertRecommendations.map((module, index) => (
                                    <Paper key={module._id || index} variant="outlined" sx={{ p: 2, mt: 1.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}> 
                                        <PlayCircleOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} /> 
                                        <Box> 
                                            <Typography variant="body1" fontWeight="bold">{module.title}</Typography> 
                                            <Typography variant="body2" color="text.secondary">
                                                Category: {module.category} | Duration: {module.duration}
                                            </Typography> 
                                            {module.inferredNeed && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Inferred Need: {module.inferredNeed}
                                                </Typography>
                                            )}
                                            <Button 
                                                variant="contained" 
                                                size="small" 
                                                sx={{ mt: 1 }} 
                                                onClick={() => alert(`Playing recommended training: ${module.title}`)} 
                                            > 
                                                Watch Now 
                                            </Button> 
                                        </Box> 
                                    </Paper> 
                                ))}
                            </Alert> 
                        )} 
                         {!loadingAlertRecommendations && selectedAlert && fetchedAlertRecommendations.length === 0 && !alertRecommendationsError && (
                            <Alert severity="info">
                                No specific training modules found for "{selectedAlert}" at this time.
                            </Alert>
                        )}
                        {!loadingAlertRecommendations && !selectedAlert && (
                            <Alert severity="info">
                                Select an alert type from the dropdown to view relevant training recommendations.
                            </Alert>
                        )}
                    </Box> 

                    <Divider sx={{ my: 4 }} /> 

                    {/* Personalized Training Recommendations */} 
                    <Box sx={{ mb: 4 }}> 
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> 
                            <LightbulbIcon sx={{ fontSize: 32, color: 'info.main', mr: 1.5 }} /> 
                            <Typography variant="h5">Personalized Recommendations</Typography> 
                        </Box> 
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}> 
                            Based on your current machine type ({mockOperatorContext.currentMachineType}), weather ({mockOperatorContext.currentWeather}), location ({mockOperatorContext.currentLocation}), and recent operational patterns: 
                        </Typography> 
                        {personalizedRecommendations.length > 0 ? ( 
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}> 
                                {personalizedRecommendations.map((rec, index) => ( 
                                    <Chip key={index} label={rec} color="info" variant="outlined" sx={{ bgcolor: 'info.light', color: 'info.contrastText' }} /> 
                                ))} 
                            </Box> 
                        ) : ( 
                            <Alert severity="info">No specific recommendations at this moment. Keep up the good work!</Alert> 
                        )} 
                    </Box> 

                    <Divider sx={{ my: 4 }} /> 

                    {/* Videos */} 
                    <Box sx={{ mb: 4 }}> 
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> 
                            <PlayCircleOutlineIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} /> 
                            <Typography variant="h5">Video Library</Typography> 
                        </Box> 
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}> 
                            {videoModules.map((video) => ( 
                                <Paper key={video.id} variant="outlined" sx={{ p: 2, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' }, flexGrow: 1 }}> 
                                    <Typography variant="h6" color="text.primary">{video.title}</Typography> 
                                    <Typography variant="body2" color="text.secondary">Machine: {video.machine}</Typography> 
                                    <Typography variant="body2" color="text.secondary">Duration: {video.duration}</Typography> 
                                    <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={() => alert(`Playing video: ${video.title}`)}>Watch Video</Button> 
                                </Paper> 
                            ))} 
                        </Box> 
                    </Box> 

                    <Divider sx={{ my: 4 }} /> 

                    {/* Application Guide */} 
                    <Box sx={{ mb: 4 }}> 
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> 
                            <BookIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} /> 
                            <Typography variant="h5">Application Guide</Typography> 
                        </Box> 
                        <Paper variant="outlined" sx={{ p: 3 }}> 
                            <Typography variant="body1" sx={{ mb: 2 }}> 
                                Access comprehensive guides for your machine models and operational procedures. 
                            </Typography> 
                            <List> 
                                <ListItem disablePadding> 
                                    <ListItemIcon><BookIcon color="action" /></ListItemIcon> 
                                    <ListItemText primary={<Link href="#" onClick={() => alert('Opening Excavator Operator Manual (Simulated PDF Viewer)')}>Excavator Operator Manual (PDF)</Link>} /> 
                                </ListItem> 
                                <ListItem disablePadding> 
                                    <ListItemIcon><BookIcon color="action" /></ListItemIcon> 
                                    <ListItemText primary={<Link href="#" onClick={() => alert('Opening Site Safety Regulations (Simulated Document)')}>Site A Safety Regulations (PDF)</Link>} /> 
                                </ListItem> 
                                <ListItem disablePadding> 
                                    <ListItemIcon><BookIcon color="action" /></ListItemIcon> 
                                    <ListItemText primary={<Link href="#" onClick={() => alert('Opening Advanced Troubleshooting Guide (Simulated Document)')}>Advanced Troubleshooting Guide</Link>} /> 
                                </ListItem> 
                            </List> 
                            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => alert('Navigating to full Application Guide library.')}>View All Guides</Button> 
                        </Paper> 
                    </Box> 

                    <Divider sx={{ my: 4 }} /> 

                    {/* Progress Tracking */} 
                    <Box sx={{ mb: 4 }}> 
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> 
                            <TrendingUpIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} /> 
                            <Typography variant="h5">Your Progress</Typography> 
                        </Box> 
                        <Paper variant="outlined" sx={{ p: 3 }}> 
                            <Typography variant="body1" sx={{ mb: 1 }}> 
                                Videos Completed: <Typography component="span" fontWeight="bold" color="primary.main">{progressData.completedVideos}</Typography> / {progressData.totalVideos} 
                            </Typography> 
                            <Typography variant="body1" sx={{ mb: 1 }}> 
                                Simulations Completed: <Typography component="span" fontWeight="bold" color="primary.main">{progressData.completedSimulations}</Typography> / {progressData.totalSimulations} 
                            </Typography> 
                            <Typography variant="h6" sx={{ mt: 2 }}> 
                                Overall Training Progress: <Typography component="span" fontWeight="bold" color="success.main">{progressData.overallProgress}</Typography> 
                            </Typography> 
                            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => alert('Navigating to detailed progress report.')}>View Detailed Report</Button> 
                        </Paper> 
                    </Box> 

                    {/* Placeholder for Instructor Booking / Simulation Module */} 
                    <Box sx={{ mb: 4 }}> 
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> 
                            <SchoolIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} /> 
                            <Typography variant="h5">Instructor Booking / Simulation Module</Typography> 
                        </Box> 
                        <Paper variant="outlined" sx={{ p: 3 }}> 
                            <Typography variant="body1" sx={{ mb: 2 }}> 
                                Book a session with an expert instructor or launch a full simulation module. 
                            </Typography> 
                            <Button variant="contained" sx={{ mr: 2 }} onClick={() => alert('Opening Instructor Booking form.')}>Book Instructor</Button> 
                            <Button variant="outlined" onClick={() => alert('Launching Simulation Module.')}>Launch Simulation</Button> 
                        </Paper> 
                    </Box> 

                    <Divider sx={{ my: 4 }} /> 

                    {/* FAQs */} 
                    <Box sx={{ mb: 4 }}> 
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> 
                            <HelpOutlineIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} /> 
                            <Typography variant="h5">Frequently Asked Questions (FAQs)</Typography> 
                        </Box> 
                        <Box> 
                            {faqs.map((faq, index) => ( 
                                <Accordion key={index} sx={{ mb: 1 }}> 
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />} 
                                        aria-controls={`panel${index}-content`} 
                                        id={`panel${index}-header`} 
                                    > 
                                        <Typography variant="body1" fontWeight="medium">{faq.question}</Typography> 
                                    </AccordionSummary> 
                                    <AccordionDetails> 
                                        <Typography variant="body2" color="text.secondary"> 
                                            {faq.answer} 
                                        </Typography> 
                                    </AccordionDetails> 
                                </Accordion> 
                            ))} 
                        </Box> 
                    </Box> 

                </Paper> 
                {/* Floating Action Button for Chatbot */} 
                <Fab 
                    color="primary" 
                    aria-label="chatbot" 
                    sx={{ position: 'fixed', bottom: 32, right: 32 }} 
                    onClick={() => setIsChatbotOpen(true)} 
                > 
                    <ChatBubbleOutlineIcon /> 
                </Fab> 

                {/* Chatbot Dialog/Modal */} 
                <Dialog 
                    open={isChatbotOpen} 
                    onClose={() => setIsChatbotOpen(false)} 
                    maxWidth="sm" 
                    fullWidth 
                    PaperProps={{ sx: { borderRadius: 3 } }} 
                > 
                    <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}> 
                        AI Assistant Chatbot 
                        <IconButton 
                            aria-label="close" 
                            onClick={() => setIsChatbotOpen(false)} 
                            sx={{ 
                                position: 'absolute', 
                                right: 8, 
                                top: 8, 
                                color: 'primary.contrastText', 
                            }} 
                        > 
                            <CloseIcon /> 
                        </IconButton> 
                    </DialogTitle> 
                    <DialogContent dividers sx={{ p: 0 }}> 
                        <Box ref={chatContainerRef} sx={{ height: 400, display: 'flex', flexDirection: 'column', p: 2, overflowY: 'auto', bgcolor: 'background.default' }}> 
                            {chatHistory.length === 0 && ( 
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}> 
                                    Ask me anything about machine operation, safety, or training! 
                                </Typography> 
                            )} 
                            {chatHistory.map((msg, index) => ( 
                                <Box key={index} sx={{ 
                                    display: 'flex', 
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                                    mb: 1 
                                }}> 
                                    <Paper 
                                        variant="outlined" 
                                        sx={{ 
                                            p: 1.5, 
                                            maxWidth: '70%', 
                                            bgcolor: msg.role === 'user' ? 'primary.light' : 'background.paper', 
                                            color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary', 
                                            borderRadius: msg.role === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0', 
                                            boxShadow: msg.role === 'user' ? '0px 2px 5px rgba(0,0,0,0.1)' : 'none', 
                                            border: msg.role === 'user' ? 'none' : '1px solid #E0E0E0' 
                                        }} 
                                    > 
                                        <Typography variant="body2">{msg.parts[0].text}</Typography> 
                                    </Paper> 
                                </Box> 
                            ))} 
                            {isGenerating && ( 
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}> 
                                    <Paper variant="outlined" sx={{ p: 1.5, maxWidth: '70%', bgcolor: 'background.paper', borderRadius: '15px 15px 15px 0' }}> 
                                        <CircularProgress size={20} /> 
                                        <Typography variant="body2" sx={{ ml: 1, display: 'inline' }}>Thinking...</Typography> 
                                    </Paper> 
                                </Box> 
                            )} 
                        </Box> 
                    </DialogContent> 
                    <DialogActions sx={{ p: 2, borderTop: '1px solid #E0E0E0' }}> 
                        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1, width: '100%' }}> 
                            <TextField 
                                fullWidth 
                                variant="outlined" 
                                placeholder="Type your message..." 
                                value={userMessage} 
                                onChange={(e) => setUserMessage(e.target.value)} 
                                disabled={isGenerating} 
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 25 } }} 
                            /> 
                            <Button 
                                type="submit" 
                                variant="contained" 
                                endIcon={<SendIcon />} 
                                disabled={isGenerating || !userMessage.trim()} 
                                sx={{ borderRadius: 25, px: 3 }} 
                            > 
                                Send 
                            </Button> 
                        </Box> 
                    </DialogActions> 
                </Dialog> 
            </Container> 
            </AppBar>

        </ThemeProvider> 
    ); 
}