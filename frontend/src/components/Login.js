import React, { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/auth/login');
            if (!response.ok) {
                throw new Error('Failed to start login process');
            }
            const data = await response.json();
            if (data.loginUrl) {
                window.location.href = data.loginUrl;
            } else {
                throw new Error('No login URL received');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            bgcolor="grey.100"
        >
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                    AiDoc Viewer
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                    Please sign in to access the DICOM viewer.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleLogin}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? 'Redirecting...' : 'Login with SSO'}
                </Button>
            </Paper>
        </Box>
    );
};

export default Login;
