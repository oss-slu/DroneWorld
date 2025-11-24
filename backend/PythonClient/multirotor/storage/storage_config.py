import os

def get_storage_service():
    """
    Returns an instance of the configured storage service.
    Modify this function to switch between different storage services.
    """


    
    storage_type = os.getenv('STORAGE_TYPE', 'gcs')  # 'gcs' or 'gdrive'

    # For Google Cloud Storage
    if storage_type == 'gcs':
        from .gcs_storage_service import GCSStorageService
        bucket_name = os.getenv('GCS_BUCKET_NAME', 'droneworld')
        return GCSStorageService(bucket_name=bucket_name)
    elif storage_type == 'gdrive':
        from .gd_storage_service import GoogleDriveStorageService
        folder_id = os.getenv('GDRIVE_FOLDER_ID', 'google drive folder ID')
        return GoogleDriveStorageService(folder_id=folder_id)
    elif storage_type == 'local':
        from .local_storage_service import LocalStorageService
        return LocalStorageService()



    # For Google Drive Storage
    # from .gd_storage_service import GoogleDriveStorageService
    # return GoogleDriveStorageService(folder_id='1zZ06TaCzqdPJlQ9Uc4VgJaawBZm3eTSS')
