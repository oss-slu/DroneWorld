from time import sleep

from PythonClient.multirotor.monitor.abstract.single_drone_mission_monitor import (
    SingleDroneMissionMonitor,
)


class BatteryMonitor(SingleDroneMissionMonitor):
    def __init__(
        self, mission, min_battery_percentage=15, target_failure_percentage=None
    ):
        super().__init__(mission)
        self.min_battery_percentage = self.__to_float(min_battery_percentage, 15.0)
        self.target_failure_percentage = self.__to_float(
            target_failure_percentage, None
        )
        self.passed = True
        self._low_battery_reported = False
        self._skipped = False
        self.mission = mission
        self.target = mission.target_drone

    @staticmethod
    def __to_float(value, default):
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def start(self):
        self.append_info_to_log(
            f"{self.target_drone};speed {self.mission.speed} m/s with wind {self.wind_speed_text}"
        )
        while self.mission.state == self.mission.State.IDLE:
            sleep(0.1)
        while self.mission.state != self.mission.State.END:
            trip_stats = self.client.getTripStats(vehicle_name=self.target_drone)
            if getattr(self.client, "_trip_stats_rpc_mode", "") == "unavailable":
                self._skipped = True
                break
            charge = trip_stats.state_of_charge
            if charge < self.min_battery_percentage and not self._low_battery_reported:
                self._low_battery_reported = True
                self.passed = False
                self.append_fail_to_log(
                    f"{self.target_drone};Battery is below {self.min_battery_percentage}%"
                )
            sleep(0.1)

        self.stop()

    def stop(self):
        if self._skipped:
            self.append_info_to_log(
                f"{self.target_drone};Battery monitor skipped because getTripStats is unsupported by this simulator"
            )
            self.save_report()
            return
        if self.passed:
            self.append_pass_to_log(f"{self.target_drone};Battery is always above {self.min_battery_percentage}%")
        else:
            self.append_fail_to_log(f"{self.target_drone};Battery was below {self.min_battery_percentage}%")
        self.save_report()



