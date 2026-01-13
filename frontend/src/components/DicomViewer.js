import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { fetchMetadata } from '../api/dicomApi';
import MetadataTable from './MetadataTable';
import DicomSearchArea from './DicomSearchArea';
import LoadConfigModal from './LoadConfigModal';

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

    const filename = loadedPath ? loadedPath.split('/').pop() : '';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', bgcolor: '#f5f5f5', p: 3 }}>
            {/* Top Section: Fetch and Actions */}
            <DicomSearchArea
                path={path}
                setPath={setPath}
                onSearch={handleSearch}
                loading={loading}
                error={error}
                setError={setError}
                onOpenConfig={() => setOpenConfig(true)}
                loadingMode={loadingMode}
                customFieldsCount={customFields ? customFields.split(',').length : 0}
            />

            {/* Bottom Section: Table View */}
            <Paper elevation={0} sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #e0e0e0', borderRadius: 3 }}>
                <MetadataTable data={metadata} filename={filename} />
            </Paper>

            {/* Configuration Modal */}
            <LoadConfigModal
                open={openConfig}
                onClose={() => setOpenConfig(false)}
                loadingMode={loadingMode}
                setLoadingMode={setLoadingMode}
                customFields={customFields}
                setCustomFields={setCustomFields}
            />
        </Box>
    );
};

export default DicomViewer;
