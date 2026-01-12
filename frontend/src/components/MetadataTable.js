import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Popover,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    TextField
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SearchIcon from '@mui/icons-material/Search';

const MetadataTable = ({ data, defaultColumns = ['PatientID', 'StudyDate', 'Modality'] }) => {
    // Convert dict to array of objects for easier handling if needed, 
    // but for a single DICOM file, we display Key-Value pairs.
    // Wait, the requirement was "dynamic tabular format". 
    // If we receive a single object {Key: Value}, the table should probably just show Rows of [Tag Name | Value].
    // BUT, the columns selector requirement "The table will include a feature to show/hide columns" implies we might be listing MULTIPLE DICOM files?
    // Or, more likely for a single file viewer, we want to filter WHICH Tags are shown.
    // "Initially, only the columns matching the backend's DEFAULT_TAGS will be visible." 
    // -> This suggests the "Columns" are actually the "Keys" (Metadata Tags).

    // So the table would look like: 
    // | Tag Name | Value |
    // And the "Columns Selector" essentially filters the rows based on the Tag Name.

    // Let's implement it as a Key-Value table where "Visible Columns" controls which KEYS are displayed.

    const [visibleKeys, setVisibleKeys] = useState(defaultColumns);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // All available keys from the data
    const allKeys = data ? Object.keys(data) : [];

    useEffect(() => {
        // If default columns are provided, ensure they are visible.
        // Also, if data has keys that are in defaultColumns, show them.
        // If data has new keys not in default, they start hidden.
        // If no defaults, maybe show all?
        if (data && visibleKeys.length === 0 && defaultColumns.length === 0) {
            setVisibleKeys(Object.keys(data));
        }
    }, [data]);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const toggleKey = (key) => {
        setVisibleKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const open = Boolean(anchorEl);

    if (!data || Object.keys(data).length === 0) {
        return <Typography variant="body1">No metadata to display.</Typography>;
    }

    // Filter keys based on visibility AND search term
    const filteredKeys = allKeys.filter(key => {
        const isVisible = visibleKeys.includes(key);
        const matchesSearch = key.toLowerCase().includes(searchTerm) || String(data[key]).toLowerCase().includes(searchTerm);

        // If we are "Searching", we might want to show hidden keys that match?
        // Or strict "Visible Columns" filtering?
        // "The table will include a feature to show/hide columns"
        // Usually "Column Selector" is strict.
        // Let's stick to: Only show visible keys.
        return isVisible && matchesSearch;
    }).sort();

    // Also we need to let the user enable other keys if they want.
    // The popover lists ALL keys to toggle.

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Metadata</Typography>
                <Box>
                    <TextField
                        size="small"
                        placeholder="Search values..."
                        variant="outlined"
                        InputProps={{
                            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        onChange={handleSearchChange}
                        sx={{ mr: 2 }}
                    />
                    <IconButton onClick={handleOpenMenu} aria-label="Select Columns">
                        <ViewColumnIcon />
                    </IconButton>
                </Box>
            </Box>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    style: { maxHeight: '300px', width: '250px', overflowY: 'auto' }
                }}
            >
                <Box p={2} display="flex" flexDirection="column">
                    <Typography variant="subtitle2" gutterBottom>Show/Hide Fields</Typography>
                    {allKeys.sort().map((key) => (
                        <FormControlLabel
                            key={key}
                            control={
                                <Checkbox
                                    checked={visibleKeys.includes(key)}
                                    onChange={() => toggleKey(key)}
                                    size="small"
                                />
                            }
                            label={key}
                        />
                    ))}
                </Box>
            </Popover>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Tag Name</strong></TableCell>
                            <TableCell><strong>Value</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredKeys.map((key) => (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{String(data[key])}</TableCell>
                            </TableRow>
                        ))}
                        {filteredKeys.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    No fields visible or matching search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MetadataTable;
