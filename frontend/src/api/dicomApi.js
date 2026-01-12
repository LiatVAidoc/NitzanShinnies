import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Fetches DICOM metadata from the backend.
 * @param {string} path - The S3 path or identifier for the DICOM file.
 * @param {Array<string>} [fields] - Optional list of fields to extract.
 * @returns {Promise<Object>} - The extracted metadata.
 */
export const fetchMetadata = async (path, fields = null) => {
    try {
        const payload = { path };
        if (fields) {
            payload.fields = fields;
        }

        const response = await axios.post(`${API_BASE_URL}/dicom-metadata`, payload);
        return response.data;
    } catch (error) {
        // Rethrow the error with a useful message or the backend's error message
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error(error.message || 'Failed to fetch metadata');
    }
};
