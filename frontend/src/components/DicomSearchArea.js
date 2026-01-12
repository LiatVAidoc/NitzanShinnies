import React from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const DicomSearchArea = ({
    path,
    setPath,
    onSearch,
    loading,
    error,
    setError,
    onOpenConfig,
    loadingMode,
    customFieldsCount
}) => {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
            <Box display="flex" flexDirection="column" gap={2}>
                {/* Input Area */}
                <Box display="flex" gap={2}>
                    <TextField
                        fullWidth
                        label="S3 Path (bucket/key)"
                        variant="outlined"
                        size="small"
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., my-bucket/path/to/image.dcm"
                        disabled={loading}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <Button
                        variant="outlined"
                        onClick={onOpenConfig}
                        sx={{ minWidth: '40px', borderRadius: 2 }}
                        aria-label="Load Configuration"
                    >
                        <SettingsIcon />
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onSearch}
                        disabled={loading || !path.trim()}
                        sx={{ minWidth: '100px', borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                        disableElevation
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Load'}
                    </Button>
                </Box>

                {/* Loading Config Summary */}
                <Typography variant="caption" color="text.secondary">
                    Loading Mode: {loadingMode === 'all' ? 'All Fields' : `Custom Fields (${customFieldsCount})`}
                </Typography>

                {error && (
                    <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Paper>
    );
};

export default DicomSearchArea;
