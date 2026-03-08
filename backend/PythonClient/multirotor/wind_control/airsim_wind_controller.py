# uses airsim wind api to control the wind speed and direction
import time

from PythonClient import airsim
from PythonClient.multirotor.client_factory import create_multirotor_client
from PythonClient.multirotor.wind_control.openfoam_csv_reader import FoamCSVReader
from PythonClient.multirotor.wind_control.openfoam_data_reader import FoamReader


class AirSimWindController:
    """
    Uses AirSim wind api to control the wind speed and direction
    """

    def __init__(self, openfoam_data_root, reader, filename):
        """
        :param openfoam_data_root: str, root directory of the openfoam data
        :param reader: str, "csv" or "foam", "csv" reads the data from csv files,
        "foam" reads from the openfoam data directly, abandoned, too slow.
        """
        self.client = create_multirotor_client()
        self.client.confirmConnection()
        foam_data_root = openfoam_data_root
        if foam_data_root is not None:
            if reader == "csv":
                if filename is None:
                    print("No filename provided")
                    return
                self.foam_reader = FoamCSVReader(foam_data_root, filename)
            elif reader == "foam":
                self.foam_reader = FoamReader(foam_data_root)
            else:
                self.foam_reader = None

    def set_wind(self, wind):
        """
        Set the wind speed and direction
        :param wind: 3d vector [x, y, z]
        :return: none
        """
        wind_vector = airsim.Vector3r(wind[0], -wind[1], -wind[2])
        # invert y and z because openfoam uses different coordinate system
        self.client.simSetWind(wind_vector)

    def continuous_update_wind_using_openfoam_data(self, airsim_drone_location):
        """
        Continuously load next time step of wind data and update the wind by updating the dataframe after each call
        :param airsim_drone_location:  drone location in airsim coordinate system
        :return: wind vector [x, y, z], openfoam format
        """
        if self.foam_reader is None:
            print("No OpenFOAM data reader found")
            return None

        drone_location = [airsim_drone_location[0], -airsim_drone_location[1], -airsim_drone_location[2]]

        wind_vector = self.foam_reader.get_spacial_temporal_velocity_next_time_step(drone_location)
        if wind_vector is None:
            # do nothing, wind is not updated
            return None
        else:
            print("Wind updated to: " + str(wind_vector))
            self.set_wind(wind_vector)
            return wind_vector

    def update_wind_using_openfoam_data(self, airsim_drone_location):
        """
        Update the wind using the OpenFOAM data and return the wind vector
        :param time_step: time in seconds
        :param airsim_drone_location: drone location in airsim coordinate system
        :param precision: how close the point needs to be to a point in the mesh to be considered
        :return: wind vector [x, y, z], openfoam format
        """

        if self.foam_reader is None:
            print("No OpenFOAM data reader found")
            return None

        drone_location = [airsim_drone_location[0], -airsim_drone_location[1], -airsim_drone_location[2]]

        wind_vector = self.foam_reader.get_spacial_temporal_velocity(drone_location)
        if wind_vector is None:
            # do nothing, wind is not updated
            return None
        else:
            print("Wind updated to: " + str(wind_vector))
            self.set_wind(wind_vector)
            return wind_vector

    def update_wind_CSV(self, time_step, airsim_drone_location, precision=1):
        """
        Update the wind using the OpenFOAM data
        :param time_step: time in seconds
        :param airsim_drone_location: drone location in airsim coordinate system
        :param precision: how close the point needs to be to a point in the mesh to be considered
        :return: none
        """

        if self.foam_reader is None:
            print("No OpenFOAM data reader found")
            return

        drone_location = [airsim_drone_location[0], -airsim_drone_location[1], -airsim_drone_location[2]]

        wind_vector = self.foam_reader.get_spacial_temporal_velocity(drone_location)
        if wind_vector is None:
            # do nothing, wind is not updated
            return
        else:
            print("Wind updated to: " + str(wind_vector))
            return wind_vector

    # def start(self):
    #
    #     t = 1
    #     self.update_wind_using_openfoam_data(1, [0, 0, 0])
