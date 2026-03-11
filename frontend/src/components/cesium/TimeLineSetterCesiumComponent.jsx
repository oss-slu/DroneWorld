import React, { useEffect } from 'react';
import { JulianDate } from 'cesium';
import PropTypes from 'prop-types';
import { useMainJson } from '../../contexts/MainJsonContext';
import dayjs from 'dayjs';

const TimeLineSetterCesiumComponent = ({ viewerReady, viewerRef }) => {
  const { viewerMaintainer, timeOfDayRef, timeRef } = useMainJson();

  useEffect(() => {
    if (viewerReady) {
      const viewer = viewerRef.current.cesiumElement;
      viewer.clock.onTick.addEventListener(() => {
        let date;
        if (viewerMaintainer.current) {
          if (timeRef.current) {
            date = JulianDate.fromDate(new Date(timeRef.current));
          } else {
            date = JulianDate.fromDate(new Date());
          }
          viewer.clock.currentTime = date;
          viewerMaintainer.current = false;
        } else {
          // set the current time to state
          date = viewer.clock.currentTime;
          const jsDate = JulianDate.toDate(date);
          let hours = jsDate.getHours();
          let minutes = jsDate.getMinutes();
          let seconds = jsDate.getSeconds();
          timeRef.current = dayjs(new Date(date));
          if (hours < 10) {
            hours = `0${hours}`;
          }
          if (minutes < 10) {
            minutes = `0${minutes}`;
          }
          if (seconds < 10) {
            seconds = `0${seconds}`;
          }
          timeOfDayRef.current = `${hours}:${minutes}:${seconds}`;
        }
      });
    }
  }, [viewerReady]);

  return <></>;
};

TimeLineSetterCesiumComponent.propTypes = {
  viewerReady: PropTypes.bool.isRequired,
  viewerRef: PropTypes.object.isRequired,
};

export default TimeLineSetterCesiumComponent;
