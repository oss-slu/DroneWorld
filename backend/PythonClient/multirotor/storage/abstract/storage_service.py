# storage_service.py

from abc import ABC, abstractmethod

class StorageServiceInterface(ABC):
    """Interface for cloud storage services."""

    @abstractmethod
    def upload_to_service(self, file_name, content, content_type='text/plain'):
        """Uploads a file to the cloud storage service."""
        pass

    @abstractmethod
    def list_reports(self):
        """Lists all report batches from the storage service."""
        pass

    @abstractmethod
    def list_folder_contents(self, folder_name):
        """Lists the contents of a specific report folder."""
        pass

    @abstractmethod
    def serve_html(self, folder_name, relative_path):
        """Serves an HTML file from the storage service."""
        pass
