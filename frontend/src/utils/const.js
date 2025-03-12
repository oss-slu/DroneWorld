export const HOME_LABEL = {
  partfirst: `Simulation of a realistic scenario is an effective way to test the system's requirements.`,
  partsecond: `Describe one or more requirements you would like to test by simulating a scenario`,
};

// export const BASE_URL = 'http://localhost:5000';
let API_URL = 'http://localhost:8000';
if(process.env.REACT_APP_API_URL){
  API_URL = process.env.REACT_APP_API_URL;
}
export const BASE_URL = API_URL;

export const UAV_DESCRIPTION = {
  'UAV-301': {
    text: 'Two sUAS (Small Unmanned Aircraft System) shall be able to complete a circular and square flight mission in windy weather conditions without colliding with stationary objects, the terrain, or other aircraft and drifting from its planned path by more than 10 meters.',
    title: 'Circular and Square Flight Mission in Windy Weather',
  },
  'UAV-302': {
    text: 'Two sUAS (Small Unmanned Aircraft Systems) shall be able to complete their missions in windy weather conditions while maintaining a minimum separation distance of at least 5 meters between each other and without drifting by more than 5 meters.',
    title: 'sUAS Mission Coordination in Windy Weather',
  },
  'UAV-303': {
    text: 'Two sUAS (Small Unmanned Aircraft Systems) shall be able to complete their respective missions in windy weather conditions without drifting from their planned path by more than 15 meters.',
    title: 'sUAS Mission in Windy Weather with Path Accuracy',
  },
};

export const imageUrls = {
  drone_icon: '/images/drone-icon.png',
  pin: '/images/map-pin.png',
  left_click: '/images/left-click.png',
  middle_click: '/images/middle-click.png',
  right_click: '/images/right-click.png',
  mouse_scroll: '/images/mouse-scroll.png',
  drone_orange: '/images/drone-orange.png',
  drone_thick_orange: '/images/drone-thick-orange.png',
  sign_up: 'images/sign-up.png',
  shift: 'images/shift.png',
  auth_drone: 'images/auth-drone.png',
  location_orange: 'images/location-orange.png',
  location: 'images/location.png',
};
