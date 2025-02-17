import React, { useRef, useEffect, useState } from 'react';
import { Viewer, CameraFlyTo, Cesium3DTileset } from 'resium';
import {
  Cartesian3,
  IonResource,
  Math as CesiumMath,
  createWorldTerrainAsync,
  Ion,
} from 'cesium';
import { useMainJson } from "./contexts/MainJsonContext";

const CesiumMap = () => {
  const DEFAULT_CAMERA_HEIGHT = 5000;
  const { mainJson, envJson, registerSetCameraByPosition } = useMainJson();

  // Debugging log to check the values of mainJson and envJson
  console.log("mainJson:", mainJson);
  console.log("envJson:", envJson);

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

  const google3DTilesAssetId = 2275207;
  Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN;

  const setCameraByLongLat = (long, lat, altitude, pitch) => {
    if (!viewerReady) return;
    const position = Cartesian3.fromDegrees(long, lat, altitude ?? DEFAULT_CAMERA_HEIGHT);
    setCameraPosition({
      destination: position,
      orientation: { heading: 0, pitch: pitch ?? -Math.PI / 2 },
    });
  };

  useEffect(() => {
    registerSetCameraByPosition(setCameraByLongLat);
    return () => registerSetCameraByPosition(null);
  }, []);

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
    console.log('Cesium map component has mounted');
  }, []);
  
  useEffect(() => {
    if (viewerRef.current) {
      console.log('Cesium Viewer is initialized');
    }
  }, [viewerRef]);
  

  useEffect(() => {
    setCameraByLongLat(
      envJson.Origin.longitude,
      envJson.Origin.latitude,
      DEFAULT_CAMERA_HEIGHT,
      -Math.PI / 2,
    );
  }, [envJson.Origin.latitude, envJson.Origin.longitude, viewerReady]);

  console.log("Rendering CesiumMap...");

  return (
    <Viewer ref={viewerRef} terrainProvider={createWorldTerrainAsync()}>
      <Cesium3DTileset url={IonResource.fromAssetId(google3DTilesAssetId)} />
      <CameraFlyTo
        destination={cameraPosition.destination}
        orientation={cameraPosition.orientation}
        duration={2}
      />
    </Viewer>
  );
};

export default CesiumMap;
