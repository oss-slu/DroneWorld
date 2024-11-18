# sUAS shall not deviate from their planned routes by more than [10%] of the total distance.
import math
from time import sleep
import numpy as np

from PythonClient.multirotor.util.geo.geo_util import GeoUtil
from PythonClient.multirotor.util.graph.three_dimensional_grapher import ThreeDimensionalGrapher
from PythonClient.multirotor.monitor.abstract.single_drone_mission_monitor import SingleDroneMissionMonitor


class CircularDeviationMonitor(SingleDroneMissionMonitor):

    def __init__(self, mission, deviation_percentage=15):
        super().__init__(mission)
        self.reported_breach = False
        self.breach_flag = False
        self.total_distance_diff = None
        self.passed = False
        self.obj_position_array = None
        self.est_position_array = None
        self.actual_distance = None
        self.optimal_distance = None
        self.mission = mission
        self.target = mission.target_drone
        self.deviation_percentage = deviation_percentage

    def start(self):
        if type(self.mission).__name__ not in self.circular_mission_names:
            # print("Mission:", type(self.mission).__name__,
            #       "is not compatible with Circular Deviation Monitor")
            return
        self.append_info_to_log(f"{self.target_drone};speed {self.mission.speed} m/s with wind {self.wind_speed_text}")
        self.optimal_distance = self.calculate_planned_distance()
        # only show 2 decimal places
        self.append_info_to_log(f"{self.target_drone};"
                                f"optimal distance: {str(round(self.optimal_distance, 2))} meters")
        while self.mission.state == self.mission.State.IDLE:
            pass
        self.update_position()
        self.stop()

    def stop(self):
        self.append_info_to_log(self.target_drone + ";Mission task finished")
        self.actual_distance = self.calculate_actual_distance()

        if self.breach_flag:
            self.append_fail_to_log(f"{self.target_drone};Deviation Violation (>{self.deviation_percentage} meters)")
        else:
            self.append_pass_to_log(f"{self.target_drone};No deviation violation (<{self.deviation_percentage} meters)")

        if self.actual_distance is None or self.actual_distance == 0:
            self.append_fail_to_log(f"{self.target_drone};Actual distance is 0")
        else:
            self.total_distance_diff = (self.actual_distance - self.optimal_distance) / self.optimal_distance
            # if self.total_distance_diff > self.deviation_percentage / 100:
            #     self.append_fail_to_log(
            #         f"{self.target_drone};Optimal distance: {round(self.optimal_distance, 2)} meters, "
            #         f"Actual distance: {round(self.actual_distance, 2)} meters, "
            #         f"Deviation rate: {round(self.total_distance_diff * 100, 2)}% "
            #         f"(> {self.deviation_percentage}%)")
            # else:
            #     self.append_pass_to_log(
            #         f"{self.target_drone};Optimal distance: {round(self.optimal_distance, 2)} meters, "
            #         f"Actual distance: {round(self.actual_distance, 2)} meters, "
            #         f"Deviation rate: {round(self.total_distance_diff * 100, 2)}% "
            #         f"(< {self.deviation_percentage}%)")
            #     self.passed = True
            self.draw_trace_3d()
        self.save_report()

    def calculate_planned_distance(self):
        target_height = self.mission.altitude
        distance = self.get_distance_btw_points(
            [0, 0, 0],
            [0, 0, target_height])
        distance += math.pi * 2 * self.mission.radius * self.mission.iterations
        return distance

    def update_position(self):
        dt = 0.01
        self.est_position_array = []
        self.obj_position_array = []
        while self.mission.state != self.mission.State.END:
            estimated_position = self.client.getMultirotorState(
                vehicle_name=self.target_drone).kinematics_estimated.position
            object_position = self.client.simGetObjectPose(object_name=self.target_drone).position
            x = estimated_position.x_val
            y = estimated_position.y_val
            z = estimated_position.z_val
            ox = object_position.x_val
            oy = object_position.y_val
            oz = object_position.z_val
            if self.mission.climbed and not self.check_breach(x, y, z):
                if not self.reported_breach:
                    self.reported_breach = True
                    self.append_fail_to_log(f"{self.target_drone};First breach: deviated more than "
                                            f"{self.deviation_percentage}meter from the planned route")
                self.breach_flag = True
            self.est_position_array.append([x, y, z])
            self.obj_position_array.append([ox, oy, oz])
            sleep(dt)

        # print(self.position_array)

    def check_breach(self, x, y, z):
        #print(f"Checking breach, Current position: {round(x, 2)}, {round(y, 2)}, {round(z, 2)}, "
        #      f"center: {self.mission.center.x_val}, {self.mission.center.y_val}, {self.mission.altitude}")
        return GeoUtil.is_point_close_to_circle([self.mission.center.x_val, self.mission.center.y_val, self.mission.altitude],
                                         self.mission.radius,
                                         [x, y, -z],
                                         self.deviation_percentage)

    def calculate_actual_distance(self):
        distance = 0.0
        for i in range(1, len(self.est_position_array)):
            distance += self.get_distance_btw_points(self.est_position_array[i - 1], self.est_position_array[i])
        return distance

    @staticmethod
    def get_distance_btw_points(point_arr_1, point_arr_2):
        return math.sqrt((point_arr_2[0] - point_arr_1[0]) ** 2 + (point_arr_2[1] - point_arr_1[1]) ** 2 + (
                point_arr_2[2] - point_arr_1[2]) ** 2)

    def draw_trace_3d(self):
        graph_dir = self.get_graph_dir()
        est_actual = self.est_position_array
        # obj_actual = self.obj_position_array
        radius = self.mission.radius
        height = self.mission.altitude
        if not self.breach_flag:
            title = f"{self.target_drone} Planned vs. Actual\nDrone speed: {self.mission.speed} m/s\nWind: {self.wind_speed_text}"
        else:
            title = f"(FAILED) {self.target_drone} Planned vs. Actual\nDrone speed: {self.mission.speed} m/s\nWind: {self.wind_speed_text}"
        center = [self.mission.center.x_val, self.mission.center.y_val, height]
        theta = np.linspace(0, 2 * np.pi, 100)
        x = center[0] + radius * np.cos(theta)
        y = center[1] + radius * np.sin(theta)
        z = np.ones(100) * height

        planned = []
        for i in range(len(x)):
            planned.append([x[i], y[i], -z[i]])

        grapher = ThreeDimensionalGrapher(self.storage_service,self.log_subdir)

        grapher.draw_trace_vs_planned(planed_position_list=planned,
                                                      actual_position_list=est_actual,
                                                      full_target_directory=graph_dir,
                                                      drone_name=self.target_drone,
                                                      title=title)
        grapher.draw_interactive_trace_vs_planned(planed_position_list=planned,
                                                                  actual_position_list=est_actual,
                                                                  full_target_directory=graph_dir,
                                                                  drone_name=self.target_drone,
                                                                  title=title)
