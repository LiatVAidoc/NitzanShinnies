from typing import Any, Dict, List, Optional

from interfaces import DataSourcePlugin
from plugins.s3_plugin import S3Plugin
from services.dicom_parse_service import DicomParseService

class DicomReadService:
    def __init__(self) -> None:
        # In a real app, we might inject plugins or load them dynamically
        self.plugins: Dict[str, DataSourcePlugin] = {
            "s3": S3Plugin()
        }

    def get_metadata(self, source_path: str, fields: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Orchestrates fetching the DICOM file and extracting metadata.
        
        Args:
            source_path: Path to the DICOM file. Currently assumes S3 format 'bucket/key'.
            fields: Optional list of fields to extract.
            
        Returns:
            Dictionary containing extracted metadata.
        """
        # Determine source type. For now, defaulting to S3.
        # Future improvement: parse prefix e.g., 's3://' or 'local://'
        plugin: DataSourcePlugin = self.plugins["s3"]
        
        dicom_file_stream = plugin.get_dicom_file(source_path)
        
        try:
            metadata = DicomParseService.parse_metadata(dicom_file_stream, fields=fields)
            return metadata
        finally:
            dicom_file_stream.close()
