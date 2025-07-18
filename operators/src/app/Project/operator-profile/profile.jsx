"use client";

import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';

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
  },
});

const sampleOperator = {
  operatorId: 'OP12345',
  name: 'John Doe',
  age: 35,
  yearsOfExperience: 10,
  department: 'Heavy Machinery',
  healthCheckupValidUntil: '2025-11-01',
  documentStatus: {
    medicalFitnessValidUntil: '2025-09-01',
    audiometryValidUntil: '2025-08-15',
    visionValidUntil: '2025-12-10',
    trainingCertValidUntil: '2026-01-01',
  },
};

const ProfilePage = () => {
  const operator = sampleOperator;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Operator Profile
        </Typography>

        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Name</Typography>
                <Typography variant="body1">{operator.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Operator ID</Typography>
                <Typography variant="body1">{operator.operatorId}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Age</Typography>
                <Typography variant="body1">{operator.age}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Experience</Typography>
                <Typography variant="body1">
                  {operator.yearsOfExperience} years
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Department</Typography>
                <Typography variant="body1">{operator.department}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box mt={4}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Health & Certification
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Health Checkup Valid Until</Typography>
                <Chip label={operator.healthCheckupValidUntil} color="success" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Medical Fitness Certificate</Typography>
                <Chip
                  label={operator.documentStatus.medicalFitnessValidUntil}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Audiometry Test</Typography>
                <Chip
                  label={operator.documentStatus.audiometryValidUntil}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Vision Test</Typography>
                <Chip
                  label={operator.documentStatus.visionValidUntil}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Training Certificate</Typography>
                <Chip
                  label={operator.documentStatus.trainingCertValidUntil}
                  color="success"
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ProfilePage;
