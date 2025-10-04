import React, { useRef, useEffect, useState } from 'react';
import { Viewer, CameraFlyTo, Cesium3DTileset, Entity } from 'resium';
import {
  Cartesian3,
  IonResource,
  Math as CesiumMath,
  createWorldTerrainAsync,
  sampleTerrainMostDetailed,
  Ion,
  Cartographic,
} from 'cesium';
import PropTypes from 'prop-types';
import DrawSadeZone from './DrawSadeZone';
import DroneDragAndDrop from './DroneDragAndDrop';
// import RadiusDragAndDrop from './RegionDragAndDrop';
import TimeLineSetterCesiumComponent from './TimeLineSetterCesiumComponent';
import { useMainJson } from '../../contexts/MainJsonContext';
import { originTypes } from '../../constants/env';
import { EnvironmentModel } from '../../model/EnvironmentModel';

const CesiumMap = ({ activeConfigStep }) => {
  const DEFAULT_CAMERA_HEIGHT = 5000;
  const { mainJson, envJson, setEnvJson, registerSetCameraByPosition } = useMainJson();
  console.log('envJson:', envJson);
  console.log('Origin:', envJson.Origin);
  const viewerRef = useRef(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({
    destination: Cartesian3.fromDegrees(
      envJson.Origin.longitude,
      envJson.Origin.latitude,
      DEFAULT_CAMERA_HEIGHT,
    ),
    orientation: {
      heading: CesiumMath.toRadians(10),
      pitch: -Math.PI / 2,
    },
  });
  const OSMBuildingsAssetId = 96188;
  const google3DTilesAssetId = 2275207;

  Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN;

  const setCameraByPosition = (position = null, pitch = null) => {
    if (!viewerReady) return;
    const viewer = viewerRef.current.cesiumElement;
    const { camera } = viewer;
    setCameraPosition({
      destination: position ?? camera.position,
      orientation: {
        heading: camera.heading,
        pitch: pitch ?? camera.pitch,
      },
    });
  };

  const setCameraByLongLat = (long, lat, altitude, pitch) => {
    if (!viewerReady) return;
    const viewer = viewerRef.current.cesiumElement;
    const { camera } = viewer;
    const minAltitude =
      altitude ?? Math.min(DEFAULT_CAMERA_HEIGHT, camera.positionCartographic.height);
    const position = Cartesian3.fromDegrees(long, lat, minAltitude);

    setCameraPosition({
      destination: position,
      orientation: {
        heading: camera.heading,
        pitch: pitch ?? camera.pitch,
      },
    });
  };

  useEffect(() => {
    registerSetCameraByPosition(setCameraByLongLat);

    return () => registerSetCameraByPosition(null);
  }, [cameraPosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (viewerRef.current?.cesiumElement) {
        setViewerReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!viewerReady) return;
    const viewer = viewerRef.current.cesiumElement;

    // If the user is currently on the sUAS screen, Set the camera
    // at the origin coordinates with -90 degrees pitch
    if (activeConfigStep === 1) {
      const pitch = -Math.PI / 2;
      setCameraByLongLat(
        envJson.Origin.longitude,
        envJson.Origin.latitude,
        DEFAULT_CAMERA_HEIGHT,
        pitch,
      );

      // Disable camera tilt to lock the pitch angle
      viewer.scene.screenSpaceCameraController.enableTilt = false;
    } else {
      // Enable camera tilt to allow user control over pitch
      viewer.scene.screenSpaceCameraController.enableTilt = true;
    }
  }, [activeConfigStep]);

  // Move camera to the origin whenever the origin's changed
  useEffect(() => {
    setCameraByLongLat(
      envJson.Origin.longitude,
      envJson.Origin.latitude,
      DEFAULT_CAMERA_HEIGHT,
      -Math.PI / 2,
    );
  }, [envJson.Origin.latitude, envJson.Origin.longitude, envJson.Origin.height, viewerReady]);

  useEffect(() => {
    if (envJson.Origin.name === originTypes.SpecifyRegion) {
      findHeight()
        .then((h) => {
          // Handle the case where findHeight returns null because mainJson initializes
          // before the Cesium viewer when reusing the config
          if (h == null) {
            return;
          }
          envJson.setOriginHeight(h);
          setEnvJson(EnvironmentModel.getReactStateBasedUpdate(envJson));
        })
        .catch((error) => {
          console.error('Error fetching height:', error);
        });
    }
  }, [envJson.Origin.name, viewerReady]);

  useEffect(() => {
    const { destination, orientation } = cameraPosition;
    const carto = Cartographic.fromCartesian(destination);
    console.log('CameraFlyTo triggered:');
    console.log(`Longitude: ${CesiumMath.toDegrees(carto.longitude)}`);
    console.log(`Latitude: ${CesiumMath.toDegrees(carto.latitude)}`);
    console.log(`Height: ${carto.height}`);
    console.log(`Heading (deg): ${CesiumMath.toDegrees(orientation.heading)}`);
    console.log(`Pitch (deg): ${CesiumMath.toDegrees(orientation.pitch)}`);
  }, [cameraPosition]);

  const findHeight = async () => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer || !viewer.terrainProvider) {
      console.log('Viewer or terrain provider is not initialized');
      return null;
    }
    const position = Cartographic.fromDegrees(envJson.Origin.longitude, envJson.Origin.latitude);

    // Sample the terrain at the most detailed level available
    try {
      const positions = [position];
      await sampleTerrainMostDetailed(viewer.terrainProvider, positions);
      const height = positions[0].height;
      return height;
    } catch (error) {
      console.error('Failed to get terrain height:', error);
      return null;
    }
  };

  const terrainProvider = createWorldTerrainAsync();

  return (
    <Viewer
      ref={viewerRef}
      terrainProvider={terrainProvider}
      style={{ cursor: envJson.activeSadeZoneIndex == null ? 'default' : 'crosshair' }}
    >
      <Cesium3DTileset url={IonResource.fromAssetId(google3DTilesAssetId)} />
      <CameraFlyTo
        destination={cameraPosition.destination}
        orientation={cameraPosition.orientation}
        duration={2}
      />

      <DroneDragAndDrop
        viewerReady={viewerReady}
        viewerRef={viewerRef}
        setCameraByPosition={setCameraByPosition}
      />

      {/* <RadiusDragAndDrop
        viewerReady={viewerReady}
        viewerRef={viewerRef}
        setCameraByPosition={setCameraByPosition}
      /> */}

      <DrawSadeZone
        viewerReady={viewerReady}
        viewerRef={viewerRef}
        setCameraByPosition={setCameraByPosition}
      />

      <TimeLineSetterCesiumComponent viewerReady={viewerReady} viewerRef={viewerRef} />
    </Viewer>
  );
};

CesiumMap.propTypes = {
  activeConfigStep: PropTypes.number.isRequired,
};

export default CesiumMap;