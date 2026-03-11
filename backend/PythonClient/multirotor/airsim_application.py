import json
import math
import os
import time
from abc import abstractmethod

from PythonClient import airsim
from PythonClient.multirotor.client_factory import create_multirotor_client
from PythonClient.multirotor.storage.storage_config import get_storage_service

class AirSimApplication:
    # Parent class for all airsim client side mission and monitors
    def __init__(self):
        # Set up the storage service
        self.storage_service = get_storage_service()

        self.circular_mission_names = {"FlyInCircle"}
        self.polygon_mission_names = {"FlyToPoints", "FlyToPointsGeo"}
        self.point_mission_names = {"FlyStraight"}
        self.client = create_multirotor_client()
        # self.client.confirmConnection()
        self.setting_file = self.load_airsim_setting()
        self.drone_number = len(self.setting_file['Vehicles'])  # only support name format of Drone1, Drone2...
        self.wind_speed_text = self.get_wind_speed_text()
        self.all_drone_names = list(self.load_airsim_setting()['Vehicles'].keys())
        self.log_text = ""
        self.snap_shots = []
        self.video_recordings = []
        self.log_subdir = os.path.join("Debug")  # Default, for debug
        self.graph_dir = os.path.join("Debug")
        self.current_time_string = ""
        self.cesium_origin = self.get_cesium_origin()
        report_root_path = os.path.join(os.path.expanduser("~"), "Documents", "AirSim", "report")
        if not os.path.exists(report_root_path):
            os.mkdir(report_root_path)
        self.dir_path = report_root_path

    @staticmethod
    def load_airsim_setting():
        with open(os.path.join(os.path.expanduser('~'), "Documents", "AirSim") + os.sep + 'settings.json', 'r') as f:
            setting_json = json.load(f)
        return setting_json

    @staticmethod
    def load_cesium_setting():
        with open(os.path.join(os.path.expanduser('~'), "Documents", "AirSim") + os.sep + 'cesium.json', 'r') as f:
            cesium_json = json.load(f)
        return cesium_json

    @staticmethod
    def _normalize_vehicle_name(name):
        if name is None:
            return ""
        return "".join(ch for ch in str(name).lower() if ch.isalnum())

    def resolve_vehicle_name(self, requested_name):
        requested = str(requested_name or "")
        requested_normalized = self._normalize_vehicle_name(requested)

        configured_names = []
        vehicles = self.setting_file.get("Vehicles", {})
        if isinstance(vehicles, dict):
            configured_names.extend(vehicles.keys())
        configured_names.extend(self.all_drone_names)
        configured_names = list(dict.fromkeys(configured_names))

        if requested in configured_names:
            return requested

        if requested_normalized:
            for candidate in configured_names:
                if self._normalize_vehicle_name(candidate) == requested_normalized:
                    print(f"[AirSim vehicle] resolved '{requested}' -> '{candidate}'")
                    return candidate

        rpc_names = []
        try:
            rpc_names = self.client.listVehicles() or []
        except Exception:
            rpc_names = []

        if requested in rpc_names:
            return requested

        if requested_normalized:
            for candidate in rpc_names:
                if self._normalize_vehicle_name(candidate) == requested_normalized:
                    print(f"[AirSim vehicle] resolved '{requested}' -> '{candidate}'")
                    return candidate

        all_candidates = list(dict.fromkeys(configured_names + list(rpc_names)))
        if len(all_candidates) == 1 and requested != all_candidates[0]:
            print(
                f"[AirSim vehicle] single candidate fallback '{requested}' -> '{all_candidates[0]}'"
            )
            return all_candidates[0]

        return requested

    def set_log_dir(self, dir_name):
        self.log_subdir = dir_name

    def append_info_to_log(self, new_log_string):
        self.log_text += "INFO;" + self.get_current_time_string() + ";" + new_log_string + "\n"

    def append_fail_to_log(self, new_log_string):
        self.log_text += "FAIL;" + self.get_current_time_string() + ";" + new_log_string + "\n"

    def append_pass_to_log(self, new_log_string):
        self.log_text += "PASS;" + self.get_current_time_string() + ";" + new_log_string + "\n"

    @abstractmethod
    def save_report(self):
        pass

    def save_report_to_storage(self, file_name, content, content_type='text/plain'):
        """
        Saves the content as a report and uploads it using the storage service.
        Uses the upload_to_service method of the storage service.
        """
        self.storage_service.upload_to_service(file_name, content, content_type)
 
    def save_pic(self, picture):
        self.snap_shots.append(picture)

    def save_recording(self, recording):
        self.video_recordings.append(recording)

    @staticmethod
    def get_current_time_string():
        return time.strftime("%H:%M:%S", time.localtime())

    def get_wind_speed_text(self):
        settings = self.load_airsim_setting()
        if "Wind" in settings:
            wind = settings["Wind"]
            wind_vector = [round(wind["X"], 2), round(wind["Y"], 2), round(wind["Z"], 2)]
            # given wind_vector is in NED coordinate, return the direction and speed in ENU coordinate
            magnitude = math.sqrt(wind_vector[0] ** 2 + wind_vector[1] ** 2 + wind_vector[2] ** 2)
            if magnitude == 0:
                unit_vector = [0, 0, 0]
            else:
                unit_vector = [wind_vector[0] / magnitude, wind_vector[1] / magnitude, wind_vector[2] / magnitude]
            # calculate angle in degrees between wind and x-axis
            if magnitude == 0:
                return "No wind"
            degree = math.degrees(math.atan2(unit_vector[1], unit_vector[0]))
            if degree < 0:
                degree += 360

            return f"{round(degree, 1)} degrees clock wise from north, speed {round(magnitude, 2)} m/s"
        else:
            return "No wind"

    def set_wind_speed(self, x, y, z):
        """
        Set wind speed in NED coordinate in unreal engine simulator
        does not update the wind speed in airsim setting file
        """
        self.client.simSetWind(airsim.Vector3r(x_val=x, y_val=y, z_val=z))

    def get_cesium_origin(self):
        # read cesium origin from file located at Documents/AirSim/cesium.json
        data = self.load_cesium_setting()
        lat = data["latitude"]
        lon = data["longitude"]
        height = data["height"]
        return [lat, lon, height]