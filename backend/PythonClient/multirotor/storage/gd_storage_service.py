from PythonClient.multirotor.storage.abstract.storage_service import StorageServiceInterface
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaInMemoryUpload, MediaIoBaseDownload
import threading
import base64
from io import BytesIO
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class GoogleDriveStorageService(StorageServiceInterface):
    """Concrete class of StorageServiceInterface, used for uploading to Google Drive"""

    _lock = threading.Lock()  # Class-level lock to prevent race conditions

    def __init__(self, folder_id='your_root_folder_id'):
        """Initializes the Google Drive client."""
        SCOPES = ['https://www.googleapis.com/auth/drive']
        credentials_path = os.getenv('GDRIVE_CREDENTIALS_PATH', 'key.json')
        self.credentials = service_account.Credentials.from_service_account_file(
            credentials_path, scopes=SCOPES)
        self.service = build('drive', 'v3', credentials=self.credentials)
        self.folder_id = folder_id

    def upload_to_service(self, file_name, content, content_type='text/plain'):
        """Uploads a file to Google Drive, creating folders as necessary."""
        try:
            # Ensure content is bytes
            if isinstance(content, str):
                content = content.encode('utf-8')

            # Handle folder creation and navigation
            parent_id = self.folder_id
            path_parts = file_name.strip('/').split('/')
            for folder_name in path_parts[:-1]:  # All parts except the last (which is the file name)
                with self._lock:  # Acquire lock to prevent race conditions
                    folder_id = self._get_or_create_folder(folder_name, parent_id)
                    if not folder_id:
                        logger.error(f"Failed to get or create folder '{folder_name}' under parent ID '{parent_id}'")
                        return
                    parent_id = folder_id

            # Prepare the file metadata and media
            file_metadata = {
                'name': path_parts[-1],
                'parents': [parent_id]
            }
            media = MediaInMemoryUpload(content, mimetype=content_type)

            # Upload the file
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            logger.info(f"File '{file_name}' uploaded to Google Drive with ID: {file.get('id')}.")
        except Exception as e:
            logger.exception(f"Failed to upload file '{file_name}': {e}")

    def _get_or_create_folder(self, folder_name, parent_id):
        """Retrieves the folder ID if it exists, or creates it if it doesn't."""
        try:
            # Escaping single quotes in folder_name to prevent query issues
            escaped_folder_name = folder_name.replace("'", "\\'")

            # Check if the folder already exists
            query = (
                f"mimeType='application/vnd.google-apps.folder' and "
                f"name='{escaped_folder_name}' and "
                f"'{parent_id}' in parents and trashed=false"
            )
            results = self.service.files().list(
                q=query,
                fields="files(id, name)",
                spaces='drive'
            ).execute()
            items = results.get('files', [])
            if items:
                if len(items) > 1:
                    logger.warning(f"Multiple folders named '{folder_name}' found under parent ID '{parent_id}'. Using the first one.")
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
                logger.info(f"Created folder '{folder_name}' with ID: {folder.get('id')}")
                return folder.get('id')
        except Exception as e:
            logger.exception(f"Error while getting or creating folder '{folder_name}': {e}")
            return None

    def list_reports(self):
        """Lists all report batches from Google Drive."""
        try:
            # Get all items under 'reports' folder (self.folder_id), including their paths
            all_items = list(self._list_all_files_recursively(self.folder_id))

            report_files = []

            # Build the initial report_files list
            for item in all_items:
                parts = item['path'].split('/')
                if len(parts) < 1:
                    continue
                batch_folder = parts[0]
                if batch_folder not in [report['filename'] for report in report_files]:
                    report_files.append({
                        'filename': batch_folder,
                        'contains_fuzzy': False,
                        'drone_count': 0,
                        'pass': 0,
                        'fail': 0
                    })

            for report in report_files:
                prefix = report['filename']
                batch_items = [item for item in all_items if item['path'].startswith(prefix)]
                contains_fuzzy = False
                drone_count = 0
                pass_count = 0
                fail_count = 0

                for item in batch_items:
                    parts = item['path'].split('/')

                    if len(parts) == 3 and item['name'].endswith('.txt'):
                        drone_count += 1

                    if len(parts) < 2:
                        continue
                    monitor = parts[1]
                    if 'fuzzy' in monitor.lower():
                        contains_fuzzy = True

                    if item['mimeType'] != 'application/vnd.google-apps.folder' and item['name'].endswith('.txt'):
                        file_contents = self._download_file_content(item['id'])
                        if "FAIL" in file_contents:
                            fail_count += 1
                        elif "PASS" in file_contents:
                            pass_count += 1

                report['contains_fuzzy'] = contains_fuzzy
                report['drone_count'] = drone_count
                report['pass'] = pass_count
                report['fail'] = fail_count

                logger.debug(f"Report '{report['filename']}': contains_fuzzy={contains_fuzzy}, drone_count={drone_count}, pass={pass_count}, fail={fail_count}")

            return {'reports': report_files}

        except Exception as e:
            logger.exception(f"Error fetching reports from Google Drive: {e}")
            return {'error': 'Failed to list reports from Google Drive'}

    def _list_all_files_recursively(self, parent_id, parent_path=''):
        """Recursively lists all files and folders under a given parent folder ID, including their paths."""
        try:
            page_token = None
            while True:
                response = self.service.files().list(
                    q=f"'{parent_id}' in parents and trashed=false",
                    fields="nextPageToken, files(id, name, mimeType, parents)",
                    spaces='drive',
                    pageToken=page_token
                ).execute()
                files = response.get('files', [])
                for file in files:
                    file_name = file['name']
                    file_id = file['id']
                    mime_type = file['mimeType']
                    file_path = f"{parent_path}/{file_name}" if parent_path else file_name
                    file_parent_id = parent_id

                    # Yield the file or folder information
                    yield {
                        'id': file_id,
                        'name': file_name,
                        'mimeType': mime_type,
                        'path': file_path,
                        'parent_id': file_parent_id
                    }

                    if mime_type == 'application/vnd.google-apps.folder':
                        # Recurse into subfolder
                        yield from self._list_all_files_recursively(file_id, parent_path=file_path)
                page_token = response.get('nextPageToken', None)
                if page_token is None:
                    break
        except Exception as e:
            logger.exception(f"Error listing files under folder {parent_id}: {e}")

    def list_folder_contents(self, folder_name):
        """Lists the contents of a specific report folder from Google Drive."""
        try:
            # Find the folder ID of the folder_name under 'reports' (self.folder_id)
            escaped_folder_name = folder_name.replace("'", "\\'")
            query = (
                f"mimeType='application/vnd.google-apps.folder' and "
                f"name='{escaped_folder_name}' and "
                f"'{self.folder_id}' in parents and trashed=false"
            )
            results = self.service.files().list(
                q=query,
                fields="files(id, name)",
                spaces='drive'
            ).execute()
            items = results.get('files', [])

            if not items:
                logger.error(f"Folder '{folder_name}' not found under reports.")
                return {'error': f"Folder '{folder_name}' not found."}

            folder_id = items[0]['id']

            # Initialize result structure
            result = {
                "name": folder_name,
                "UnorderedWaypointMonitor": [],
                "CircularDeviationMonitor": [],
                "CollisionMonitor": [],
                "LandspaceMonitor": [],
                "OrderedWaypointMonitor": [],
                "PointDeviationMonitor": [],
                "MinSepDistMonitor": [],
                "NoFlyZoneMonitor": [],
                "htmlFiles": []
            }

            # List all files under this folder recursively, including their paths
            all_files = list(self._list_all_files_recursively(folder_id))

            # Identify fuzzy folders
            fuzzy_folders = set()
            for file in all_files:
                parts = file['path'].split('/')
                if len(parts) < 3:
                    continue
                monitor = parts[1]
                if monitor.startswith("Fuzzy_Wind_"):
                    fuzzy_folders.add((monitor, file['id']))

            if fuzzy_folders:
                for fuzzy_folder_name, fuzzy_folder_id in fuzzy_folders:
                    fuzzy_path_value = fuzzy_folder_name
                    self._process_gd_directory(fuzzy_folder_id, result, fuzzy_path_value)
            else:
                self._process_gd_directory(folder_id, result, "")

            # Collect HTML files at any depth
            for file in all_files:
                if file['name'].endswith('.html'):
                    # Ensure that the path starts with the folder_name to correctly remove it
                    expected_prefix = f"{folder_name}/"
                    if file['path'].startswith(expected_prefix):
                        relative_path = file['path'][len(expected_prefix):]
                    else:
                        # Handle cases where the path might not start with folder_name
                        relative_path = file['path']
                        logger.warning(f"File path '{file['path']}' does not start with '{folder_name}/'")
                
                    proxy_url = f"/serve-html/{folder_name}/{relative_path}"
                    result["htmlFiles"].append({
                        "name": file['name'],
                        "path": relative_path,
                        "url": proxy_url
                    })

            logger.info(f"Completed listing folder contents for '{folder_name}'.")
            return result

        except Exception as e:
            logger.exception(f"Error fetching folder contents from Google Drive: {e}")
            return {'error': 'Failed to list folder contents from Google Drive'}

    def _process_gd_directory(self, parent_id, result, fuzzy_path_value):
        """Processes files in a Google Drive directory and populates the result."""
        try:
            # List all files under the parent_id recursively
            all_files = list(self._list_all_files_recursively(parent_id))

            for file in all_files:
                file_name = file['name']
                file_id = file['id']
                mime_type = file['mimeType']
                file_path = file['path']

                if mime_type == 'application/vnd.google-apps.folder':
                    continue  # Folders are already processed recursively

                if file_name.endswith('.txt'):
                    file_contents = self._download_file_content(file_id)
                    info_content = self._get_info_contents(file_contents, "INFO", {})
                    pass_content = self._get_info_contents(file_contents, "PASS", {})
                    fail_content = self._get_info_contents(file_contents, "FAIL", {})

                    file_data = {
                        "name": file_name,
                        "type": "text/plain",
                        "fuzzyPath": fuzzy_path_value,
                        "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
                        "content": file_contents,
                        "infoContent": info_content,
                        "passContent": pass_content,
                        "failContent": fail_content
                    }

                    # Append to the appropriate monitor list
                    appended = False
                    for monitor_key in result.keys():
                        if monitor_key in file_path and monitor_key != "htmlFiles":
                            result[monitor_key].append(file_data)
                            appended = True
                            break
                    if not appended:
                        logger.warning(f"TXT file '{file_name}' did not match any monitor keys.")

                elif file_name.endswith('.png'):
                    image_content = self._download_file_content_as_bytes(file_id)
                    encoded_string = base64.b64encode(image_content).decode('utf-8')
                    html_path = file_name.replace("_plot.png", "_interactive.html")

                    file_data = {
                        "name": file_name,
                        "type": "image/png",
                        "fuzzyPath": fuzzy_path_value,
                        "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
                        "imgContent": encoded_string,
                        "path": html_path
                    }

                    # Append to the appropriate monitor list
                    appended = False
                    for monitor_key in result.keys():
                        if monitor_key in file_path and monitor_key != "htmlFiles":
                            result[monitor_key].append(file_data)
                            appended = True
                            break
                    if not appended:
                        logger.warning(f"PNG file '{file_name}' did not match any monitor keys.")

        except Exception as e:
            logger.exception(f"Error processing directory with ID '{parent_id}': {e}")

    def _get_info_contents(self, file_contents, keyword, drone_map):
        """Parses file contents to extract info based on the keyword."""
        try:
            content_array = file_contents.split("\n")
            for content in content_array:
                content_split = content.split(";")
                if keyword in content and len(content_split) == 4:
                    key = content_split[2].strip()
                    value = content_split[3].strip()
                    if key not in drone_map:
                        drone_map[key] = [value]
                    else:
                        drone_map[key].append(value)
            return drone_map
        except Exception as e:
            logger.exception(f"Error parsing info contents: {e}")
            return drone_map

    def serve_html(self, folder_name, relative_path):
        """Serves an HTML file from Google Drive."""
        try:
            escaped_folder_name = folder_name.replace("'", "\\'")
            query = (
                f"mimeType='application/vnd.google-apps.folder' and "
                f"name='{escaped_folder_name}' and "
                f"'{self.folder_id}' in parents and trashed=false"
            )
            response = self.service.files().list(
                q=query,
                fields="files(id, name)",
                spaces='drive'
            ).execute()
            items = response.get('files', [])

            if not items:
                logger.error(f"Folder '{folder_name}' not found under 'reports'.")
                return None, 404

            parent_id = items[0]['id']

            # Traverse the relative_path to find the file
            path_parts = relative_path.strip('/').split('/')
            file_id = None
            for part in path_parts:
                escaped_part = part.replace("'", "\\'")
                query = (
                    f"name='{escaped_part}' and "
                    f"'{parent_id}' in parents and trashed=false"
                )
                response = self.service.files().list(
                    q=query,
                    fields="files(id, name, mimeType)",
                    spaces='drive'
                ).execute()
                items = response.get('files', [])
                if not items:
                    logger.error(f"File or folder '{part}' not found under parent ID '{parent_id}'.")
                    return None, 404
                item = items[0]
                parent_id = item['id']
                mime_type = item['mimeType']

            # Check if the file is an HTML file
            if mime_type == 'application/vnd.google-apps.folder' or not item['name'].endswith('.html'):
                logger.error(f"File '{relative_path}' is not an HTML file.")
                return None, 404

            # Download the file contents
            file_contents = self._download_file_content(item['id'])
            return file_contents, 200

        except Exception as e:
            logger.exception(f"Error serving HTML file: {e}")
            return None, 500

    def _download_file_content(self, file_id):
        """Downloads the content of a file from Google Drive."""
        try:
            request = self.service.files().get_media(fileId=file_id)
            fh = BytesIO()
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
            fh.seek(0)
            file_contents = fh.read().decode('utf-8')
            logger.debug(f"Downloaded file content for file ID: {file_id}")
            return file_contents
        except Exception as e:
            logger.exception(f"Error downloading file content: {e}")
            return ''

    def _download_file_content_as_bytes(self, file_id):
        """Downloads the content of a file as bytes from Google Drive."""
        try:
            request = self.service.files().get_media(fileId=file_id)
            fh = BytesIO()
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
            fh.seek(0)
            file_contents = fh.read()
            logger.debug(f"Downloaded bytes for file ID: {file_id}")
            return file_contents
        except Exception as e:
            logger.exception(f"Error downloading file content as bytes: {e}")
            return b''
