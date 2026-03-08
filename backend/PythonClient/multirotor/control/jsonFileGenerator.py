import json
import math
import os


class SettingGenerator:
    """
    For generating multiple drones for debug, should not be used in production
    """
    def __init__(self, drone_number, min_separation_dist):
        self.drone_number = drone_number
        self.min_separation_dist = min_separation_dist
        spawn_radius = math.ceil(drone_number ** 0.5)
        print("spawn_radius ", spawn_radius)
        settings_template = {
            "SettingsVersion": 2.0,
            "SimMode": "Multirotor",
            "EnableRpc": True,
            "ApiServerPort": 41451,
            "LocalHostIp": "0.0.0.0",
        }
        one_drone_template = {
            "Drone1": {"VehicleType": "SimpleFlight", "X": 0, "Y": 0, "Z": 0}
        }

        break_flag = False
        cur_num = 1
        for i in range(0, spawn_radius):
            for j in range(0, spawn_radius):
                y = i * min_separation_dist
                x = j * min_separation_dist
                print(x, y)
                one_drone_template["Drone" + str(cur_num)] = {"VehicleType": "SimpleFlight", "X": x, "Y": y, "Z": 0}
                cur_num += 1
                drone_number -= 1
                if drone_number <= 0:
                    break_flag = True
                    settings_template["Vehicles"] = one_drone_template
                    break
                settings_template["Vehicles"] = one_drone_template
            if break_flag:
                break

        test = False
        if test:
            with open('settings.json', 'w') as outfile:
                json.dump(settings_template, outfile, indent=4)
        else:
            with open(os.path.join(os.path.expanduser('~'), "Documents", "AirSim") + os.sep + 'settings.json',
                      'w') as outfile:
                json.dump(settings_template, outfile, indent=4)


if __name__ == "__main__":
    SettingGenerator(2, 4)
