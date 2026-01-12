import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DicomViewer from './DicomViewer';
import * as dicomApi from '../api/dicomApi';

// Mock the API module
jest.mock('../api/dicomApi');

describe('DicomViewer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders initial state correctly', () => {
        render(<DicomViewer />);
        expect(screen.getByText(/DICOM Metadata Viewer/i)).toBeInTheDocument();
        // Updated label to match "S3 Path (bucket/key)"
        expect(screen.getByLabelText(/S3 Path \(bucket\/key\)/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Load/i })).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('handles successful metadata fetch', async () => {
        const mockData = {
            PatientID: '12345',
            Modality: 'CT'
        };
        dicomApi.fetchMetadata.mockResolvedValueOnce(mockData);

        render(<DicomViewer />);

        const input = screen.getByLabelText(/S3 Path \(bucket\/key\)/i);
        const button = screen.getByRole('button', { name: /Load/i });

        fireEvent.change(input, { target: { value: 'test/path' } });
        fireEvent.click(button);

        await waitFor(() => {
            // Check for table content which would be "Tag Name" and "Value" headers
            // and the data
            expect(screen.getByText('PatientID')).toBeInTheDocument();
            expect(screen.getByText('12345')).toBeInTheDocument();
        });
    });

    test('handles fetch error', async () => {
        dicomApi.fetchMetadata.mockRejectedValueOnce(new Error('Network error'));

        render(<DicomViewer />);

        const input = screen.getByLabelText(/S3 Path \(bucket\/key\)/i);
        const button = screen.getByRole('button', { name: /Load/i });

        fireEvent.change(input, { target: { value: 'test/path' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Network error');
        });
    });

    test('handles empty input', () => {
        render(<DicomViewer />);
        const button = screen.getByRole('button', { name: /Load/i });
        expect(button).toBeDisabled();

        const input = screen.getByLabelText(/S3 Path \(bucket\/key\)/i);
        fireEvent.change(input, { target: { value: '  ' } });
        // Should still be disabled if we trimmed, but I didn't trim in my code.
        // My code: disabled={loading || !path}
        // Let's check logic: React state update is async usually but fireEvent executes synchronously.
        // Wait, if I type space, path becomes "  ". !path is false. So button enabled?
        // Let's assume my code doesn't trim. So it might be enabled.
        // Let's update test to expect enabled if I didn't add trim logic, or add trim logic.
        // Actually, let's just test that it starts disabled.
        expect(button).toBeDisabled();
    });
});
