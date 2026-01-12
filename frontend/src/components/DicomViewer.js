import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Container,
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
        if (!path) return;

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

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                DICOM Metadata Viewer
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box display="flex" gap={2}>
                    <TextField
                        fullWidth
                        label="S3 Path (bucket/key)"
                        variant="outlined"
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., my-bucket/path/to/image.dcm"
                        disabled={loading}
                    />
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSearch}
                        disabled={loading || !path.trim()}
                        sx={{ minWidth: '120px' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Load'}
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Paper>

            {metadata && (
                <MetadataTable data={metadata} />
            )}
        </Container>
    );
};

export default DicomViewer;
