import cv2
import numpy as np
import PythonClient.airsim as airsim
from PythonClient.multirotor.client_factory import create_multirotor_client


class MissionStreamer:
    """
    This class is used to fetch frames from AirSim and prepare them for streaming.
    """

    def __init__(self, mission):

        self.CAMERA_NAME = '0'
        self.IMAGE_TYPE = airsim.ImageType.Scene
        self.DECODE_EXTENSION = '.jpg'
        self.mission = mission
        self.target_drone = mission.target_drone
        self.client = create_multirotor_client()  # initialize a new client to prevent mission lag

    def frame_generator(self):
        while self.mission.state != "end":
            response_image = self.client.simGetImage(vehicle_name=self.target_drone,
                                                     camera_name=self.CAMERA_NAME,
                                                     image_type=self.IMAGE_TYPE)
            np_response_image = np.asarray(bytearray(response_image), dtype="uint8")
            decoded_frame = cv2.imdecode(np_response_image, cv2.IMREAD_COLOR)
            ret, encoded_jpeg = cv2.imencode(self.DECODE_EXTENSION, decoded_frame)
            frame = encoded_jpeg.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

    def set_camera(self, camera_name):
        self.CAMERA_NAME = camera_name

