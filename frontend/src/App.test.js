import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as dicomApi from './api/dicomApi';

// Mock the API module
jest.mock('./api/dicomApi');

test('renders DICOM Metadata Viewer title', () => {
  render(<App />);
  const linkElement = screen.getByText(/DICOM Metadata Viewer/i);
  expect(linkElement).toBeInTheDocument();
});

test('handles metadata fetching', async () => {
  dicomApi.fetchMetadata.mockResolvedValueOnce({
    "PatientID": "12345",
    "StudyDate": "20230101"
  });

  render(<App />);

  // Find input and button
  const input = screen.getByPlaceholderText(/e.g., my-bucket\/path\/to\/image.dcm/i);
  const button = screen.getByRole('button', { name: /load/i });

  // Type path
  fireEvent.change(input, { target: { value: 'test-bucket/test.dcm' } });

  // Click load
  fireEvent.click(button);

  // Expect loading state?
  // expect(screen.getByRole('progressbar')).toBeInTheDocument();

  // Wait for result
  await waitFor(() => {
    expect(screen.getByText('PatientID')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });
});

test('handles fetch error', async () => {
  dicomApi.fetchMetadata.mockRejectedValueOnce(new Error("Failed to download"));

  render(<App />);

  const input = screen.getByPlaceholderText(/e.g., my-bucket\/path\/to\/image.dcm/i);
  const button = screen.getByRole('button', { name: /load/i });

  fireEvent.change(input, { target: { value: 'bad/path.dcm' } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to download');
  });
});
