import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DicomViewer from './components/DicomViewer';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <DicomViewer />
      </div>
    </ThemeProvider>
  );
}

export default App;
