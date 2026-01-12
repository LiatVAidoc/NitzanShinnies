import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    Radio,
    RadioGroup,
    Chip,
    FormLabel,
    FormControl
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { fetchMetadata, fetchCommonFields } from '../api/dicomApi';
import MetadataTable from './MetadataTable';

const DicomViewer = () => {
    // Input state
    const [path, setPath] = useState('');

    // Loaded state (for display)
    const [loadedPath, setLoadedPath] = useState('');
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Advanced Loading State
    const [openConfig, setOpenConfig] = useState(false);
    const [loadingMode, setLoadingMode] = useState('all'); // 'all' | 'custom'
    const [customFields, setCustomFields] = useState(''); // Comma separated string
    const [commonFields, setCommonFields] = useState([]);

    React.useEffect(() => {
        const loadCommonFields = async () => {
            const fields = await fetchCommonFields();
            setCommonFields(fields);
        };
        loadCommonFields();
    }, []);

    const toggleCommonField = (field) => {
        const currentFields = customFields.split(',').map(f => f.trim()).filter(Boolean);
        if (currentFields.includes(field)) {
            setCustomFields(currentFields.filter(f => f !== field).join(', '));
        } else {
            setCustomFields([...currentFields, field].join(', '));
        }
    };

    const handleSearch = async () => {
        if (!path.trim()) return;

        setLoading(true);
        setError(null);
        setMetadata(null);
        setLoadedPath(''); // Reset loaded path until success

        try {
            // Prepare fields argument
            let fieldsToLoad = null;
            if (loadingMode === 'custom' && customFields.trim()) {
                fieldsToLoad = customFields.split(',').map(f => f.trim()).filter(Boolean);
            }

            const data = await fetchMetadata(path, fieldsToLoad);
            setMetadata(data);
            setLoadedPath(path);
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

    const filename = loadedPath ? loadedPath.split('/').pop() : '';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', bgcolor: '#f5f5f5', p: 3 }}>
            {/* Top Section: Fetch and Actions */}
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
                            onClick={() => setOpenConfig(true)}
                            sx={{ minWidth: '40px', borderRadius: 2 }}
                            aria-label="Load Configuration"
                        >
                            <SettingsIcon />
                        </Button>
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

                    {/* Loading Config Summary */}
                    <Typography variant="caption" color="text.secondary">
                        Loading Mode: {loadingMode === 'all' ? 'All Fields' : `Custom Fields (${customFields ? customFields.split(',').length : 0})`}
                    </Typography>

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

            {/* Configuration Modal */}
            <Dialog open={openConfig} onClose={() => setOpenConfig(false)} fullWidth maxWidth="sm">

                <DialogTitle>Load Configuration</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={3} pt={1}>
                        <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <FormLabel id="loading-mode-label" sx={{ mb: 0, mr: 2 }}>Fields to Load:</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="loading-mode-label"
                                name="loading-mode"
                                value={loadingMode}
                                onChange={(e) => setLoadingMode(e.target.value)}
                            >
                                <FormControlLabel value="all" control={<Radio />} label="Load All" />
                                <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                            </RadioGroup>
                        </FormControl>

                        {loadingMode === 'custom' && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    label="Selected Fields"
                                    multiline
                                    rows={3}
                                    placeholder="PatientID, StudyDate..."
                                    fullWidth
                                    value={customFields}
                                    onChange={(e) => setCustomFields(e.target.value)}
                                    helperText="Type manually or select from suggestions below."
                                />

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Common Fields
                                    </Typography>
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                        {commonFields.map((field) => {
                                            const isSelected = customFields.includes(field);
                                            return (
                                                <Chip
                                                    key={field}
                                                    label={field}
                                                    onClick={() => toggleCommonField(field)}
                                                    color={isSelected ? "primary" : "default"}
                                                    variant={isSelected ? "filled" : "outlined"}
                                                    clickable
                                                />
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfig(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DicomViewer;
