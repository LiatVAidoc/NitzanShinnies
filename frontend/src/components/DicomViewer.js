import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', bgcolor: '#f5f5f5', p: 3 }}>
            {/* Top Section: Fetch and Actions */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={loading || !path.trim()}
                            sx={{ minWidth: '100px', borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                            disableElevation
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Load'}
                        </Button>
                    </Box>
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </Paper>

            {/* Bottom Section: Table View */}
            <Paper elevation={0} sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #e0e0e0', borderRadius: 3 }}>
                <MetadataTable data={metadata} filename={filename} />
            </Paper>
        </Box>
    );
};

export default DicomViewer;
