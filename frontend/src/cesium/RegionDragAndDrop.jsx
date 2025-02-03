import React, { useRef, useEffect, useState } from 'react';
import { Entity } from 'resium';
import {
  Cartesian3,
  Math as CesiumMath,
  Cartographic,
  VerticalOrigin,
  Cartesian2,
  HeightReference,
  JulianDate,
  Ellipsoid,
  LabelStyle,
  Color,
  DistanceDisplayCondition,
} from 'cesium';
import PropTypes from 'prop-types';
import { useMainJson } from '../../contexts/MainJsonContext';
import { SimulationConfigurationModel } from '../../model/SimulationConfigurationModel';

const RegionDragAndDrop = ({ viewerReady, viewerRef, setCameraByPosition }) => {
  const { syncRegionLocation, envJson } = useMainJson();

  // radius drag and drop event listeners
  useEffect(() => {
    if (viewerReady) {
      const viewer = viewerRef.current.cesiumElement;
      const canvas = viewer.canvas;

      viewer.animation.viewModel.timeFormatter = function (date, viewModel) {
        date = JulianDate.toDate(date);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (hours < 10) {
          hours = `0${hours}`;
        }
        if (minutes < 10) {
          minutes = `0${minutes}`;
        }
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        return hours + ':' + minutes + ':' + seconds;
      };

      // Ensure the canvas is focusable
      canvas.setAttribute('tabindex', '0');

      const dragOverHandler = (event) => {
        event.preventDefault(); // Necessary to allow the drop
        canvas.style.border = '2px dashed red'; // Visual feedback
      };

      const dropHandler = (event) => {
        event.preventDefault();
        canvas.style.border = ''; // Remove visual feedback

        const rect = canvas.getBoundingClientRect();
        // Adjust X and Y coordinate relative to the canvas
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const dragData = JSON.parse(event.dataTransfer.getData('text/plain'));
        const cesiumCanvasPosition = new Cartesian2(x, y);
        const cartesian = viewer.scene.pickPosition(cesiumCanvasPosition);
        if (cartesian) {
          const cartographic = Cartographic.fromCartesian(cartesian);
          const latitude = CesiumMath.toDegrees(cartographic.latitude);
          const longitude = CesiumMath.toDegrees(cartographic.longitude);

          // Use getPickRay to get the building height
          const ray = viewer.camera.getPickRay(cesiumCanvasPosition);
          const intersection = viewer.scene.pickFromRay(ray, []);
          let buildingHeight = 0;

          if (intersection && intersection.position) {
            buildingHeight = Cartographic.fromCartesian(intersection.position).height;
          }

          setCameraByPosition();

          if (dragData.type == 'region') {
            syncRegionLocation(latitude, longitude, buildingHeight, dragData.src);
          }
        }
      };

      canvas.addEventListener('dragover', dragOverHandler);
      canvas.addEventListener('drop', dropHandler);

      return () => {
        canvas.removeEventListener('dragover', dragOverHandler);
        canvas.removeEventListener('drop', dropHandler);
      };
    }
  }, [viewerReady, envJson]);

  return (
    <Entity
      position={Cartesian3.fromDegrees(
        envJson.Origin.longitude,
        envJson.Origin.latitude,
        envJson.Origin.height,
      )}
      billboard={{
        image: envJson.getOriginImage(),
        scale: 0.5,
        heightReference: HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
      ellipse={{
        semiMinorAxis: envJson.Origin.radius * 1609.34, // Convert miles to meters
        semiMajorAxis: envJson.Origin.radius * 1609.34, // Convert miles to meters
        material: Color.TRANSPARENT,
        outline: true,
        outlineColor: Color.YELLOW,
        outlineWidth: 4,
        height: envJson.Origin.height,
        extrudedHeight: envJson.Origin.height + 7,
        heightReference: HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
      label={{
        text: 'Simulation Origin',
        font: '14pt',
        showBackground: true,
        backgroundColor: Color.YELLOW,
        backgroundPadding: new Cartesian2(6, 4),
        fillColor: Color.BLACK,
        heightReference: HeightReference.NONE, // Use absolute height
        verticalOrigin: VerticalOrigin.TOP,
        pixelOffset: new Cartesian2(0, 20),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
    />
  );
};

RegionDragAndDrop.propTypes = {
  viewerReady: PropTypes.bool.isRequired,
  viewerRef: PropTypes.object.isRequired,
  setCameraByPosition: PropTypes.func.isRequired,
};

export default RegionDragAndDrop;
