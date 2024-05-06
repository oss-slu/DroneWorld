import copy
import importlib
import json
import math
import os
import threading
import traceback
from datetime import datetime
from queue import Queue
from time import sleep

from msgpackrpc.error import TransportError
from numpy import random

from PythonClient import airsim
from PythonClient.multirotor.socket.stream_manager import StreamManager
from PythonClient.multirotor.util.geo.geo_util import GeoUtil


def str_to_number(s):
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            print("Warning, drone is position not a number, set to 0")
            return 0


class SimulationTaskManager:
    def __init__(self):
        self.__save_raw_request = False  # for debugging, set to true to save raw request to file
        self.__drone_positions_seen = set()  # prevent duplicate drone positions from crashing DroneWorld
        self.__current_task_batch = "None"
        self.__environment_check()
        self.unreal_state = {"state": "start"}
        self.__user_directory = os.path.join(os.path.expanduser('~'), "Documents", "AirSim")
        self.__FUZZY_TEST_MAX_WIND = 15  # 15 m/s 2023 Jan. max wind speed in st.louis
        self.__FUZZY_TEST_MAX_SPEED = 14  # 14 m/s Based on FAA limit on safe speed for drone flying below 400 feet
        self.batch_number = 1
        self.mission_queue = Queue()
        self.state = True
        self.__monitor_list = []  # list of tuples
        # [('collision_monitor', []), ('ordered_waypoint_monitor', [10]), ('point_deviation_monitor', [])]
        self.__global_monitor_names = {"min_sep_dist_monitor"}

        self.__drone_mission_pair_list = []  # list of tuples
        # [('fly_to_points', 'Drone1', [[[1, 2, -1], [1, 2, -3]], 3])]
        self.__report_subdir_string = ""
        self.__DEFAULT_EMPTY_SETTINGS_DOT_JSON = self.__create_default_empty_settings_dot_json()
        self.__DEFAULT_DRONE_FULL_LENGTH = self.__create_default_drone_full_length_reqeust()
        self.__is_streaming_enabled = False
        self.stream_manager = None


    def unreal_on(self):
        self.unreal_state["state"] = "start"

    def unreal_off(self):
        self.unreal_state["state"] = "idle"

    def start(self):
        while self.state:
            while self.mission_queue.empty():
                self.__current_task_batch = "None"
                self.unreal_off()
                sleep(1)
            current_queue_top = self.mission_queue.get()
            self.__current_task_batch = current_queue_top[1]
            try:
                if "FuzzyTest" not in current_queue_top[0]:
                    self.__run_regular_batch(current_queue_top)
                else:
                    self.__run_fuzzy_test_batch(current_queue_top, current_queue_top[0]["FuzzyTest"])
            except Exception as e:
                print("Error happened but keep listening to queue", e)
                # print stack trace
                traceback.print_exc()
                self.unreal_off()
            if self.__is_streaming_enabled:
                self.stream_manager.reset()
            print("Ready for next batch")

    def __update_settings(self, raw_request_json):
        self.unreal_off()
        new_setting_dot_json = copy.deepcopy(self.__DEFAULT_EMPTY_SETTINGS_DOT_JSON)
        self.__handle_streaming_settings(raw_request_json)
        self.__populate_drone_and_mission_settings(new_setting_dot_json, raw_request_json)
        self.__handle_wind_settings(new_setting_dot_json, raw_request_json)
        self.__handle_settings_time_of_day(new_setting_dot_json, raw_request_json)
        self.__populate_monitor_list(raw_request_json)
        self.__save_settings_dot_json(new_setting_dot_json)
        print("Settings deployed, waiting for DroneWorld to catch up")
        self.unreal_off()
        sleep(2)
        self.unreal_on()
        sleep(1)

    def __run_fuzzy_test_batch(self, current_queue_top, fuzzy_test_dict):

        print("next up: Linear Fuzzy test", fuzzy_test_dict["target"])
        setting_copy = copy.deepcopy(current_queue_top[0])

        precision = fuzzy_test_dict["precision"]
        if fuzzy_test_dict["target"] == "Wind":
            # hardcoded for user study
            for i in [0, 7, 14]:
                x, y, z = self.__set_fuzzy_wind_vector(i)
                setting_copy['environment']['Wind']['X'] = x
                setting_copy['environment']['Wind']['Y'] = y
                setting_copy['environment']['Wind']['Z'] = z
                self.__report_subdir_string = current_queue_top[1] + os.sep + f"Fuzzy_Wind_{i}"
                self.__update_settings(setting_copy)
                try:
                    self.__batch_exe_all(self.__drone_mission_pair_list, self.__monitor_list, fuzzy_test_dict)
                except TransportError:
                    print("DroneWorld not running")
                    return
                self.__drone_mission_pair_list.clear()
                self.__monitor_list.clear()
        elif fuzzy_test_dict["target"] == "Speed":
            for i in range(1, self.__FUZZY_TEST_MAX_SPEED, precision):
                fuzzy_test_dict["value"] = i
                self.__report_subdir_string = current_queue_top[1] + os.sep + f"Fuzzy_Speed_{i}"
                self.__update_settings(setting_copy)
                try:
                    self.__batch_exe_all(self.__drone_mission_pair_list, self.__monitor_list, fuzzy_test_dict)
                except TransportError:
                    print("DroneWorld not running")
                    return
                self.__drone_mission_pair_list.clear()
                self.__monitor_list.clear()
        else:
            print("Fuzzy test target not recognized")
        self.batch_number += 1

    def __run_regular_batch(self, current_queue_top):
        self.__update_settings(current_queue_top[0])
        print("next up: ", self.__drone_mission_pair_list, self.__monitor_list)
        self.__report_subdir_string = current_queue_top[1]

        try:
            self.__batch_exe_all(self.__drone_mission_pair_list, self.__monitor_list, False)
        except TransportError:
            print("DroneWorld not running")
            return
        self.batch_number += 1
        self.__drone_mission_pair_list.clear()
        self.__monitor_list.clear()

    # uuid: %Y-%m-%d-%H-%M-%S
    def add_task(self, raw_request_json, uuid):
        self.mission_queue.put([raw_request_json, uuid])
        # dump the request json to a file
        if self.__save_raw_request:
            with open(os.path.join(uuid + ".json"), "w") as f:
                json.dump(raw_request_json, f, indent=4)

    def __populate_drone_and_mission_settings(self, new_setting_dot_json, raw_request_json):
        print(new_setting_dot_json)
        for single_drone_setting in raw_request_json["Drones"]:
            # Must-exist params for setting.json or mission dispatch
            single_drone_setting_copy = copy.deepcopy(single_drone_setting)

            if "UseGeo" in raw_request_json["environment"] and raw_request_json["environment"]["UseGeo"]:
                origin_latitude_ = raw_request_json["environment"]["Origin"]["Latitude"]
                origin_longitude_ = raw_request_json["environment"]["Origin"]["Longitude"]
                origin_height_ = GeoUtil.get_elevation(origin_latitude_, origin_longitude_)
                cesium_origin = [origin_latitude_, origin_longitude_, origin_height_]
                new_setting_dot_json["OriginGeopoint"] = {
                    "Latitude": origin_latitude_,
                    "Longitude": origin_longitude_,
                    "Altitude": origin_height_
                }
                self.__handle_cesium(origin_latitude_, origin_longitude_, origin_height_)
                drone_name, drone_x, drone_y, drone_z = self.__handle_mission_settings(
                    single_drone_setting_copy, cesium_origin)
            else:
                drone_name, drone_x, drone_y, drone_z = self.__handle_mission_settings(single_drone_setting_copy)

            diff_dict = self.__find_diff(single_drone_setting_copy, self.__DEFAULT_DRONE_FULL_LENGTH)

            if "Sensors" in single_drone_setting:
                diff_dict["Sensors"] = diff_dict.get("Sensors", {})
                if "Barometer" in single_drone_setting["Sensors"]:
                    diff_dict["Sensors"]["Barometer"] = single_drone_setting["Sensors"]["Barometer"]
                if "Magnetometer" in single_drone_setting["Sensors"]:
                    diff_dict["Sensors"]["Magnetometer"] = single_drone_setting["Sensors"]["Magnetometer"]
                if "GPS" in single_drone_setting["Sensors"]:
                    diff_dict["Sensors"]["GPS"] = single_drone_setting["Sensors"]["GPS"]

            new_one_drone_json = {
                drone_name: dict(FlightController="SimpleFlight", X=drone_x, Y=drone_y, Z=drone_z)
            }

            # # GPS settings
            # if "GPS" in single_drone_setting["Sensors"]:
            #     diff_dict["Sensors"]["GPS"] = {
            #         "EphTimeConstant": single_drone_setting["Sensors"]["GPS"].get("EphTimeConstant", 0.9),
            #         "EpvTimeConstant": single_drone_setting["Sensors"]["GPS"].get("EpvTimeConstant", 0.9),
            #         "EphInitial": single_drone_setting["Sensors"]["GPS"].get("EphInitial", 25),
            #         "EpvInitial": single_drone_setting["Sensors"]["GPS"].get("EpvInitial", 25),
            #         "EphFinal": single_drone_setting["Sensors"]["GPS"].get("EphFinal", 0.1),
            #         "EpvFinal": single_drone_setting["Sensors"]["GPS"].get("EpvFinal", 0.1),
            #         "EphMin3d": single_drone_setting["Sensors"]["GPS"].get("EphMin3d", 3),
            #         "EphMin2d": single_drone_setting["Sensors"]["GPS"].get("EphMin2d", 4),
            #         "UpdateLatency": single_drone_setting["Sensors"]["GPS"].get("UpdateLatency", 0.2),
            #         "UpdateFrequency": single_drone_setting["Sensors"]["GPS"].get("UpdateFrequency", 50),
            #         "StartupDelay": single_drone_setting["Sensors"]["GPS"].get("StartupDelay", 1),
            #     }


            new_one_drone_json[drone_name].update(diff_dict)
            new_setting_dot_json['Vehicles'].update(new_one_drone_json)
        self.__drone_positions_seen.clear()  # clear the duplicate drone position list

    def __handle_wind_settings(self, new_setting_dot_json, raw_request_json):
        if "Wind" in raw_request_json['environment']:
            if 'FuzzyTest' in raw_request_json and raw_request_json['FuzzyTest']['target'] == 'Wind':
                new_setting_dot_json['Wind'] = raw_request_json['environment']['Wind']
                # wind vector already handled in run_fuzzy_test_batch
            else:
                wind = raw_request_json['environment']['Wind']
                if "Velocity" in wind:
                    wind_vector = self.__string_to_wind_vector(wind["Direction"], wind["Velocity"])
                    new_setting_dot_json['Wind'] = {'X': wind_vector[0], 'Y': wind_vector[1], 'Z': wind_vector[2]}
                elif not (wind['X'] == 0 and wind['Y'] == 0 and wind['Z'] == 0):
                    new_setting_dot_json['Wind'] = raw_request_json['environment']['Wind']

    def __populate_monitor_list(self, raw_request_json):
        monitors = raw_request_json['monitors']
        monitor_name_param_list = []
        for monitor, param in monitors.items():
            monitor_name_param_list.append((monitor, param['param']))
        self.__monitor_list = monitor_name_param_list

    @staticmethod
    def __handle_settings_time_of_day(new_setting_dot_json, raw_request_json):
        if "TimeOfDay" in raw_request_json['environment']:
            current_date_time = datetime.today().strftime('%Y-%m-%d ') + raw_request_json['environment']['TimeOfDay']
            new_setting_dot_json['TimeOfDay'] = dict(Enabled=True, StartDateTime=current_date_time)

    def __handle_cesium(self, lat, long, alt):
        cesium_setting = {"latitude": lat,
                          "longitude": long,
                          "height": alt}
        self.__save_cesium_dot_json(cesium_setting)

    def __handle_mission_settings(self, single_drone_setting_copy, cesium_origin=None):
        drone_name = single_drone_setting_copy['Name']
        mission_dict = single_drone_setting_copy['Mission']
        mission_name = mission_dict['name']
        del mission_dict['name']  # Isolate mission parameters
        params = mission_dict['param']
        self.__drone_mission_pair_list.append((mission_name, drone_name, params))
        # print("mission_name_param_list", mission_name_param_list)
        # self.drone_mission_pair_list.append((drone_name, mission_dict))
        if cesium_origin is not None:
            x = single_drone_setting_copy['X']
            y = single_drone_setting_copy['Y']
            z = single_drone_setting_copy['Z']
            x, y, z = GeoUtil.geo_to_cartesian_coordinates_spawn(x, y, z, cesium_origin)
        else:
            x = str_to_number(single_drone_setting_copy['X'])
            y = str_to_number(single_drone_setting_copy['Y'])
            z = str_to_number(single_drone_setting_copy['Z'])
        while (x, y, z) in self.__drone_positions_seen:
            x += 10
            print("Warning, duplicate drone position, moved it +10 in x")
        self.__drone_positions_seen.add((x, y, z))
        # Remove non-default param from template
        self.__remove_non_default_params(single_drone_setting_copy)
        return drone_name, x, y, z

    @staticmethod
    def __remove_non_default_params(single_drone_setting_copy):
        del single_drone_setting_copy['Mission']
        del single_drone_setting_copy['Name']
        del single_drone_setting_copy['X']
        del single_drone_setting_copy['Y']
        del single_drone_setting_copy['Z']

    @staticmethod
    def __save_settings_dot_json(new_setting_dot_json):
        with open(os.path.join(os.path.expanduser('~'), "Documents", "AirSim") + os.sep + 'settings.json',
                  'w') as outfile:
            json.dump(new_setting_dot_json, outfile, indent=4)

    @staticmethod
    def __save_cesium_dot_json(cesium_setting):
        with open(os.path.join(os.path.expanduser('~'), "Documents", "AirSim") + os.sep + 'cesium.json',
                  'w') as outfile:
            json.dump(cesium_setting, outfile, indent=4)

    def stop(self):
        self.state = False

    # Recursively find difference of two dict and return the difference in the same structure
    def __find_diff(self, dict1, dict2):
        diff = {}
        for key in dict1:
            if key in dict2:
                if isinstance(dict1[key], dict) and isinstance(dict2[key], dict):
                    sub_diff = self.__find_diff(dict1[key], dict2[key])
                    if sub_diff:
                        diff[key] = sub_diff
                elif dict1[key] != dict2[key]:
                    diff[key] = dict1[key]
            else:
                diff[key] = dict1[key]
        return diff

    def __batch_exe_all(self, drone_mission_pair_list, monitor_list, fuzzy_test_info):
        """
        Create and execute all missions and monitors in parallel
        :param drone_mission_pair_list: list of tuples (mission_name, drone_name, params)
        :param monitor_list: list of tuples (monitor_name, param)
        :param fuzzy_test_info: Dict of fuzzy test info, None otherwise
        :return: None
        """
        airsim.MultirotorClient().reset()  # reset scene before each task
        mission_threads = []
        monitor_threads = []
        for drone_mission_pair in drone_mission_pair_list:
            if fuzzy_test_info:
                thread_and_instance = self.__create_fuzzy_test_mission_thread(drone_mission_pair, fuzzy_test_info)
            else:
                thread_and_instance = self.__create_mission_thread(drone_mission_pair)
            mission_threads.append(thread_and_instance[0])
            mission_instance = thread_and_instance[1]  # instance reference for monitors

            monitors_thread = self.__create_monitors_thread(monitor_list, mission_instance)
            monitor_threads.extend(monitors_thread)

            # TODO: defualt camera is 0, need to change to support multiple cameras
            if self.__is_streaming_enabled:
                self.stream_manager.add_streamer(mission_instance, '0')
  


        # create global monitor threads
        global_monitor_start_threads, global_monitor_stop_threads = self.__create_global_monitor_threads(monitor_list)

        print(len(mission_threads), "Missions and", len(monitor_threads), "monitors")
        for mission in mission_threads:
            mission.start()
        for monitor in monitor_threads:
            monitor.start()
        for global_monitor in global_monitor_start_threads:
            global_monitor.start()
        for mission in mission_threads:
            mission.join()
        for monitor in monitor_threads:
            monitor.join()
        for global_monitor in global_monitor_stop_threads:
            global_monitor.start()
        for global_monitor in global_monitor_start_threads:
            global_monitor.join()
        print("All processes finished, server return to idle state")
        mission_threads.clear()
        monitor_threads.clear()

    def __create_mission_thread(self, drone_mission_pair):
        """
        Create one mission thread and return the thread and mission instance
        :param drone_mission_pair:
        :return: [mission_thread, mission_instance]
        """
        mission_file_name = drone_mission_pair[0]
        mission_class = self.__get_class_instance(class_name=mission_file_name, module_name="mission")
        param_list = drone_mission_pair[2][:]
        param_list.insert(0, drone_mission_pair[1])
        try:
            mission_instance = mission_class(*param_list)
            mission_instance.set_log_dir(self.__report_subdir_string)
            mission_thread = threading.Thread(target=mission_instance.start)
            return mission_thread, mission_instance
        except Exception as e:
            print(mission_file_name, "mission failed to instantiate", e)
            raise e

    def __create_monitors_thread(self, monitor_list, mission_instance):
        """
        Create monitor threads and return the threads
        :param monitor_list: List of all single drone monitors with params
        :param mission_instance: instance of mission
        :return: list of monitor threads
        """
        monitor_threads = []
        for monitor in monitor_list:
            monitor_name = monitor[0]
            params = [mission_instance] + monitor[1]

            # only create non-global monitor
            if monitor_name not in self.__global_monitor_names:
                monitor_class = self.__get_class_instance(class_name=monitor_name, module_name="monitor")
                try:
                    monitor_instance = monitor_class(*params)
                    monitor_instance.set_log_dir(self.__report_subdir_string)
                    monitor_threads.append(threading.Thread(target=monitor_instance.start))
                except Exception as e:
                    print(monitor_name, "cannot be instantiated", e)

        return monitor_threads

    def __create_global_monitor_threads(self, monitor_list):
        start_threads = []
        stop_threads = []
        for monitor in monitor_list:
            monitor_name = monitor[0]
            params = monitor[1]

            # only create global monitor
            if monitor_name in self.__global_monitor_names:
                monitor_class = self.__get_class_instance(class_name=monitor_name, module_name="monitor")
                monitor_instance = monitor_class(*params)
                monitor_instance.set_log_dir(self.__report_subdir_string)
                start_threads.append(threading.Thread(target=monitor_instance.start))
                stop_threads.append(threading.Thread(target=monitor_instance.stop))
        return start_threads, stop_threads
    
    @staticmethod
    def __get_class_instance(class_name, module_name):
        module = importlib.import_module("PythonClient.multirotor." + module_name + "." + class_name)
        return getattr(module, class_name.title().replace("_", ""))

    @staticmethod
    def __create_default_drone_full_length_reqeust():
        return dict(
            FlightController="SimpleFlight", DefaultVehicleState="Armed", PawnPath="",
            EnableCollisionPassthrogh=False, EnableCollisions=True,
            AllowAPIAlways=True, EnableTrace=False, Name="Drone1", Mission={},
            X=0, Y=0, Z=0, Pitch=0, Roll=0, Yaw=0)

    @staticmethod
    def __create_default_empty_settings_dot_json():
        return dict(SettingsVersion=1.2, SimMode="Multirotor", ViewMode="SpringArmChase", Vehicles={})

    @staticmethod
    def __to_pascal_case(string):
        return "".join([word.capitalize() for word in string.split("_")])

    def __create_fuzzy_test_mission_thread(self, drone_mission_pair, fuzzy_test_info):
        mission_file_name = drone_mission_pair[0]
        mission_class = self.__get_class_instance(class_name=mission_file_name, module_name="mission")
        param_list = drone_mission_pair[2][:]
        param_list.insert(0, drone_mission_pair[1])
        mission_instance = mission_class(*param_list)
        if fuzzy_test_info["target"] == "Speed":
            mission_instance.speed = fuzzy_test_info["value"]
        # elif fuzzy_test_info["target"] == "Wind":
        #     x, y, z = self.set_wind_vector(fuzzy_test_info["value"])
        #     mission_instance.set_wind_speed(x, y, z)
        mission_instance.set_log_dir(self.__report_subdir_string)
        mission_thread = threading.Thread(target=mission_instance.start)
        return mission_thread, mission_instance

    @staticmethod
    def __set_fuzzy_wind_vector(wind_magnitude):
        """
        randomly set wind vector equal to wind_magnitude
        :param wind_magnitude: number
        """
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)
        magnitude = math.sqrt(x ** 2 + y ** 2)
        x /= magnitude
        y /= magnitude
        x *= wind_magnitude
        y *= wind_magnitude
        return [x, y, 0]

    @staticmethod
    def __string_to_wind_vector(direction, velocity):
        if direction == 'N':
            return [velocity, 0, 0]
        elif direction == 'S':
            return [-velocity, 0, 0]
        elif direction == 'E':
            return [0, velocity, 0]
        elif direction == 'W':
            return [0, -velocity, 0]
        elif direction == 'NE':
            return [velocity / 2 ** 0.5, velocity / 2 ** 0.5, 0]
        elif direction == 'NW':
            return [velocity / 2 ** 0.5, -velocity / 2 ** 0.5, 0]
        elif direction == 'SE':
            return [-velocity / 2 ** 0.5, velocity / 2 ** 0.5, 0]
        elif direction == 'SW':
            return [-velocity / 2 ** 0.5, -velocity / 2 ** 0.5, 0]
        else:
            return [0, 0, 0]

    def __load_airsim_setting(self):
        with open(self.__user_directory + os.sep + 'settings.json', 'r') as f:
            setting_json = json.load(f)
        return setting_json

    def __load_env_setting(self):
        with open(self.__user_directory + os.sep + 'environment.json', 'r') as f:
            environment_json = json.load(f)
        return environment_json

    def __load_scene_setting(self):
        with open(self.__user_directory + os.sep + 'scene.json', 'r') as f:
            scene_json = json.load(f)
        return scene_json

    def load_cesium_setting(self):
        with open(self.__user_directory + os.sep + 'cesium.json', 'r') as f:
            cesium_setting = json.load(f)
        return cesium_setting

    def __save_env_setting(self, data):
        with open(self.__user_directory + os.sep + 'environment.json', 'w') as outfile:
            json.dump(data, outfile)

    @staticmethod
    def __environment_check():
        """
        Initialize json files if do not exist
        """
        file_path = os.path.join(os.path.expanduser('~'), "Documents", "AirSim") + os.sep + 'settings.json'
        if not os.path.exists(file_path):
            open(file_path, 'w').close()
            default_settings = {
                "SettingsVersion": 1.2,
                "SimMode": "Multirotor",
                "Vehicles": {
                    "Drone1": {
                        "FlightController": "SimpleFlight",
                        "X": 0,
                        "Y": 0,
                        "Z": 0
                    }
                }
            }
            with open(file_path, 'w') as outfile:
                json.dump(default_settings, outfile, indent=4)

        file_path = os.path.join(os.path.expanduser('~'), "Documents", "AirSim") + os.sep + 'cesium.json'
        if not os.path.exists(file_path):
            open(file_path, 'w').close()
            default_settings = {
                "latitude": 38.63657,
                "longitude": -90.236895,
                "height": 163.622131
            }
            with open(file_path, 'w') as outfile:
                json.dump(default_settings, outfile, indent=4)

    def get_current_task_batch(self):
        return self.__current_task_batch

    def get_stream(self, drone_name, camera_name):
        
        if self.stream_manager.validate_drone_name(drone_name):
            if self.stream_manager.validate_camera_name(camera_name):
                print(f"Get stream for {drone_name}, {camera_name}")
                return self.stream_manager.get_stream(drone_name, camera_name)
            else:
                return f"Invalid camera name {camera_name}"
        else:
            return f"Invalid drone name {drone_name}"

    def __handle_streaming_settings(self, raw_request_json):
        if "streaming_settings" in raw_request_json:
            streaming_settings = raw_request_json["streaming_settings"]
            if "enabled" in streaming_settings and streaming_settings["enabled"]:
                self.__is_streaming_enabled = True
                self.stream_manager = StreamManager()
                # TODO: only stream the drones that are in the request
                # if "drone_names" in raw_request_json["streaming_settings"]:
                #     self.stream_manager.set_drone_names(raw_request_json["streaming_settings"]["drone_names"])
        else:
            self.__is_streaming_enabled = False

