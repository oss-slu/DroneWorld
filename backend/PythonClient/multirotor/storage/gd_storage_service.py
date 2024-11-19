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
        Uploads a file to Google Drive, creating folders as necessary.

        Args:
            file_name (str): The path of the file including folder hierarchy (e.g., 'folder1/folder2/file.txt').
            content (str or bytes): The content of the file to upload.
            content_type (str): The MIME type of the file.
        """
        # Ensure content is bytes
        if isinstance(content, str):
            content = content.encode('utf-8')  # You can choose a different encoding if needed

        # Handle folder creation and navigation
        parent_id = self.folder_id
        path_parts = file_name.strip('/').split('/')
        for folder_name in path_parts[:-1]:  # All parts except the last (which is the file name)
            with self._lock:  # Acquire lock to prevent race conditions
                folder_id = self._get_or_create_folder(folder_name, parent_id)
                if not folder_id:
                    print(f"Failed to get or create folder '{folder_name}' under parent ID '{parent_id}'")
                    return
                parent_id = folder_id

        # Prepare the file metadata and media
        file_metadata = {
            'name': path_parts[-1],
            'parents': [parent_id]
        }
        media = MediaInMemoryUpload(content, mimetype=content_type)

        # Upload the file
        try:
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            print(f"File '{file_name}' uploaded to Google Drive with ID: {file.get('id')}.")
        except Exception as e:
            print(f"Failed to upload file '{file_name}': {e}")

    def _get_or_create_folder(self, folder_name, parent_id):
        """
        Retrieves the folder ID if it exists, or creates it if it doesn't.

        Args:
            folder_name (str): The name of the folder.
            parent_id (str): The ID of the parent folder.

        Returns:
            str: The ID of the retrieved or created folder.
        """
        # Escaping single quotes in folder_name to prevent query issues
        escaped_folder_name = folder_name.replace("'", "\\'")

        # Check if the folder already exists
        query = (
            f"mimeType='application/vnd.google-apps.folder' and "
            f"name='{escaped_folder_name}' and "
            f"'{parent_id}' in parents and trashed=false"
        )
        try:
            results = self.service.files().list(
                q=query,
                fields="files(id, name)",
                spaces='drive'
            ).execute()
            items = results.get('files', [])
            if items:
                if len(items) > 1:
                    print(f"Multiple folders named '{folder_name}' found under parent ID '{parent_id}'. Using the first one.")
                return items[0]['id']
            else:
                # Folder does not exist; create it
                file_metadata = {
                    'name': folder_name,
                    'mimeType': 'application/vnd.google-apps.folder',
                    'parents': [parent_id]
                }
                folder = self.service.files().create(
                    body=file_metadata,
                    fields='id'
                ).execute()
                print(f"Created folder '{folder_name}' with ID: {folder.get('id')}")
                return folder.get('id')
        except Exception as e:
            print(f"Error while getting or creating folder '{folder_name}': {e}")
            return None
