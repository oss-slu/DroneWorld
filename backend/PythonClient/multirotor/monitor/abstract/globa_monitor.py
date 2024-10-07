import math
import os
import threading
from PythonClient.multirotor.airsim_application import AirSimApplication

lock = threading.Lock()


class GlobalMonitor(AirSimApplication):
    def __init__(self):
        super().__init__()

    def start_websocket(self):
        # alert_server = websockets.serve("localhost", 8765)
        pass

    @staticmethod
    def get_distance_btw_points(point_arr_1, point_arr_2):
        return math.sqrt((point_arr_2[0] - point_arr_1[0]) ** 2 + (point_arr_2[1] - point_arr_1[1]) ** 2 + (
                    point_arr_2[2] - point_arr_1[2]) ** 2)

    async def send_notification(websocket, path):
        pass
        # while True:
        #     message = "This is a notification from the server"
        #     await websocket.send(message)
        #     await asyncio.sleep(10)

    def save_report(self):
        with lock:
            log_dir = os.path.join(self.dir_path,
                         self.log_subdir) + os.sep + "GlobalMonitors" + os.sep + self.__class__.__name__
            filename = log_dir + os.sep + "_log.txt"

            gcs_path = f"{self.log_subdir}/{self.__class__.__name__}/{filename}"
            
            self.upload_to_gcs(gcs_path, self.log_text)

            # print("DEBUG:" + log_dir)
