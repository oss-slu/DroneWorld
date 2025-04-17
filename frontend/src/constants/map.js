import { tabEnums } from './simConfig';
import { imageUrls } from '../utils/const';

export const mapControls = {
  [tabEnums.ENV_REGION]: {
    header: 'ORIGIN DRAG AND DROP',
    body: [
      {
        icon: [imageUrls.location_orange],
        command: 'DRAG ICON',
        info: "FROM THE 'SIMULATION ORIGIN' PANEL TO PLACE ON MAP",
      },
    ],
  },
  [tabEnums.ENV_SADEZONE]: {
    header: 'DRAW SADE ZONE',
    body: [
      { icon: [imageUrls.sign_up], command: 'CLICK ICON', info: 'TO ACTIVATE SADE ZONE' },
      {
        icon: [imageUrls.shift, imageUrls.left_click],
        command: 'SHIFT + LEFT-CLICK + DRAG',
        info: 'TO DRAW A SADE ZONE',
      },
    ],
  },
  [tabEnums.DRONES]: {
    header: 'DRONE DRAG AND DROP',
    body: [
      {
        icon: [imageUrls.drone_orange],
        command: 'DRAG ICON',
        info: 'FROM THE DRONE PANEL TO PLACE ON MAP',
      },
    ],
  },
  default: {
    header: 'MOVEMENT AND CAMERA',
    body: [
      { icon: [imageUrls.left_click], command: 'LEFT CLICK + DRAG', info: 'TO PAN' },
      { icon: [imageUrls.middle_click], command: 'MIDDLE CLICK + DRAG', info: 'TO ROTATE' },
      { icon: [imageUrls.mouse_scroll], command: 'SCROLL', info: 'TO ZOOM IN AND OUT' },
    ],
  },
};
