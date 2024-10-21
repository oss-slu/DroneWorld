# sUAS shall not deviate from their planned routes by more than [10%] of the total distance.
from time import sleep
import threading

from PythonClient.multirotor.util.geo.geo_util import GeoUtil
from PythonClient.multirotor.util.graph.three_dimensional_grapher import ThreeDimensionalGrapher
from PythonClient.multirotor.monitor.abstract.single_drone_mission_monitor import SingleDroneMissionMonitor

lock = threading.Lock()

class PointDeviationMonitor(SingleDroneMissionMonitor):

    def __init__(self, mission, deviation_percentage=15):
        super().__init__(mission)
        self.breach_flag = False
        self.est_position_array = None
        self.actual_deviation_percentage = None
        self.actual_distance = None
        self.passed = False
        self.optimal_distance = None
        self.obj_position_array = []
        self.mission = mission
        self.target_drone = mission.target_drone
        self.deviation_percentage = deviation_percentage
        self.dt = 0.02  # 50 Hz
        self.point_queue = None

    def start(self):
        if type(self.mission).__name__ not in self.polygon_mission_names:
            # print("Mission:", type(self.mission).__name__, "is not compatible with PointDeviationMonitor")
            return
        self.point_queue = self.mission.points.copy()
        self.point_queue.insert(0, [0, 0, 0])  # add home point to beginning of queue
        # print(f"DEBUG: point_queue: {self.point_queue}")
        self.append_info_to_log(f"{self.target_drone};speed {self.mission.speed} m/s with wind {self.wind_speed_text}")
        self.optimal_distance = self.calculate_planned_distance()
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
            self.actual_deviation_percentage = (self.actual_distance - self.optimal_distance) / self.optimal_distance
            # if self.actual_deviation_percentage > self.deviation_percentage / 100:
            #     self.append_fail_to_log(
            #         f"{self.target_drone};Optimal distance: {round(self.optimal_distance, 2)} meters, "
            #         f"Actual distance: {round(self.actual_distance, 2)} meters, "
            #         f"Deviation rate: {round(self.actual_deviation_percentage * 100, 2)}% "
            #         f"(> {self.deviation_percentage}%)")
            # else:
            #     self.append_pass_to_log(
            #         f"{self.target_drone};Optimal distance: {round(self.optimal_distance, 2)} meters, "
            #         f"Actual distance: {round(self.actual_distance, 2)} meters, "
            #         f"Deviation rate: {round(self.actual_deviation_percentage * 100, 2)}% "
            #         f"(< {self.deviation_percentage}%)")
            #     self.passed = True
            self.draw_trace_3d()
        self.save_report()

    def calculate_planned_distance(self):
        # sleep(1)  # wait for drone to drop on the ground
        # print(self.mission.points)
        original_position = self.client.getMultirotorState(self.target_drone).kinematics_estimated.position
        # self.original_position = [original_position.x_val, original_position.y_val, original_position.z_val]
        # print("origin: ", original_position)
        distance = self.get_distance_btw_points(
            [original_position.x_val, original_position.y_val, original_position.z_val], self.mission.points[0])
        # print("origin to first point: ", distance)
        for i in range(1, len(self.mission.points)):
            distance += self.get_distance_btw_points(self.mission.points[i - 1], self.mission.points[i])

        return distance

    def update_position(self):
        self.append_info_to_log(self.target_drone + ";Register drone location every " + str(self.dt) + " seconds")
        self.est_position_array = []
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

            # first 2 points
            if len(self.point_queue) >= 2:
                current_line_a = self.point_queue[0]
                current_line_b = self.point_queue[1]
                current_position = [x, y, z]
                # check if current position is on close to the line
                if not GeoUtil.is_point_close_to_line(current_line_a, current_line_b, current_position,
                                                      self.deviation_percentage):
                    print("DEBUG: current position is not close to the line")
                    # breached
                    if not self.breach_flag:
                        self.append_fail_to_log(f"{self.target_drone};First breach, "
                                                f"deviation from the planned path for more than "
                                                f"{self.deviation_percentage} meters")
                        self.breach_flag = True
                if GeoUtil.get_distance_btw_3d_points(current_line_b, current_position) < self.deviation_percentage:
                    self.point_queue.pop(0)

            self.est_position_array.append([x, y, z])
            self.obj_position_array.append([ox, oy, oz])
            sleep(self.dt)

        # print(self.position_array)

    def calculate_actual_distance(self):
        distance = 0.0
        for i in range(1, len(self.est_position_array)):
            distance += self.get_distance_btw_points(self.est_position_array[i - 1], self.est_position_array[i])
        return distance

    def draw_trace_3d(self):
        graph_dir = self.get_graph_dir()

        if not self.breach_flag:
            title = f"{self.target_drone} Planned vs. Actual\nDrone speed: {self.mission.speed} m/s\nWind: {self.wind_speed_text}"
        else:
            title = f"(FAILED) {self.target_drone} Planned vs. Actual\nDrone speed: {self.mission.speed} m/s\nWind: {self.wind_speed_text}"
        grapher = ThreeDimensionalGrapher()
        grapher.draw_trace_vs_planned(planed_position_list=self.mission.points,
                                      actual_position_list=self.est_position_array,
                                      full_target_directory=graph_dir,
                                      drone_name=self.target_drone,
                                      title=title)

        interactive_html_content = grapher.draw_interactive_trace_vs_planned(planed_position_list=self.mission.points,
                                                  actual_position_list=self.est_position_array,
                                                  full_target_directory=graph_dir,
                                                  drone_name=self.target_drone,
                                                  title=title)
        
        # Upload the HTML file directly to GCS
        gcs_path = f"{self.log_subdir}/FlyToPoints/{self.__class__.__name__}/{self.target_drone}_interactive.html"
        with lock:
            try:        
                self.upload_to_gcs(gcs_path, interactive_html_content, content_type='text/html')
            except Exception as e:
                print(f"Failed to upload html to GCS. Error: {str(e)}")

        

