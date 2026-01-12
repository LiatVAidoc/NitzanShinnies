# DICOM Metadata Viewer - Hands-On Coding Exercise

## Introduction

Welcome to the hands-on coding exercise for the Full Stack Developer position! This exercise is designed to evaluate your ability to implement a full-stack application using your preferred technology stack. You'll be building a simple application that retrieves and displays metadata from DICOM medical images stored in an AWS S3 bucket.

**Time Expectation:** 2-3 hours

## Project Overview

Medical imaging systems often store images in the DICOM (Digital Imaging and Communications in Medicine) format. These files contain both the image data and metadata about the patient, study, and imaging parameters. Your task is to build a web application that allows users to:

1. Enter the S3 path to a DICOM file
2. Download the file from S3
3. Extract and display its metadata in a user-friendly format

## Tech Stack Options

### Backend Options
- **Python**: Flask API with pydicom
- **Node.js**: Express API with dicom-parser

### Frontend Options
- **React**: with Material UI components
- **Vue.js**: with Vuetify components


## Instructions

1. **Choose Your Stack**: Select one backend and one frontend option from the available choices
2. **Implement the Requirements**: Complete the implementation for your chosen stack
3. **Submit Your Solution**: Follow the submission process outlined below

## Project Architecture

The project consists of two main components:

### Backend
- REST API built with your chosen backend technology
- Endpoint to retrieve DICOM files from S3
- DICOM parsing functionality
- Simple error handling

### Frontend
- Web application built with your chosen frontend framework
- Form to input S3 path
- Display for DICOM metadata
- Loading and error states

## Requirements

### Backend Requirements
1. Implement the method to download DICOM files from S3
2. Create an endpoint at `/api/dicom-metadata` that:
   - Accepts POST requests with an S3 path in the request body
   - Downloads the DICOM file from the provided S3 path
   - Extracts metadata using the appropriate DICOM library
   - Returns the metadata as JSON
3. Implement proper error handling for failed requests
4. Set up CORS to allow requests from the frontend

### Frontend Requirements
1. Create a form component that allows users to input an S3 path
   - Use the appropriate UI component library for your chosen framework
2. Implement form validation for the S3 path
3. Create a component to display the DICOM metadata in a clean, tabular format
4. Show appropriate loading indicators and error messages
5. Make the UI responsive and user-friendly

## Setup Instructions

### Backend Setup

#### Python (Flask)
1. Navigate to the `backend/python` directory
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```
   python app.py
   ```

#### Node.js (Express)
1. Navigate to the `backend/node` directory
2. Install the required packages:
   ```
   npm install
   ```
3. Run the Express application:
   ```
   npm start
   ```

### Frontend Setup

#### React
1. Navigate to the `frontend/react` directory
2. Install the required packages:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

#### Vue.js
1. Navigate to the `frontend/vue` directory
2. Install the required packages:
   ```
   npm install
   ```
3. Start the Vue application:
   ```
   npm run serve
   ```


### AWS Credentials Setup
- During the interview, you will receive a `secrets.json` file from one of our team members
- Place this file in your chosen backend directory
- **IMPORTANT**: Do NOT commit this file to the repository or share its contents
- **IMPORTANT**: Do NOT include this file in your PR
- The file contains sensitive AWS credentials needed to access the S3 bucket

## Implementation Guidelines

### S3 Path Format
The S3 path should be in the format: `bucket-name/path/to/file.dcm`

### DICOM Metadata Display
At minimum, display the following DICOM tags:
- PatientID
- StudyDate
- Modality
- InstitutionName
- StudyDescription

You can add more fields if desired.

### Testing
- Write tests for your backend API
- Write tests for your frontend components

## Evaluation Criteria

Your solution will be evaluated based on:

1. **Functionality**: Does the application work as expected?
2. **Code Quality**: Is your code well-structured, readable, and maintainable?
3. **Error Handling**: How does your application handle errors or edge cases?
4. **UI/UX**: Is the frontend intuitive and user-friendly?
5. **Testing**: Have you written appropriate tests for your code?
6. **Documentation**: Is your code well-documented?
7. **Scalability**: Have you considered how this solution might scale to handle larger datasets or more users?

## Submission Process

When you've completed the exercise:

1. Make sure all your code is committed to your branch
2. Create a Pull Request (PR) to the main branch
3. Ensure your PR does NOT include the `secrets.json` file
4. Your PR serves as your official submission for the exercise

## Post-Exercise Discussion

After completing the exercise, we will have a summary discussion where:

1. You will present your solution and walk through your implementation
2. We will discuss any challenges you faced and how you addressed them
3. You should be prepared to discuss potential improvements and refinements that would be relevant for a real-world, high-scale version of this project
4. We expect you to think about and articulate how your solution could be enhanced for:
   - Better performance with large datasets
   - Improved user experience
   - Enhanced security
   - Scalability considerations
   - Maintainability in a team environment

This discussion is an important part of the evaluation process and allows you to demonstrate your architectural thinking beyond the coding task itself.

## Example S3 Paths for Testing

For testing purposes, you can use the following S3 paths (these will work with the provided AWS credentials):

- `aidoc-dev-us-102-storage/production/scans/3041983076-1.2.826.0.1.3680043.9.6883.1.24209659964804056971019414433891120/anon-1.2.826.0.1.3680043.9.6883.1.11587754842360809093846306686786710.dcm`
- `aidoc-dev-us-102-storage/production/scans/4238504654-1.2.826.0.1.3680043.9.6883.1.32493157154612462868188386784309713/anon-1.2.826.0.1.3680043.9.6883.1.78029029927695039519419036767955471.dcm`
- `aidoc-dev-us-133-storage/production/scans/790532356-1.2.826.0.1.3680043.9.6883.1.23786564474194664558627539950275524/anon-1.2.826.0.1.3680043.9.6883.1.17588622695739916769169352722766541.dcm`

## Additional Resources

- [DICOM Standard](https://www.dicomstandard.org/)
- [pydicom Documentation](https://pydicom.github.io/)
- [dicom-parser Documentation](https://github.com/cornerstonejs/dicomParser)
- [dcm4che Documentation](https://github.com/dcm4che/dcm4che)
- [fo-dicom Documentation](https://github.com/fo-dicom/fo-dicom)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vue.js Documentation](https://vuejs.org/guide/introduction.html)
- [Angular Documentation](https://angular.io/docs)
- [Material UI Documentation](https://mui.com/)
- [Vuetify Documentation](https://vuetifyjs.com/)
- [Angular Material Documentation](https://material.angular.io/)
