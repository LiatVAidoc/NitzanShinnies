from abc import ABC, abstractmethod
from typing import BinaryIO
import io

class DataSourcePlugin(ABC):
    @abstractmethod
    def get_dicom_file(self, source_path: str) -> io.BytesIO:
        """
        Retrieves a DICOM file from the source.
        
        Args:
            source_path: The path or identifier for the file in the source.
            
        Returns:
            A file-like object containing the DICOM data.
        """
        return None # pragma: no cover

class IDPPlugin(ABC):
    @abstractmethod
    def get_login_url(self, state: str) -> str:
        """
        Returns the URL to redirect the user to for login.
        
        Args:
            state: A random string to protect against CSRF attacks.
            
        Returns:
            The URL to redirect the user to.
        """
        pass # pragma: no cover

    @abstractmethod
    def exchange_code(self, code: str) -> dict:
        """
        Exchanges the auth code for user info/tokens.
        
        Args:
            code: The authorization code received from the IDP.
            
        Returns:
            A dictionary containing user information (e.g. {'sub': 'user_id', 'email': '...'})
        """
        pass # pragma: no cover

class NotFoundError(Exception):
    """Raised when a resource is not found."""
    pass
