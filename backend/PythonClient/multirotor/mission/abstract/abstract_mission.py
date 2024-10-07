import datetime
import os
import threading
from enum import Enum

from PythonClient.multirotor.airsim_application import AirSimApplication

#
lock = threading.Lock()


class GenericMission(AirSimApplication):
    class State(Enum):
        IDLE = 0
        RUNNING = 1
        END = -1

    def __init__(self, target_drone="Default"):
        self.flight_time_in_seconds = None
        super().__init__()
        self.target_drone = target_drone
        self.state = self.State.IDLE
        self.report_dir = os.path.join(os.path.expanduser('~'), "Documents",
                                       "AirSim") + os.sep + datetime.datetime.now().strftime("%Y_%m_%d_%H:%M:%S")
        self.objects = [self.client.simGetObjectPose(i) for i in self.all_drone_names]
        self.states = [self.client.getMultirotorState(i) for i in self.all_drone_names]
        self.client.enableApiControl(True, vehicle_name=target_drone)

    def takeoff(self, drone_name):
        self.client.takeoffAsync(vehicle_name=drone_name).join()

    def async_fly_to_position(self, drone_name, point, speed):
        self.client.moveToPositionAsync(point[0], point[1], point[2], speed, vehicle_name=drone_name).join()

    def save_report(self):
        with lock:
            log_dir = os.path.join(self.dir_path, self.log_subdir, self.__class__.__name__)
            # print("DEBUG:" + log_dir)
            if not os.path.exists(log_dir):
                try:
                    os.makedirs(log_dir)
                except:
                    print("Folder exist, thread unsafe")

            with open(log_dir + os.sep + self.__class__.__name__ + "_" + self.target_drone + "_log.txt", 'w') as outfile:
                outfile.write(self.log_text)

    def kill_mission(self):
        self.state = self.State.END
        # kill all threads





if __name__ == '__main__':
    mission = GenericMission()
