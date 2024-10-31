from PythonClient.multirotor.storage.abstract.storage_service import StorageServiceInterface
from google.cloud import storage

class GCSStorageService(StorageServiceInterface):
    """Concrete class of StorageServiceInterface, used for uploading to GCS"""

    def __init__(self, bucket_name='droneworld'):
        """Initializes the GCS client and bucket."""
        self.storage_client = storage.Client.from_service_account_json('key.json') 
        self.bucket = self.storage_client.bucket(bucket_name)  # Use the bucket_name parameter

    def upload_to_service(self, file_name, content, content_type='text/plain'):
        """Uploads a file to the GCS bucket."""
        blob = self.bucket.blob(f'reports/{file_name}')
        blob.upload_from_string(content, content_type=content_type)
        print(f"File {file_name} uploaded to GCS.")
