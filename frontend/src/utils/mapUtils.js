import { Rectangle } from 'cesium';

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function distanceInMetersBetweenEarthCoords(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;
  // lat1, lon1, lat2, lon2 parameters must be in radians
  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
}

export const findRectangleWidth = (rectangle) => {
  return distanceInMetersBetweenEarthCoords(
    (rectangle.north + rectangle.south) / 2,
    rectangle.west,
    (rectangle.north + rectangle.south) / 2,
    rectangle.east,
  );
};

export const findRectangleLength = (rectangle) => {
  return distanceInMetersBetweenEarthCoords(
    rectangle.north,
    (rectangle.west + rectangle.east) / 2,
    rectangle.south,
    (rectangle.west + rectangle.east) / 2,
  );
};

export function metersToLatitude(meters) {
  return meters / 111000; // One degree of latitude is approximately 111 km
}

export function metersToLongitude(meters, latitude) {
  // Convert latitude to radians for the cosine function
  const latitudeInRadians = degreesToRadians(latitude);
  // Longitude in degrees depends on latitude
  return meters / (111000 * Math.cos(latitudeInRadians));
}

export function updateRectangle(centerLon, centerLat, length, width) {
  const halfWidthInDegrees = metersToLongitude(width / 2, centerLat);
  const halfLengthInDegrees = metersToLatitude(length / 2);

  return new Rectangle.fromDegrees(
    centerLon - halfWidthInDegrees,
    centerLat - halfLengthInDegrees,
    centerLon + halfWidthInDegrees,
    centerLat + halfLengthInDegrees,
  );
}

export function findRectangleCorners(centerLon, centerLat, length, width) {
  const halfWidthInDegrees = metersToLongitude(width / 2, centerLat);
  const halfLengthInDegrees = metersToLatitude(length / 2);

  const lon1 = centerLon - halfWidthInDegrees;
  const lon2 = centerLon + halfWidthInDegrees;
  const lat1 = centerLat - halfLengthInDegrees;
  const lat2 = centerLat + halfLengthInDegrees;

  return {
    lat1: lat2,
    long1: lon1, // Top left
    lat2: lat2,
    long2: lon2, // Top right
    lat3: lat1,
    long3: lon2, // Bottom right
    lat4: lat1,
    long4: lon1, // Bottom left
  };
}
