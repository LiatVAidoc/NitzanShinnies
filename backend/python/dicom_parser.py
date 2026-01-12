from pydicom import dcmread

class DicomParser:
    @staticmethod
    def parse_metadata(dicom_path):
        # Load DICOM file from path
        ds = dcmread(dicom_path)
        
        # Extract common metadata fields
        metadata = {
            "PatientID": getattr(ds, "PatientID", "Unknown"),
            "StudyDate": getattr(ds, "StudyDate", "Unknown"),
            "Modality": getattr(ds, "Modality", "Unknown"),
            "InstitutionName": getattr(ds, "InstitutionName", "Unknown"),
            "StudyDescription": getattr(ds, "StudyDescription", "None"),
        }
        
        return metadata
