from PythonClient.multirotor.client_factory import create_multirotor_client
from PythonClient.multirotor.socket.mission_streamer import MissionStreamer


class StreamManager:
    """
    StreamManager is a class that manages the streaming of data from each MissionStreamer.
    """

    def __init__(self):
        self.client = create_multirotor_client()
        self.streamers = []

    def get_stream(self, drone_name, camera_name):
        """
        Returns the stream of the specified drone and camera.
        :param drone_name:
        :param camera_name:
        :return:
        """
        if not self.validate_drone_name(drone_name):
            print("Invalid drone name: {}".format(drone_name))
        elif not self.validate_camera_name(drone_name, camera_name):
            print("Invalid camera name: {}".format(drone_name, camera_name))
        else:
            for streamer in self.streamers:
                if streamer.target_drone == drone_name and streamer.CAMERA_NAME == camera_name:
                    #stream_thread = threading.Thread(target=streamer.frame_generator, args=(drone_name, camera_name))
                    return streamer.frame_generator()

    def add_streamer(self, mission, camera_name):
        streamer = MissionStreamer(mission)
        streamer.set_camera(camera_name)
        self.streamers.append(streamer)


    def validate_camera_name(self, drone_name, camera_name):
        """
        Validates the camera name.
        :param camera_name: str
        :return: bool
        """
        # TODO: Implement this method
        return True

    def validate_drone_name(self, drone_name):
        """
        Validates the drone name.
        :param drone_name: str
        :return: bool
        """
        # TODO: Implement this method
        return True

    def reset(self):
        self.streamers.clear()
