import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DicomViewer from './components/DicomViewer';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';
import Login from './components/Login';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});



function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        // Exchange code for session
        try {
          const response = await fetch('http://localhost:8080/api/auth/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            // Clear URL code param
            window.history.replaceState({}, document.title, "/");
          } else {
            console.error("Auth callback failed");
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    // In a real app call backend logout
    setUser(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <AppBar position="static" sx={{ flexShrink: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AiDoc Viewer
            </Typography>
            {user && (
              <Button color="inherit" onClick={handleLogout}>Logout ({user.name})</Button>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {user ? (
            <DicomViewer />
          ) : (
            <Login />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
