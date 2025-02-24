import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SimulationConfigurationModel } from '../model/SimulationConfigurationModel';
import { EnvironmentModel } from '../model/EnvironmentModel';

const MainJsonContext = createContext();

export const useMainJson = () => useContext(MainJsonContext);

export const MainJsonProvider = ({ children }) => {
  const [mainJson, setMainJsonSetter] = useState(new SimulationConfigurationModel());
  const [envJson, setEnvJsonSetter] = useState(mainJson.environment);
  const viewerMaintainer = useRef(true);
  const timeOfDayRef = useRef(mainJson.TimeOfDay);
  const timeRef = useRef(mainJson.time);
  // Provide ref to access the camera control function
  const setCameraPositionRef = useRef(null);
  const [activeScreen, setActiveScreen] = useState('');

  const setMainJson = (input) => {
    envJson.time = timeRef.current;
    envJson.TimeOfDay = timeOfDayRef.current;
    // input.environment = envJson;
    setMainJsonSetter(SimulationConfigurationModel.getReactStateBasedUpdate(input));
  };

  const setEnvJson = (input) => {
    input.time = timeRef.current;
    input.TimeOfDay = timeOfDayRef.current;
    mainJson.environment = input;
    setEnvJsonSetter(EnvironmentModel.getReactStateBasedUpdate(input));
    setMainJsonSetter(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
  };

  function syncDroneLocation(latitude, longitude, height, droneIndex) {
    let drone = mainJson.getDroneBasedOnIndex(droneIndex);
    drone.X = latitude;
    drone.Y = longitude;
    drone.Z = height;
    mainJson.updateDroneBasedOnIndex(droneIndex, drone);
    setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
  }

  function syncRegionLocation(latitude, longitude, height, image) {
    envJson.setOriginLatitude(latitude);
    envJson.setOriginLongitude(longitude);
    envJson.setOriginHeight(height);
    envJson.setOriginImage(image);
    setEnvJson(EnvironmentModel.getReactStateBasedUpdate(envJson));
  }

  // function to register the camera control function
  const registerSetCameraByPosition = (func) => {
    setCameraPositionRef.current = func;
  };

  return (
    <MainJsonContext.Provider
      value={{
        mainJson,
        setMainJson,
        envJson,
        setEnvJson,
        syncDroneLocation,
        syncRegionLocation,
        viewerMaintainer,
        timeOfDayRef,
        timeRef,
        registerSetCameraByPosition,
        setCameraPositionRef,
        activeScreen,
        setActiveScreen,
      }}
    >
      {children}
    </MainJsonContext.Provider>
  );
};

MainJsonProvider.propTypes = {
  children: PropTypes.node.isRequired,