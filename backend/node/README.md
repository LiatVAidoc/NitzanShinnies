# Node.js Backend for DICOM Metadata Viewer

This is a Node.js Express API for retrieving and parsing DICOM files from AWS S3.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Add `secrets.json` file to the root directory (will be provided during the interview).

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /health` - Check if the server is running
- `POST /api/dicom-metadata` - Retrieve DICOM metadata from S3

## Implementation Requirements

1. Implement the `downloadDicomFile` and `parseDicomFile` functions in `dicom-downloader.js`
2. Complete the `/api/dicom-metadata` endpoint in `app.js`
3. Handle errors appropriately

## Testing

Run tests with:
```
npm test
``` 