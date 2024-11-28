def get_storage_service():
    """
    Returns an instance of the configured storage service.
    Modify this function to switch between different storage services.
    """
    # Uncomment the storage service you want to use and comment out the others.

    # For Google Cloud Storage
    from .gcs_storage_service import GCSStorageService
    return GCSStorageService(bucket_name='droneworld')

    # For Google Drive Storage
    # from .gd_storage_service import GoogleDriveStorageService
    # return GoogleDriveStorageService(folder_id='1zZ06TaCzqdPJlQ9Uc4VgJaawBZm3eTSS')
