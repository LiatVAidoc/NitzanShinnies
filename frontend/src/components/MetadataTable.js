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
    TextField,
    Tooltip
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SearchIcon from '@mui/icons-material/Search';

const MetadataTable = ({ data, filename, defaultColumns = ['PatientID', 'StudyDate', 'Modality', 'InstitutionName', 'StudyDescription'] }) => {
    const [visibleKeys, setVisibleKeys] = useState(defaultColumns);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // All available keys from the data
    const allKeys = data ? Object.keys(data) : [];

    useEffect(() => {
        if (data && visibleKeys.length === 0 && defaultColumns.length === 0) {
            setVisibleKeys(Object.keys(data));
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

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
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%" color="text.secondary" p={3}>
                <Typography variant="body1">No metadata loaded. Please enter a path and click Load.</Typography>
            </Box>
        );
    }

    const filteredKeys = allKeys.filter(key => {
        const isVisible = visibleKeys.includes(key);
        const matchesSearch = key.toLowerCase().includes(searchTerm) || String(data[key]).toLowerCase().includes(searchTerm);
        return isVisible && matchesSearch;
    }).sort();

    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderBottom="1px solid #e0e0e0">
                <Box display="flex" alignItems="center" gap={2}>
                    {filename ? (
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Viewing <Box component="span" color="primary.main">{filename}</Box>
                        </Typography>
                    ) : (
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Metadata</Typography>
                    )}
                </Box>
                <Box>
                    <TextField
                        size="small"
                        placeholder="Search values..."
                        variant="outlined"
                        InputProps={{
                            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                            sx: { borderRadius: 2 }
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
                    style: { width: '320px', borderRadius: 8, display: 'flex', flexDirection: 'column' }
                }}
            >
                <Box p={2} pb={1} sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: 'background.paper', zIndex: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', pl: 0.5 }}>
                        Show/Hide Fields
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={visibleKeys.length === allKeys.length && allKeys.length > 0}
                                indeterminate={visibleKeys.length > 0 && visibleKeys.length < allKeys.length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setVisibleKeys(allKeys);
                                    } else {
                                        setVisibleKeys([]);
                                    }
                                }}
                                size="small"
                                color="primary"
                            />
                        }
                        label={<Typography variant="body2" fontWeight="500">Select All</Typography>}
                        sx={{
                            mr: 0,
                            py: 0.5,
                            width: '100%',
                            '&:hover': { bgcolor: 'action.hover', borderRadius: 1 }
                        }}
                    />
                </Box>

                <Box p={2} pt={1} sx={{ overflowY: 'auto', maxHeight: '400px' }}>
                    <Box display="flex" flexDirection="column" gap={0.5}>
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
                                label={
                                    <Tooltip title={key} placement="left" arrow>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'block',
                                                maxWidth: '230px'
                                            }}
                                        >
                                            {key}
                                        </Typography>
                                    </Tooltip>
                                }
                                sx={{
                                    mr: 0,
                                    py: 0.25,
                                    width: '100%',
                                    '&:hover': { bgcolor: 'action.hover', borderRadius: 1 },
                                    // Default flex behavior aligns items effectively to the start.
                                    // Ensuring text takes available space but doesn't force space-between
                                    '& .MuiFormControlLabel-label': { width: '100%', overflow: 'hidden' }
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Popover>

            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '30%', backgroundColor: '#fafafa' }}><strong>Tag Name</strong></TableCell>
                            <TableCell style={{ backgroundColor: '#fafafa' }}><strong>Value</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredKeys.map((key) => (
                            <TableRow key={key} hover>
                                <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>{key}</TableCell>
                                <TableCell style={{ wordBreak: 'break-all' }}>{String(data[key])}</TableCell>
                            </TableRow>
                        ))}
                        {filteredKeys.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} align="center" sx={{ py: 3, color: 'text.secondary' }}>
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
