from PythonClient.multirotor.storage.abstract.storage_service import StorageServiceInterface
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaInMemoryUpload
import threading

class GoogleDriveStorageService(StorageServiceInterface):
    """Concrete class of StorageServiceInterface, used for uploading to Google Drive"""

    _lock = threading.Lock()  # Class-level lock to prevent race conditions

    def __init__(self, folder_id='1zZ06TaCzqdPJlQ9Uc4VgJaawBZm3eTSS'):
        """
        Initializes the Google Drive client.

        Args:
            folder_id (str): The ID of the root folder where files will be uploaded.
        """
        SCOPES = ['https://www.googleapis.com/auth/drive']
        self.credentials = service_account.Credentials.from_service_account_file(
            'key.json', scopes=SCOPES)
        self.service = build('drive', 'v3', credentials=self.credentials)
        self.folder_id = folder_id  # The ID of the shared root folder

    def upload_to_service(self, file_name, content, content_type='text/plain'):
        """
        Uploads a file to the Google Drive.
        """
        
        with self._lock:  # Prevent race conditions
            try:
                # Prepare file metadata and content
                media = MediaInMemoryUpload(content.encode('utf-8'), mimetype=content_type)
                metadata = {'name': file_name, 'parents': [self.folder_id]}

                # Upload the file
                file_id = self.service.files().create(body=metadata, media_body=media, fields='id').execute().get('id')
                print(f"Uploaded '{file_name}' with ID: {file_id}")
                return file_id

            except Exception as e:
                print(f"Upload error: {e}")
                return None
