from typing import Any, BinaryIO, Dict, List, Optional, Union

from pydicom import dcmread

class DicomParseService:
    @staticmethod
    def parse_metadata(dicom_file: Union[str, BinaryIO], fields: Optional[List[str]] = None) -> Dict[str, Any]:
        # Load DICOM file from path or file-like object
        ds = dcmread(dicom_file)
        
        # Extract all metadata fields
        metadata = {}
        for elem in ds:
            # Skip Pixel Data and other large binary fields
            if elem.keyword == "PixelData" or elem.VR in ("OB", "OW", "OF", "OD"):
                continue
            
            # Use keyword (e.g., 'PatientName') as key if available, else usage tag string
            key = elem.keyword if elem.keyword else str(elem.tag)
            
            # If fields list is provided, skip if key is not in list
            if fields is not None and key not in fields:
                continue
            
            # Handle multi-value fields and string decoding
            # pydicom handles value conversion for most types
            value = elem.value
            
            # Convert non-serializable types to strings/lists
            if hasattr(value, "decode"):
                value = value.decode("utf-8", "ignore")
            elif isinstance(value, (list, tuple)):
                value = [str(v) for v in value]
            elif not isinstance(value, (str, int, float, bool, type(None))):
                 value = str(value)
                 
            metadata[key] = value
        
        return metadata
