# React Frontend for DICOM Metadata Viewer

This is a React application with Material UI components for viewing DICOM metadata.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

## Implementation Requirements

1. Create a form component with Material UI (MUI) that allows users to input an S3 path
   - Use a Card component to contain the form
   - Use a TextField for the S3 path input
2. Implement form validation for the S3 path
3. Create a component to display the DICOM metadata in a clean, tabular format
4. Show appropriate loading indicators and error messages
5. Make the UI responsive and user-friendly

## Project Structure

- `src/App.js` - Main application component
- `src/components` - React components
- `public/index.html` - HTML template

## Testing

To run tests:
```
npm test
``` 