import io
import json
import os

import boto3
from botocore.exceptions import ClientError

from interfaces import DataSourcePlugin, NotFoundError

class S3Plugin(DataSourcePlugin):
    def __init__(self) -> None:
        # Load secrets - normally this should be environment variables, but keeping existing pattern for now
        # Ideally we'd look for env vars first, then secrets.json
        secrets_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'secrets.json')
        try:
            with open(secrets_path) as r:
                aws_secrets = json.loads(r.read())
                
            self.s3 = boto3.client(
                's3', 
                region_name=aws_secrets.get("REGION"),
                aws_access_key_id=aws_secrets.get("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=aws_secrets.get("AWS_SECRET_ACCESS_KEY"),
                aws_session_token=aws_secrets.get("AWS_SESSION_TOKEN")
            )
        except FileNotFoundError:
             # Fallback to default credentials chain (useful if running on EC2 or if env vars set)
             self.s3 = boto3.client('s3')

    def get_dicom_file(self, source_path: str) -> io.BytesIO:
        """
        Downloads a file from S3.
        source_path expected format: "bucket_name/key/to/file"
        """
        parts = source_path.split('/', 1)
        if len(parts) != 2:
            raise ValueError(f"Invalid S3 path format. Expected 'bucket/key', got '{source_path}'")
        
        bucket_name, key = parts
        
        try:
            file_stream = io.BytesIO()
            self.s3.download_fileobj(bucket_name, key, file_stream)
            file_stream.seek(0)
            return file_stream
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code')
            if error_code == "404" or error_code == "NoSuchKey":
                raise NotFoundError(f"S3 Key not found: {source_path}")
            raise Exception(f"S3 Error: {str(e)}")
        except Exception as e:
             raise Exception(f"Error downloading from S3: {str(e)}")
