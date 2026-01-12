import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    AppBar,
    Toolbar
} from '@mui/material';
import { fetchMetadata } from '../api/dicomApi';
import MetadataTable from './MetadataTable';

const DicomViewer = () => {
    const [path, setPath] = useState('');
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!path.trim()) return;

        setLoading(true);
        setError(null);
        setMetadata(null);

        try {
            const data = await fetchMetadata(path);
            setMetadata(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const filename = metadata ? path.split('/').pop() : '';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            {/* Top Section: Fetch and Actions */}
            <Paper elevation={3} square sx={{ p: 2, zIndex: 1 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        DICOM Metadata Viewer
                    </Typography>
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
                        />
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={loading || !path.trim()}
                            sx={{ minWidth: '100px' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Load'}
                        </Button>
                    </Box>
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {filename && (
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                            File: {filename}
                        </Typography>
                    )}
                </Box>
            </Paper>

            {/* Bottom Section: Table View */}
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 2, bgcolor: '#f5f5f5' }}>
                <MetadataTable data={metadata} />
            </Box>
        </Box>
    );
};

export default DicomViewer;
