import threading
from time import sleep

from PythonClient import airsim
from PythonClient.multirotor.util.graph.three_dimensional_grapher import ThreeDimensionalGrapher
from PythonClient.multirotor.mission.fly_straight import FlyStraight
from PythonClient.multirotor.monitor.abstract.single_drone_mission_monitor import SingleDroneMissionMonitor


class DriftMonitor(SingleDroneMissionMonitor):

    def __init__(self, mission, threshold=1, dt=0.01):
        super().__init__(mission)
        self.closest = None
        self.reached = None
        self.est_position_array = None
        self.mission = mission
        self.target_drone = mission.target_drone
        self.threshold = threshold
        self.dt = dt

    def start(self):
        if type(self.mission).__name__ not in self.point_mission_names:
            # print("Mission:", type(self.mission).__name__, "is not compatible with DriftMonitor")
            return
        self.make_drifted_array()
        self.draw_trace_3d()
        self.save_report()

    def make_drifted_array(self):
        dt = self.dt
        closest = float('inf')  # Maximum distance
        self.reached = False
        self.est_position_array = []
        while self.mission.state != self.mission.State.END:
            current_position = self.client.getMultirotorState(
                vehicle_name=self.target_drone).kinematics_estimated.position
            x = current_position.x_val
            y = current_position.y_val
            z = current_position.z_val
            self.est_position_array.append([x, y, z])
            distance = self.get_distance_btw_points([x, y, z], self.mission.point)
            closest = min(closest, distance)
            self.closest = closest
            if distance < self.threshold or self.reached:
                if not self.reached:
                    self.reached = True
            sleep(dt)
        if not self.reached:
            self.append_fail_to_log(f"{self.target_drone};Did NOT reach target location {self.mission.point} "
                                    f"within {round(self.threshold, 2)} meters. Closest distance: {round(closest, 2)} meters")
        else:
            self.append_pass_to_log(f"{self.target_drone};Reached target location {self.mission.point} within "
                                    f"{round(self.threshold, 2)} meters. Closest distance: {round(closest, 2)} meters")

    def draw_trace_3d(self):
        # Construct folder path for storage service
        folder_path = f"{self.log_subdir}/{self.mission.__class__.__name__}/{self.__class__.__name__}/"

        actual = self.est_position_array
        dest = self.mission.point

        # Determine the title based on whether the target was reached
        if self.reached:
            title = f"Drift path\nDrone speed: {self.mission.speed} m/s\nWind: {self.wind_speed_text}\n" \
                    f"Closest distance: {round(self.closest, 2)} meters"
        else:
            title = f"(FAILED) Drift path\nDrone speed: {self.mission.speed} m/s\nWind: {self.wind_speed_text}\n" \
                    f"Closest distance: {round(self.closest, 2)} meters"

        # Use the grapher to draw and upload graphs
        grapher = ThreeDimensionalGrapher(self.storage_service)
        grapher.draw_trace_vs_point(destination_point=dest,
                                    actual_position_list=actual,
                                    drone_name=self.target_drone,
                                    title=title,
                                    folder_path=folder_path)
        grapher.draw_interactive_trace_vs_point(actual_position=actual,
                                                destination=dest,
                                                drone_name=self.target_drone,
                                                title=title,
                                                folder_path=folder_path)


if __name__ == "__main__":
    drone_speed = 14
    point = [10, 10, -10]
    wind = airsim.Vector3r(20, 0, 0)
    mission = FlyStraight(destination=point, speed=drone_speed)
    mission.client.simSetWind(wind)
    monitor = DriftMonitor(mission)
    thread1 = threading.Thread(target=mission.start)
    thread2 = threading.Thread(target=monitor.start)
    thread1.start()
    thread2.start()
