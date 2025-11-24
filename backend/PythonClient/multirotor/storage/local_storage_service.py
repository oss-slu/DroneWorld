import os
import base64
from pathlib import Path
from PythonClient.multirotor.storage.abstract.storage_service import StorageServiceInterface



#This is a local replica I had GPT generate based off of the gcs one. I havent been able to test it yet, as the mock
#sim isnt merged into main

class LocalStorageService(StorageServiceInterface):

    def __init__(self, base_dir="./local_reports"):
        """
        Local file-based storage.
        Mirrors the structure of GCS:
        ./local_reports/reports/<batch>/<monitor>/<files>
        """
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)


    def upload_to_service(self, file_name, content, content_type='text/plain'):
        """
        Writes directly to local disk under reports/.
        """
        target = self.base_dir / "reports" / file_name

        # Ensure parent folder exists
        target.parent.mkdir(parents=True, exist_ok=True)

        mode = "wb" if isinstance(content, bytes) else "w"
        with open(target, mode, encoding=None if mode == "wb" else "utf-8") as f:
            f.write(content)

        print(f"[LOCAL] File {file_name} written to {target}")


    def list_reports(self):
        reports_dir = self.base_dir / "reports"
        if not reports_dir.exists():
            return {"reports": []}

        report_files = []

        # Each folder inside reports is a "batch"
        for folder in reports_dir.iterdir():
            if folder.is_dir():
                report_files.append({
                    "filename": folder.name,
                    "contains_fuzzy": False,
                    "drone_count": 0,
                    "pass": 0,
                    "fail": 0
                })

        # Fill out stats
        for report in report_files:
            batch_path = reports_dir / report["filename"]
            contains_fuzzy = False
            drone_count = 0
            pass_count = 0
            fail_count = 0

            for root, dirs, files in os.walk(batch_path):
                # Fuzzy detection
                for d in dirs:
                    if "fuzzy" in d.lower():
                        contains_fuzzy = True

                for file in files:
                    fullpath = Path(root) / file

                    if file.endswith(".txt"):
                        drone_count += 1
                        content = fullpath.read_text()

                        if "FAIL" in content:
                            fail_count += 1
                        elif "PASS" in content:
                            pass_count += 1

            report["contains_fuzzy"] = contains_fuzzy
            report["drone_count"] = drone_count
            report["pass"] = pass_count
            report["fail"] = fail_count

        return {"reports": report_files}

    def list_folder_contents(self, folder_name):
        folder = self.base_dir / "reports" / folder_name
        if not folder.exists():
            return {"error": "Folder not found"}

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

        # Detect fuzzy folders
        fuzzy_folders = [d.name for d in folder.iterdir()
                         if d.is_dir() and d.name.startswith("Fuzzy_Wind_")]

        if fuzzy_folders:
            for fuzzy in fuzzy_folders:
                self._process_local_directory(folder / fuzzy, result, fuzzy)
        else:
            self._process_local_directory(folder, result, "")

        # Collect HTML files at any level
        for root, dirs, files in os.walk(folder):
            for file in files:
                if file.endswith(".html"):
                    fullpath = Path(root) / file
                    rel = fullpath.relative_to(folder)
                    result["htmlFiles"].append({
                        "name": file,
                        "path": str(rel).replace("\\", "/"),
                        "url": f"/serve-html/{folder_name}/{rel}"
                    })

        return result

    def _process_local_directory(self, directory, result, fuzzy_path_value):
        for root, dirs, files in os.walk(directory):
            for file in files:
                fullpath = Path(root) / file

                # -------------- TXT FILES -------------------
                if file.endswith(".txt"):
                    contents = fullpath.read_text()

                    info_content = self._get_info_contents(contents, "INFO", {})
                    pass_content = self._get_info_contents(contents, "PASS", {})
                    fail_content = self._get_info_contents(contents, "FAIL", {})

                    file_data = {
                        "name": file,
                        "type": "text/plain",
                        "fuzzyPath": fuzzy_path_value,
                        "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
                        "content": contents,
                        "infoContent": info_content,
                        "passContent": pass_content,
                        "failContent": fail_content
                    }

                    for key in result:
                        if key != "htmlFiles" and key in str(fullpath):
                            result[key].append(file_data)
                            break

                # -------------- PNG FILES -------------------
                elif file.endswith(".png"):
                    byte_data = fullpath.read_bytes()
                    encoded = base64.b64encode(byte_data).decode("utf-8")
                    html_path = str(fullpath).replace("_plot.png", "_interactive.html")

                    file_data = {
                        "name": file,
                        "type": "image/png",
                        "fuzzyPath": fuzzy_path_value,
                        "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
                        "imgContent": encoded,
                        "path": html_path
                    }

                    for key in result:
                        if key != "htmlFiles" and key in str(fullpath):
                            result[key].append(file_data)
                            break

    def _get_info_contents(self, file_contents, keyword, drone_map):
        lines = file_contents.split("\n")
        for line in lines:
            parts = line.split(";")
            if keyword in line and len(parts) == 4:
                key = parts[2].strip()
                value = parts[3].strip()
                drone_map.setdefault(key, []).append(value)
        return drone_map

    def serve_html(self, folder_name, relative_path):
        path = self.base_dir / "reports" / folder_name / relative_path
        if not path.exists():
            return None, 404
        return path.read_text(), 200
