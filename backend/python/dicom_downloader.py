import boto3
import json

with open('secrets.json') as r:
    aws_secrets = json.loads(r.read())  

class S3DicomDownloader:
    def __init__(self):
        self.s3 = boto3.client('s3', region_name=aws_secrets["REGION"],
                         aws_access_key_id=aws_secrets["AWS_ACCESS_KEY_ID"],
                         aws_secret_access_key=aws_secrets["AWS_SECRET_ACCESS_KEY"],
                         aws_session_token=aws_secrets["AWS_SESSION_TOKEN"])

    def download_dicom_file(self, s3_path, local_file_path):
        """
        Downloads a DICOM file from S3 to a local file path.

        Parameters:
        - s3_path: The S3 object path (e.g., 'BUCKET_NAME/folder/subfolder/dicomfile.dcm').
        - local_file_path: The local file path to save the DICOM file (e.g., '/local/path/dicomfile.dcm').
        """
        raise NotImplementedError

