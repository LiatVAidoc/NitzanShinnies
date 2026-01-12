import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Radio,
    RadioGroup,
    Chip,
    FormLabel,
    FormControl
} from '@mui/material';
import { fetchCommonFields } from '../api/dicomApi';

const LoadConfigModal = ({
    open,
    onClose,
    loadingMode,
    setLoadingMode,
    customFields,
    setCustomFields
}) => {
    const [commonFields, setCommonFields] = useState([]);

    useEffect(() => {
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

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoadConfigModal;
