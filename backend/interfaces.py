from abc import ABC, abstractmethod
from typing import BinaryIO

class DataSourcePlugin(ABC):
    @abstractmethod
    def get_dicom_file(self, source_path: str) -> BinaryIO:
        """
        Retrieves a DICOM file from the source.
        
        Args:
            source_path: The path or identifier for the file in the source.
            
        Returns:
            A file-like object containing the DICOM data.
        """
        pass # pragma: no cover
