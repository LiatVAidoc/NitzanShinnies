import io
import json
import os
import sys
from unittest.mock import MagicMock, mock_open, patch

import pytest
from botocore.exceptions import ClientError

# Add backend directory to sys.path to ensure imports work
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app
from plugins.s3_plugin import S3Plugin
from services.dicom_parse_service import DicomParseService
from services.dicom_read_service import DicomReadService

# --- DicomParseService Tests ---
class TestDicomParseService:
    @patch('services.dicom_parse_service.dcmread')
    def test_parse_metadata(self, mock_dcmread):
        # Mock dataset with iteration support
        mock_ds = MagicMock()
        
        # Create mock elements
        elem1 = MagicMock()
        elem1.keyword = "PatientID"
        elem1.value = "123"
        elem1.VR = "LO"
        
        elem2 = MagicMock()
        elem2.keyword = "StudyDate"
        elem2.value = "20230101"
        elem2.VR = "DA"
        
        elem3 = MagicMock()
        elem3.keyword = "PixelData" # Should be skipped
        elem3.value = b"binary"
        elem3.VR = "OB"
        
        # Configure iteration
        mock_ds.__iter__.return_value = [elem1, elem2, elem3]
        
        mock_dcmread.return_value = mock_ds
        
        # Test input
        mock_file = MagicMock()
        
        result = DicomParseService.parse_metadata(mock_file)
        
        # Assertions
        mock_dcmread.assert_called_with(mock_file)
        assert result == {
            "PatientID": "123",
            "StudyDate": "20230101"
        }
        assert "PixelData" not in result

    @patch('services.dicom_parse_service.dcmread')
    def test_parse_metadata_complex_types(self, mock_dcmread):
        # Mock dataset with complex values
        mock_ds = MagicMock()
        
        elem1 = MagicMock()
        elem1.keyword = "MultiValue"
        elem1.value = ["A", "B"]
        elem1.VR = "LO"
        
        elem2 = MagicMock()
        elem2.keyword = "UnknownType"
        elem2.value = object() # Should be converted to str
        elem2.VR = "UN"
        
        elem3 = MagicMock()
        elem3.keyword = "BytesValue"
        elem3.value = b"decoded_string"
        elem3.VR = "UT"

        mock_ds.__iter__.return_value = [elem1, elem2, elem3]
        mock_dcmread.return_value = mock_ds
        
        result = DicomParseService.parse_metadata("dummy")
        
        assert result["MultiValue"] == ["A", "B"]
        assert isinstance(result["UnknownType"], str)
        assert result["BytesValue"] == "decoded_string"

    @patch('services.dicom_parse_service.dcmread')
    def test_parse_metadata_person_name_error(self, mock_dcmread):
        # Mock dataset with a PersonName-like object that fails on decode with 3 args
        mock_ds = MagicMock()
        
        # Simulate pydicom PersonName: it has a decode method but maybe different signature
        # The error was: "takes from 1 to 2 positional arguments but 3 were given"
        # meaning decode(self) or decode(self, encoding) but we called decode(encoding, errors)
        
        class MockPersonName:
            def __init__(self, name):
                self.name = name
            
            def decode(self, encoding=None):
                # This mock signature mimics what implies the error: 
                # takes 1 (self) to 2 (self, encoding) args.
                return self.name
            
            def __str__(self):
                return self.name

        elem1 = MagicMock()
        elem1.keyword = "PatientName"
        elem1.VR = "PN"
        elem1.value = MockPersonName("Doe^John")

        mock_ds.__iter__.return_value = [elem1]
        mock_dcmread.return_value = mock_ds
        
        # This should fail if the bug exists
        result = DicomParseService.parse_metadata("dummy")
        
        assert result["PatientName"] == "Doe^John"

    @patch('services.dicom_parse_service.dcmread')
    def test_parse_metadata_filtering(self, mock_dcmread):
        # Mock dataset
        mock_ds = MagicMock()
        
        elem1 = MagicMock()
        elem1.keyword = "PatientID"
        elem1.value = "123"
        elem1.VR = "LO"
        
        elem2 = MagicMock()
        elem2.keyword = "StudyDate"
        elem2.value = "20230101"
        elem2.VR = "DA"
        
        mock_ds.__iter__.return_value = [elem1, elem2]
        mock_dcmread.return_value = mock_ds
        
        # Test filtering
        result = DicomParseService.parse_metadata("dummy", fields=["PatientID"])
        
        assert result == {"PatientID": "123"}
        assert "StudyDate" not in result

def test_get_common_fields(client):
    response = client.get('/api/common-fields')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert "PatientID" in data
    assert "Modality" in data

# --- S3Plugin Tests ---
class TestS3Plugin:
    @patch('plugins.s3_plugin.boto3')
    @patch('builtins.open', new_callable=mock_open, read_data='{"REGION": "us-east-1"}')
    def test_init_with_secrets(self, mock_file, mock_boto):
        plugin = S3Plugin()
        mock_boto.client.assert_called()

    @patch('plugins.s3_plugin.boto3')
    @patch('builtins.open', side_effect=FileNotFoundError)
    def test_init_without_secrets(self, mock_file, mock_boto):
        plugin = S3Plugin()
        mock_boto.client.assert_called_with('s3')

    def test_get_dicom_file_valid(self):
        # Mock S3 client instance
        mock_s3_client = MagicMock()
        
        # Setup plugin with mocked client
        with patch('plugins.s3_plugin.boto3.client', return_value=mock_s3_client), \
             patch('builtins.open', side_effect=FileNotFoundError):
            plugin = S3Plugin()
            
            # Call method
            result = plugin.get_dicom_file('bucket/folder/file.dcm')
            
            # Assertions
            mock_s3_client.download_fileobj.assert_called_with('bucket', 'folder/file.dcm', result)
            assert isinstance(result, io.BytesIO)

    @patch('plugins.s3_plugin.boto3')
    def test_get_dicom_file_invalid_format(self, mock_boto):
        with patch('builtins.open', side_effect=FileNotFoundError):
             plugin = S3Plugin()
             with pytest.raises(ValueError, match="Invalid S3 path format"):
                 plugin.get_dicom_file('invalid_path')

    @patch('plugins.s3_plugin.boto3')
    def test_get_dicom_file_generic_error(self, mock_boto):
        # Mock generic exception
        mock_s3_client = MagicMock()
        mock_s3_client.download_fileobj.side_effect = Exception("Generic error")
        
        with patch('plugins.s3_plugin.boto3.client', return_value=mock_s3_client), \
             patch('builtins.open', side_effect=FileNotFoundError):
            plugin = S3Plugin()
            
            with pytest.raises(Exception, match="Error downloading from S3"):
                plugin.get_dicom_file('bucket/file.dcm')

    @patch('plugins.s3_plugin.boto3')
    def test_get_dicom_file_client_error(self, mock_boto):
        # Mock ClientError
        mock_s3_client = MagicMock()
        error_response = {'Error': {'Code': '403', 'Message': 'Forbidden'}}
        mock_s3_client.download_fileobj.side_effect = ClientError(error_response, 'GetObject')
        
        with patch('plugins.s3_plugin.boto3.client', return_value=mock_s3_client), \
             patch('builtins.open', side_effect=FileNotFoundError):
            plugin = S3Plugin()
            
            with pytest.raises(Exception, match="S3 Error"):
                plugin.get_dicom_file('bucket/file.dcm')

# --- DicomReadService Tests ---
class TestDicomReadService:
    @patch('services.dicom_read_service.S3Plugin')
    @patch('services.dicom_read_service.DicomParseService')
    def test_get_metadata_success(self, MockParseService, MockS3Plugin):
        # Setup mocks
        mock_plugin = MockS3Plugin.return_value
        mock_stream = io.BytesIO(b"fake dicom content")
        mock_plugin.get_dicom_file.return_value = mock_stream
        
        expected_metadata = {"PatientID": "123"}
        MockParseService.parse_metadata.return_value = expected_metadata
        
        # Test
        service = DicomReadService()
        # Inject mock plugin explicitly
        service.plugins["s3"] = mock_plugin
        
        # Test without fields
        result = service.get_metadata('bucket/test.dcm')
        mock_plugin.get_dicom_file.assert_called_with('bucket/test.dcm')
        MockParseService.parse_metadata.assert_called_with(mock_stream, fields=None)
        assert result == expected_metadata
        
        # Test with fields
        fields = ["PatientID"]
        service.get_metadata('bucket/test.dcm', fields=fields)
        MockParseService.parse_metadata.assert_called_with(mock_stream, fields=fields)

# --- API Tests ---
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

class TestAPI:
    @patch('app.DicomReadService')
    def test_get_dicom_metadata_success(self, MockService, client):
        # Mock service behavior
        mock_service_instance = MockService.return_value
        mock_service_instance.get_metadata.return_value = {"PatientID": "123"}
        
        # Test without fields
        response = client.post('/api/dicom-metadata', json={'path': 'bucket/file.dcm'})
        
        assert response.status_code == 200
        assert response.json == {"PatientID": "123"}
        mock_service_instance.get_metadata.assert_called_with('bucket/file.dcm', fields=None)

        # Test with fields
        response = client.post('/api/dicom-metadata', json={'path': 'bucket/file.dcm', 'fields': ['PatientID']})
        assert response.status_code == 200
        mock_service_instance.get_metadata.assert_called_with('bucket/file.dcm', fields=['PatientID'])

    def test_get_dicom_metadata_missing_param(self, client):
        response = client.post('/api/dicom-metadata', json={})
        assert response.status_code == 400
        assert "Missing 'path'" in response.json['error']

    @patch('app.DicomReadService')
    def test_get_dicom_metadata_invalid_path_format(self, MockService, client):
        mock_service_instance = MockService.return_value
        mock_service_instance.get_metadata.side_effect = ValueError("Invalid S3 path format")
        
        response = client.post('/api/dicom-metadata', json={'path': 'invalidpath'})
        
        assert response.status_code == 400
        assert "Invalid S3 path format" in response.json['error']

    @patch('app.DicomReadService')
    def test_get_dicom_metadata_error(self, MockService, client):
        mock_service_instance = MockService.return_value
        mock_service_instance.get_metadata.side_effect = Exception("S3 access denied")
        
        response = client.post('/api/dicom-metadata', json={'path': 'bucket/file.dcm'})
        
        assert response.status_code == 500
        assert "S3 access denied" in response.json['error']

    def test_health(self, client):
        response = client.get('/health')
        assert response.status_code == 200
        assert response.json == {"message": "The server is running"}
