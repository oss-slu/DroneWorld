from PythonClient.multirotor.storage.abstract.storage_service import StorageServiceInterface
from google.cloud import storage
import base64
import os
import json

class GCSStorageService(StorageServiceInterface):
    """Concrete class for uploading to GCS."""

    def __init__(self, bucket_name='your_bucket_name'):
        """Initializes the GCS client and bucket."""
        credentials_path = os.getenv('GCS_CREDENTIALS_PATH', 'key.json')

        # Check if using emulator
        emulator_host = os.getenv('STORAGE_EMULATOR_HOST')
        
        if emulator_host:
            # For fake-gcs-server, use anonymous credentials
            from google.auth.credentials import AnonymousCredentials
            self.storage_client = storage.Client(
                credentials=AnonymousCredentials(),
                project='test-project',
                client_options={"api_endpoint": emulator_host}
            )
        else:
            # Production: use service account
            self.storage_client = storage.Client.from_service_account_json(credentials_path)
        
        self.bucket = self.storage_client.bucket(bucket_name)

    def upload_to_service(self, file_name, content, content_type='text/plain'):
        """Uploads a file to the GCS bucket."""
        blob = self.bucket.blob(f'reports/{file_name}')
        blob.upload_from_string(content, content_type=content_type)
        print(f"File {file_name} uploaded to GCS.")

    def list_reports(self):
        """Lists all report batches from GCS."""
        try:
            blobs = self.bucket.list_blobs(prefix='reports/')
            report_files = []

            for blob in blobs:
                parts = blob.name.split('/')
                if len(parts) < 2:
                    continue
                batch_folder = parts[1]
                if batch_folder not in [report['filename'] for report in report_files]:
                    report_files.append({
                        'filename': batch_folder,
                        'contains_fuzzy': False,
                        'drone_count': 0,
                        'pass': 0,
                        'fail': 0
                    })

            for report in report_files:
                prefix = f'reports/{report["filename"]}/'
                sub_blobs = self.bucket.list_blobs(prefix=prefix)
                contains_fuzzy = False
                drone_count = 0
                pass_count = 0
                fail_count = 0

                for sub_blob in sub_blobs:
                    sub_parts = sub_blob.name.split('/')

                    if len(sub_parts) == 4 and sub_blob.name.endswith('.txt'):
                        drone_count += 1

                    if len(sub_parts) < 3:
                        continue
                    monitor = sub_parts[2]
                    if 'fuzzy' in monitor.lower():
                        contains_fuzzy = True

                    if sub_blob.name.endswith('.txt'):
                        file_contents = sub_blob.download_as_text()
                        if "FAIL" in file_contents:
                            fail_count += 1
                        elif "PASS" in file_contents:
                            pass_count += 1

                report['contains_fuzzy'] = contains_fuzzy
                report['drone_count'] = drone_count
                report['pass'] = pass_count
                report['fail'] = fail_count

            return {'reports': report_files}

        except Exception as e:
            print(f"Error fetching reports from GCS: {e}")
            return {'error': 'Failed to list reports from GCS'}

    def list_folder_contents(self, folder_name):
        """Lists the contents of a specific report folder from GCS."""
        try:
            prefix = f'reports/{folder_name}/'
            blobs = self.bucket.list_blobs(prefix=prefix)
            
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

            fuzzy_folders = set()
            for blob in blobs:
                parts = blob.name.split('/')
                if len(parts) < 3:
                    continue
                monitor = parts[2]
                if monitor.startswith("Fuzzy_Wind_"):
                    fuzzy_folders.add(monitor)

            if fuzzy_folders:
                for fuzzy_folder in fuzzy_folders:
                    fuzzy_prefix = f'reports/{folder_name}/{fuzzy_folder}/'
                    self._process_gcs_directory(fuzzy_prefix, result, fuzzy_folder)
            else:
                self._process_gcs_directory(prefix, result, "")

            # Collect HTML files at any depth
            html_blobs = self.bucket.list_blobs(prefix=prefix)
            for html_blob in html_blobs:
                if html_blob.name.endswith('.html'):
                    relative_path = os.path.relpath(html_blob.name, prefix)
                    proxy_url = f"/serve-html/{folder_name}/{relative_path.replace(os.sep, '/')}"
                    result["htmlFiles"].append({
                        "name": os.path.basename(html_blob.name),
                        "path": relative_path.replace(os.sep, '/'),
                        "url": proxy_url
                    })

            return result

        except Exception as e:
            print(f"Error fetching folder contents from GCS: {e}")
            return {'error': 'Failed to list folder contents from GCS'}

    def _process_gcs_directory(self, prefix, result, fuzzy_path_value):
        """Processes blobs in a GCS directory and populates the result."""
        blobs = self.bucket.list_blobs(prefix=prefix)
        for blob in blobs:
            file_name = os.path.basename(blob.name)
            if blob.name.endswith('.txt'):
                file_contents = blob.download_as_text()
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
                for monitor_key in result.keys():
                    if monitor_key in blob.name and monitor_key != "htmlFiles":
                        result[monitor_key].append(file_data)
                        break

            elif blob.name.endswith('.png'):
                image_content = blob.download_as_bytes()
                encoded_string = base64.b64encode(image_content).decode('utf-8')
                html_path = blob.name.replace("_plot.png", "_interactive.html")

                file_data = {
                    "name": file_name,
                    "type": "image/png",
                    "fuzzyPath": fuzzy_path_value,
                    "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
                    "imgContent": encoded_string,
                    "path": html_path
                }

                # Append to the appropriate monitor list
                for monitor_key in result.keys():
                    if monitor_key in blob.name and monitor_key != "htmlFiles":
                        result[monitor_key].append(file_data)
                        break

    def _get_info_contents(self, file_contents, keyword, drone_map):
        """Parses file contents to extract info based on the keyword."""
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

    def serve_html(self, folder_name, relative_path):
        """Serves an HTML file from GCS."""
        try:
            blob_path = f'reports/{folder_name}/{relative_path}'
            blob = self.bucket.blob(blob_path)

            if not blob.exists() or not blob.name.endswith('.html'):
                return None, 404

            file_contents = blob.download_as_text()
            return file_contents, 200

        except Exception as e:
            print(f"Error serving HTML file: {e}")
            return None, 500
