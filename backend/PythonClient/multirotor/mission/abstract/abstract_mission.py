import datetime
import os
import threading
from google.cloud import storage
from enum import Enum

from PythonClient.multirotor.airsim_application import AirSimApplication


lock = threading.Lock()


class GenericMission(AirSimApplication):
    class State(Enum):
        IDLE = 0
        RUNNING = 1
        END = -1

    def __init__(self, target_drone="Default", gcs_bucket_name="New_Bucket_Name", location="US"):
        self.flight_time_in_seconds = None
        super().__init__()
        self.target_drone = target_drone
        self.state = self.State.IDLE
        self.report_dir = os.path.join(os.path.expanduser('~'), "Documents",
                                       "AirSim") + os.sep + datetime.datetime.now().strftime("%Y_%m_%d_%H:%M:%S")
        self.objects = [self.client.simGetObjectPose(i) for i in self.all_drone_names]
        self.states = [self.client.getMultirotorState(i) for i in self.all_drone_names]
        self.client.enableApiControl(True, vehicle_name=target_drone)
        
        #Initialize a google cloud client and bucket
        self.gcs_client = storage.Client()
        self.gcs_bucket_name = gcs_bucket_name
        
        self.create_bucket_if_not_exists(location)
        
    def create_bucket_if_not_exists(self, location="US"):
        try:
            # Check if the bucket already exists
            bucket = self.gcs_client.lookup_bucket(self.gcs_bucket_name)
            if bucket is None:
                print(f"Bucket '{self.gcs_bucket_name}' does not exist. Creating it now...")
                # Create the bucket
                bucket = self.gcs_client.create_bucket(self.gcs_bucket_name, location=location)
                print(f"Bucket '{self.gcs_bucket_name}' created in location '{location}'.")
            else:
                print(f"Bucket '{self.gcs_bucket_name}' already exists.")
        except Exception as e:
            print(f"Error creating bucket: {str(e)}")

    def takeoff(self, drone_name):
        self.client.takeoffAsync(vehicle_name=drone_name).join()

    def async_fly_to_position(self, drone_name, point, speed):
        self.client.moveToPositionAsync(point[0], point[1], point[2], speed, vehicle_name=drone_name).join()

    def save_report(self):
        with lock:
                try:
                    bucket = self.gcs_client.get_bucket(self.gcs_bucket_name)
                    gcs_path = f"logs/{self.__class__.__name__}/{self.__class__.__name__}_{self.target_drone}_log.txt"

                    blob = bucket.blob(gcs_path)
                    blob.upload_from_string(self.log_text)
                    
                    print(f"Report successfully uploaded to {gcs_path} in GCS.")

                except Exception as e:
                    print(f"Failed to upload to GCS. Error: {str(e)}")

    def kill_mission(self):
        self.state = self.State.END
        # kill all threads





if __name__ == '__main__':
    mission = GenericMission(gcs_bucket_name="New_Bucket_Name", location="US")
