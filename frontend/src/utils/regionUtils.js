export const findCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            height: 0,
          };
          resolve(coords);
        },
        (error) => {
          console.error('Error obtaining location: ', error);
          reject();
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      reject();
    }
  });
};
