export const WindDirection = [
  { value: 'N', id: 5 },
  { value: 'S', id: 6 },
  { value: 'E', id: 7 },
  { value: 'W', id: 8 },
  { value: 'NE', id: 1 },
  { value: 'SE', id: 2 },
  { value: 'SW', id: 3 },
  { value: 'NW', id: 4 },
];

export const WindType = [
  { value: 'Constant Wind', id: 1 },
  { value: 'Turbulent Wind', id: 2 },
];

export const ENVIRONMENT_ORIGINS = [
  // { value: 'Michigan Lake Beach', id: 10 },
  { value: 'Chicago O’Hare Airport', id: 20 },
  { value: 'Specify Region', id: 30 },
];

export const originTypes = {
  MichiganLakeBeach: 'Michigan Lake Beach',
  ChicagoOhareAirport: 'Chicago O’Hare Airport',
  SpecifyRegion: 'Specify Region',
};

export const ENVIRONMENT_ORIGIN_VALUES = [
  { value: 'Specify Region', latitude: 0, longitude: 0, height: 0 },
  // { value: 'Michigan Lake Beach', latitude: 42.211223, longitude: -86.390394, height: 170 },
  { value: 'Chicago O’Hare Airport', latitude: 41.980381, longitude: -87.934524, height: 200 },
];

export const origin = {
  DEFAULT_RADIUS: 0.3,
};
