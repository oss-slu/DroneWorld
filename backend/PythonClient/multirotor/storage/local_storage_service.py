import base64
import os
import zipfile
from pathlib import Path
from typing import Dict, List, Tuple

from PythonClient.multirotor.storage.abstract.storage_service import StorageServiceInterface


class LocalStorageService(StorageServiceInterface):
    """Local filesystem implementation of :class:`StorageServiceInterface`."""

    def __init__(self, storage_root: str = None):
        # Prefer the user's home directory ("root folder" experience); fall back to cwd if needed
        preferred_root = Path(os.path.expanduser("~"))
        chosen_root = Path(storage_root or os.getenv("LOCAL_STORAGE_ROOT", preferred_root))

        # Track simulator type so we can tag mock reports even if filenames are ambiguous
        self.simulator_type = os.getenv("SIMULATOR_TYPE", "real").lower()

        try:
            reports_dir = (chosen_root / "reports")
            reports_dir.mkdir(parents=True, exist_ok=True)
            self.storage_root = chosen_root
            self.reports_dir = reports_dir
        except PermissionError:
            fallback_root = Path(os.getcwd())
            self.storage_root = fallback_root
            self.reports_dir = fallback_root / "reports"
            self.reports_dir.mkdir(parents=True, exist_ok=True)

    # --- Public API -----------------------------------------------------
    def upload_to_service(self, file_name, content, content_type: str = "text/plain"):
        """Writes bytes/strings to the local reports directory."""

        destination = self.reports_dir / file_name
        destination.parent.mkdir(parents=True, exist_ok=True)

        # Accept both text and bytes payloads
        if isinstance(content, (bytes, bytearray)):
            destination.write_bytes(content)
        else:
            destination.write_text(str(content))

        print(f"File {file_name} written to {destination}")

    def list_reports(self) -> Dict[str, List[Dict[str, object]]]:
        try:
            if not self.reports_dir.exists():
                return {"reports": []}

            report_files: List[Dict[str, object]] = []
            for batch_dir in sorted(self.reports_dir.iterdir()):
                if not batch_dir.is_dir():
                    continue

                report = {
                    "filename": batch_dir.name,
                    "contains_fuzzy": False,
                    "drone_count": 0,
                    "pass": 0,
                    "fail": 0,
                    # default tag; overridden below when mock artifacts detected
                    "report_type": "mock" if self.simulator_type == "mock" else "real",
                }

                is_mock_report = report["report_type"] == "mock"
                for file_path in batch_dir.rglob("*"):
                    if not file_path.is_file():
                        continue

                    rel_parts = file_path.relative_to(self.reports_dir).parts
                    # If any nested folder hints at being mock, mark it so
                    if any("mock" in part.lower() for part in rel_parts):
                        is_mock_report = True

                    report["contains_fuzzy"] = report["contains_fuzzy"] or any(
                        "fuzzy" in part.lower() for part in rel_parts
                    )

                    if file_path.suffix == ".txt":
                        if len(rel_parts) == 3:  # reports/<batch>/<monitor>/<file>
                            report["drone_count"] += 1
                        file_contents = file_path.read_text(errors="ignore")
                        report["pass"] += file_contents.count("PASS")
                        report["fail"] += file_contents.count("FAIL")

                report["report_type"] = "mock" if is_mock_report else "real"
                report_files.append(report)

            return {"reports": report_files}
        except Exception as exc:  # pragma: no cover - defensive
            print(f"Error fetching reports from local storage: {exc}")
            return {"error": "Failed to list reports from local storage"}

    def list_folder_contents(self, folder_name: str):
        try:
            target_folder = self.reports_dir / folder_name
            if not target_folder.exists():
                return {"error": f"Folder '{folder_name}' not found."}

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
                "MockMonitor": [],
                "htmlFiles": [],
            }

            for file_path in target_folder.rglob("*"):
                if not file_path.is_file():
                    continue

                rel_path = file_path.relative_to(target_folder)
                fuzzy_path_value = next(
                    (part for part in rel_path.parts if part.startswith("Fuzzy_Wind_")),
                    "",
                )

                if file_path.suffix == ".txt":
                    file_contents = file_path.read_text(errors="ignore")
                    file_data = self._build_text_payload(file_path.name, file_contents, fuzzy_path_value)
                    self._append_to_monitor_bucket(result, rel_path, file_data)

                elif file_path.suffix == ".png":
                    encoded_string = base64.b64encode(file_path.read_bytes()).decode("utf-8")
                    html_path = file_path.name.replace("_plot.png", "_interactive.html")
                    file_data = {
                        "name": file_path.name,
                        "type": "image/png",
                        "fuzzyPath": fuzzy_path_value,
                        "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
                        "imgContent": encoded_string,
                        "path": html_path,
                    }
                    self._append_to_monitor_bucket(result, rel_path, file_data)

                elif file_path.suffix == ".html":
                    result["htmlFiles"].append(
                        {
                            "name": file_path.name,
                            "path": rel_path.as_posix(),
                            "url": f"/serve-html/{folder_name}/{rel_path.as_posix()}",
                        }
                    )

            return result
        except Exception as exc:  # pragma: no cover - defensive
            print(f"Error fetching folder contents from local storage: {exc}")
            return {"error": "Failed to list folder contents from local storage"}

    def serve_html(self, folder_name: str, relative_path: str) -> Tuple[str, int]:
        try:
            target = (self.reports_dir / folder_name / relative_path).resolve()
            # Prevent path traversal
            reports_root = self.reports_dir.resolve()
            if not (reports_root == target or reports_root in target.parents):
                return None, 404
            if not target.exists() or target.suffix != ".html":
                return None, 404
            return target.read_text(), 200
        except Exception as exc:  # pragma: no cover - defensive
            print(f"Error serving HTML file locally: {exc}")
            return None, 500

    def list_files(self, prefix: str):
        """Returns a flat list of file paths under the given prefix (relative to storage root)."""

        try:
            target_dir = (self.storage_root / prefix).resolve()
            if not target_dir.exists():
                return []
            files = []
            for path in target_dir.rglob("*"):
                if path.is_file():
                    files.append(str(path.relative_to(self.storage_root)))
            return files
        except Exception as exc:  # pragma: no cover - defensive
            print(f"Error listing files locally: {exc}")
            return []

    def get_report_archive(self, folder_name: str):
        """Creates (or overwrites) a zip archive for the given report folder and returns its path and name."""
        try:
            target_folder = (self.reports_dir / folder_name).resolve()
            if not target_folder.exists() or not target_folder.is_dir():
                return None, None

            archive_path = self.reports_dir / f"{folder_name}.zip"

            with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                for file_path in target_folder.rglob("*"):
                    if file_path.is_file():
                        # Store paths relative to reports root so zip structure mirrors storage
                        arcname = file_path.relative_to(self.reports_dir)
                        zipf.write(file_path, arcname=arcname)

            return archive_path, archive_path.name
        except Exception as exc:  # pragma: no cover - defensive
            print(f"Error creating archive for folder {folder_name}: {exc}")
            return None, None

    # --- Internal helpers ----------------------------------------------
    def _build_text_payload(self, name: str, contents: str, fuzzy_path_value: str):
        return {
            "name": name,
            "type": "text/plain",
            "fuzzyPath": fuzzy_path_value,
            "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
            "content": contents,
            "infoContent": self._get_info_contents(contents, "INFO", {}),
            "passContent": self._get_info_contents(contents, "PASS", {}),
            "failContent": self._get_info_contents(contents, "FAIL", {}),
        }

    def _append_to_monitor_bucket(self, result: Dict, rel_path: Path, file_data: Dict):
        for monitor_key in result.keys():
            if monitor_key == "htmlFiles":
                continue
            # allow mock monitor bucket to catch generic mock entries
            if monitor_key == "MockMonitor" and "mock" in rel_path.as_posix().lower():
                result[monitor_key].append(file_data)
                return
            if monitor_key in rel_path.as_posix():
                result[monitor_key].append(file_data)
                return

    def _get_info_contents(self, file_contents: str, keyword: str, drone_map: Dict):
        try:
            for content in file_contents.split("\n"):
                content_split = content.split(";")
                if keyword in content and len(content_split) == 4:
                    key = content_split[2].strip()
                    value = content_split[3].strip()
                    drone_map.setdefault(key, []).append(value)
            return drone_map
        except Exception:
            return drone_map
