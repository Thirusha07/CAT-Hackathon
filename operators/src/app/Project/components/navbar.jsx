// components/Navbar.js
"use client"; // if using with app directory or client-side features

import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Caterpillar Training Hub
        </Typography>
        <Box>
          <Link href="/Project/health-documents" passHref>
            <Button color="inherit">Health Docs</Button>
          </Link>
          <Link href="/Project/daily-task" passHref>
            <Button color="inherit">Daily Task</Button>
          </Link>
          <Link href="/Project/operator-profile" passHref>
            <Button color="inherit">Operator Profile</Button>
          </Link>
          <Link href="/Project/login" passHref>
            <Button color="inherit">Login</Button>
          </Link>
          <Link href="/Project/signup" passHref>
            <Button color="inherit">Signup</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
