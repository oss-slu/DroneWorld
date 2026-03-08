from time import sleep
from PythonClient.multirotor.monitor.abstract.single_drone_mission_monitor import SingleDroneMissionMonitor


class UnorderedWaypointMonitor(SingleDroneMissionMonitor):
    def __init__(self, mission, deviation_threshold=1):
        super().__init__(mission)
        self.deviation_threshold = deviation_threshold
        self.point_dict = {}

    def start(self):
        if type(self.mission).__name__ not in self.polygon_mission_names:
            # print("Mission:", type(self.mission).__name__, "is not compatible with UnorderedWaypointMonitor")
            return
        self.init_dict()
        self.append_info_to_log(self.target_drone + ";UnorderedWaypointMonitorSingleDrone started")
        self.update_dict()
        self.stop()

    def init_dict(self):
        self.point_dict.clear()
        for p in self.mission.points:
            self.point_dict[self.__point_key(p)] = False

    @staticmethod
    def __point_key(point):
        if isinstance(point, (list, tuple)):
            return tuple(point)
        return point

    def update_dict(self):
        dt = 0.1
        while self.mission.state != self.mission.State.END:
            position = self.client.getMultirotorState(
                vehicle_name=self.target_drone).kinematics_estimated.position
            cur = (position.x_val, position.y_val, position.z_val)
            for p in self.mission.points:
                key = self.__point_key(p)
                if (
                    self.get_distance_btw_points(cur, p)
                ) <= self.deviation_threshold and not self.point_dict[key]:
                    self.append_info_to_log(
                        f"{self.target_drone};reached {p} within {self.deviation_threshold} meters"
                    )
                    self.point_dict[key] = True
            sleep(dt)

    def stop(self):
        if all(val == True for val in self.point_dict.values()):
            self.append_pass_to_log(self.target_drone + ";All points reached")
        else:
            unreached = []
            for key, value in self.point_dict.items():
                if not value:
                    unreached.append(key)
            self.append_fail_to_log(self.target_drone + ";Not all points reached, unreached points: " + str(unreached))
        self.save_report()
