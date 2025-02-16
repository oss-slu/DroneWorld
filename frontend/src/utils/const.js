export const HOME_LABEL = {
    partfirst: `Simulation of a realistic scenario is an effective way to test the system's requirements.`,
    partsecond: `Describe one or more requirements you would like to test by simulating a scenario`,
  };

  let API_URL = 'http://localhost:8000';
  if(process.env.REACT_APP_API_URL){
    API_URL = process.env.REACT_APP_API_URL;
  }
  export const BASE_URL = API_URL;
  
  export const imageUrls = {
    drone_icon: '/images/drone-icon.png',
  };
