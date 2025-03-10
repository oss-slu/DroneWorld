import React, { useRef, useEffect, useState } from "react";
import { Viewer, CameraFlyTo, Cesium3DTileset } from 'resium';
import {
  Cartesian3,
  IonResource,
  Math as CesiumMath,
  Ion,
  CesiumTerrainProvider,
} from 'cesium';
//import DrawSadeZone from './DrawSadeZone';
//import RadiusDragAndDrop from './RegionDragAndDrop';
//import TimeLineSetterCesiumComponent from './TimeLineSetterCesiumComponent';
import { useMainJson } from "./contexts/MainJsonContext";

const CesiumMap = () => {
  const DEFAULT_CAMERA_HEIGHT = 5000;
  const { mainJson, envJson, registerSetCameraByPosition } = useMainJson();

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
  console.log('Cesium Ion Token:', process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN);

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
    if (viewerRef.current?.cesiumElement) {
      setViewerReady(true);
    }
  }, [viewerRef.current]);

  useEffect(() => {
    setCameraByLongLat(
      envJson.Origin.longitude,
      envJson.Origin.latitude,
      DEFAULT_CAMERA_HEIGHT,
      -Math.PI / 2,
    );
  }, [envJson.Origin.latitude, envJson.Origin.longitude, viewerReady]);

  // Use CesiumTerrainProvider instead of createWorldTerrain
  const terrainProvider = new CesiumTerrainProvider({
    url: IonResource.fromAssetId(1), // For global terrain from Cesium Ion
  });

  return (
    <Viewer ref={viewerRef} terrainProvider={terrainProvider}>
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
