import os

def get_storage_service():
    """Return an instance of the configured storage service.

    Supported storage types (env `STORAGE_TYPE`):
    - `local` (default): writes under `$LOCAL_STORAGE_ROOT/reports` or `~/reports`.
    - `gcs`: Google Cloud Storage bucket defined by `GCS_BUCKET_NAME`.
    - `gdrive`: Google Drive folder defined by `GDRIVE_FOLDER_ID`.
    """

    storage_type = os.getenv('STORAGE_TYPE', 'local').lower()

    if storage_type == 'local':
        from .local_storage_service import LocalStorageService
        storage_root = os.getenv('LOCAL_STORAGE_ROOT')
        return LocalStorageService(storage_root=storage_root)

    if storage_type == 'gcs':
        from .gcs_storage_service import GCSStorageService
        bucket_name = os.getenv('GCS_BUCKET_NAME', 'droneworld')
        return GCSStorageService(bucket_name=bucket_name)

    if storage_type == 'gdrive':
        from .gd_storage_service import GoogleDriveStorageService
        folder_id = os.getenv('GDRIVE_FOLDER_ID', 'google drive folder ID')
        return GoogleDriveStorageService(folder_id=folder_id)

    raise ValueError(f"Unsupported STORAGE_TYPE '{storage_type}'")
