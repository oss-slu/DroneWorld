export const flightPaths = [
  { value: 'fly_in_circle', label: 'Circle', id: 1 },
  { value: 'fly_to_points', label: 'Square', id: 1 },
  // {value:'fly_straight',label:'Straight', id:1}
];

export const droneTypes = [
  { value: 'MultiRotor', label: 'Multi Rotor' },
  // { value: 'FixedWing', label: 'Fixed Wing' },
];

export const droneModels = {
  FixedWing: [
    { value: 'SenseflyeBeeX', label: 'Sensefly eBee X', src: '/images/SenseflyeBeeX.png' },
    { value: 'TrinityF90', label: 'Trinity F90', src: '/images/TrinityF90.png' },
  ],
  MultiRotor: [
    { value: 'ParrotANAFI', label: 'Parrot ANAFI', src: '/images/Parrot-ANAFI.png' },
    { value: 'DJI', label: 'DJI', src: '/images/DJI.png' },
    { value: 'VOXLm500', label: 'VOXL m500', src: '/images/VOXLm500.png' },
    { value: 'AureliaX6Pro', label: 'Aurelia X6 Pro', src: '/images/Aurelia-X6-Pro.png' },
    { value: 'IF1200', label: 'IF 1200', src: '/images/IF1200.png' },
    { value: 'Crazyflie 2.0', label: 'Crazyflie 2.0', src: '/images/Craziefly2.1.png' },
    {
      /*value: 'StreamLineDesignX189', label: 'StreamLineDesign X189', src: null*/
    },
  ],
};

export const locations = [
  { value: 'GeoLocation', id: 1 },
  { value: 'Cartesian Coordinate', id: 2 },
];

export const droneImages = [
  { src: '/images/drone-red.png', color: '#FFCCCC' },
  { src: '/images/drone-green.png', color: '#CCFFCC' },
  { src: '/images/drone-blue.png', color: '#CCCCFF' },
  { src: '/images/drone-yellow.png', color: '#FFFFCC' },
  { src: '/images/drone-pink.png', color: '#FFCCFF' },
  { src: '/images/drone-indigo.png', color: '#CCFFFF' },
  { src: '/images/drone-gold.png', color: '#F0E68C' },
  { src: '/images/drone-darkblue.png', color: '#E6E6FA' },
  { src: '/images/drone-orange.png', color: '#FFDAB9' },
  { src: '/images/drone-purple.png', color: '#DABDF9' },
];
