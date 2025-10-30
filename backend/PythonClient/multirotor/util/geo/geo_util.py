import math
import requests
import os

class Vector:
    """
    Auxiliary class for vector operations
    """

    def __init__(self, x, y, z):
        # Constructor
        self.x = x
        self.y = y
        self.z = z

    # ADD 2 Vectors
    def __add__(self, v):
        x1, y1, z1 = self.x + v.x, self.y + v.y, self.z + v.z
        return Vector(x1, y1, z1)

    # Subtract 2 vectors
    def __sub__(self, v):
        x1, y1, z1 = self.x - v.x, self.y - v.y, self.z - v.z
        return Vector(x1, y1, z1)

    # Dot product of 2 vectors
    def __xor__(self, v):
        x1, y1, z1 = self.x * v.x, self.y * v.y, self.z * v.z
        return x1 + y1 + z1

    # Cross product of 2 vectors
    def __mul__(self, v):
        x1 = self.y * v.z - self.z * v.y
        y1 = self.z * v.x - self.x * v.z
        z1 = self.x * v.y - self.y * v.x
        return Vector(x1, y1, z1)

    # Display Vector
    def __str__(self):
        out = self.x + "i "
        if self.y >= 0:
            out += "+ "
        out += self.y + "j "
        if self.z >= 0:
            out += "+ "
        out += self.z + "k\n"
        return out

    def magnitude(self):
        return math.sqrt(self.x ** 2 + self.y ** 2 + self.z ** 2)


EQUATORIAL_RATIO = 111319.49079327358


class GeoUtil:
    """
    Utility class for geographic coordinates
    """

    @staticmethod
    def geo_to_cartesian_ratio(lat):
        """
        Calculate the ratio between geographic coordinates and Cartesian coordinates based on the latitude
        :param lat: target latitude
        :return: ratio of LLH to Cartesian coordinates in meters
        """
        # Earth's radius in meters
        earth_radius = 6378137
        # Calculate the distance represented by one degree of latitude at the given latitude
        ratio = math.pi * earth_radius * math.cos(lat * math.pi / 180) / 180
        return ratio

    @staticmethod
    def geo_to_cartesian_coordinates(lat, long, alt, cesium_origin):
        """
        Convert geographic coordinates to Cartesian coordinates based on the cesium origin
        :param lat: target latitude
        :param long: target longitude
        :param alt: target altitude
        :param cesium_origin: cesium origin in geographic coordinates
        :return: Cartesian coordinates of lat, long, alt relative to cesium_origin
        """
        ratio = GeoUtil.geo_to_cartesian_ratio(lat)
        y = lat * ratio - cesium_origin[0] * ratio
        x = long * EQUATORIAL_RATIO - cesium_origin[1] * EQUATORIAL_RATIO
        # z is negative because in unreal, -z is up
        z = -alt
        return x, y, z

    @staticmethod
    def geo_to_cartesian_coordinates_spawn(lat, long, alt, cesium_origin):
        """
        Convert geographic coordinates to Cartesian coordinates based on the cesium origin
        :param lat: target latitude
        :param long: target longitude
        :param alt: target altitude
        :param cesium_origin: cesium origin in geographic coordinates
        :return: Cartesian coordinates
        """
        ratio = GeoUtil.geo_to_cartesian_ratio(lat)
        y = lat * ratio - cesium_origin[0] * ratio
        x = long * EQUATORIAL_RATIO - cesium_origin[1] * EQUATORIAL_RATIO
        z = -alt
        return x, y, z

    @staticmethod
    def distance_btw_point_and_line(line_point1, line_point2, point):
        """
        Calculate the distance between a point and a line
        :param line_point1: [x, y, z]
        :param line_point2: [x, y, z]
        :param point: [x, y, z]
        :return: number, distance between point and line
        """
        line_point1 = Vector(line_point1[0], line_point1[1], line_point1[2])
        line_point2 = Vector(line_point2[0], line_point2[1], line_point2[2])
        point = Vector(point[0], point[1], point[2])

        AB = line_point2 - line_point1
        AC = point - line_point1
        area = (AB * AC).magnitude()
        CD = area / AB.magnitude()
        # print(f"DEBUG: distance_btw_point_and_line: {CD}")
        return CD

    @staticmethod
    def is_point_close_to_line(line_point1, line_point2, point, threshold):
        """
        Check if a point is close to a line within a threshold
        :param line_point1:
        :param line_point2:
        :param point:
        :param threshold:
        :return:
        """
        return GeoUtil.distance_btw_point_and_line(line_point1, line_point2, point) <= threshold


    @staticmethod
    def distance_btw_point_and_circle(center, radius, point):
        """
        Calculate the distance between a point and a circle
        :param center: [x, y, z]
        :param radius: number
        :param point: [x, y, z]
        :return: number, distance between point and circle
        """
        center = Vector(center[0], center[1], center[2])
        point = Vector(point[0], point[1], point[2])
        return (point - center).magnitude() - radius

    @staticmethod
    def is_point_close_to_circle(center, radius, point, threshold):
        """
        Check if a point is close to a circle within a threshold
        :param center: [x, y, z]
        :param radius: number
        :param point: [x, y, z]
        :param threshold: number
        :return: bool
        """
        center_x = center[0]
        center_y = center[1]
        center_z = center[2]
        point_x = point[0]
        point_y = point[1]
        point_z = point[2]

        if abs(point_z - center_z) > threshold:
            # print(f"z distance: {abs(point_z - center_z)}")
            return False

        horizontal_distance = math.sqrt((point_x - center_x) ** 2 + (point_y - center_y) ** 2)
        if abs(horizontal_distance - radius) > threshold:
            # print(f"horizontal distance: {abs(horizontal_distance - radius)} greater than threshold: {threshold}")
            return False
        return True

    @staticmethod
    def get_distance_btw_3d_points(point_arr_1, point_arr_2):
        """
        Calculate the distance between two 3d points
        :param point_arr_1: [x, y, z]
        :param point_arr_2: [x, y, z]
        :return: number, distance between two points
        """
        return math.sqrt((point_arr_2[0] - point_arr_1[0]) ** 2 + (point_arr_2[1] - point_arr_1[1]) ** 2 + (
                point_arr_2[2] - point_arr_1[2]) ** 2)

    @staticmethod
    def get_elevation(lat, lng):
        #curl -L -X GET 'https://maps.googleapis.com/maps/api/elevation/json?locations={lat=39.7391536}%2C{long=-104.9847034}&key={api_key}'
        api_key = os.getenv('GOOGLE_MAPS_API_KEY', 'google maps api key')
        url = f"https://maps.googleapis.com/maps/api/elevation/json?locations={lat}%2C{lng}&key={api_key}"
        response = requests.get(url).json()
        
        # Check if the request was successful
        if response.get('status') != 'OK':
            print(f"Error from API: {response.get('status')}")
            print(f"API Response: {response}")
            return None

        # Check if 'results' is in the response and not empty
        if 'results' in response and response['results']:
            return response['results'][0]['elevation']
        else:
            print(f"No elevation data found for location: {lat}, {lng}")
            print(f"API Response: {response}")
            return None