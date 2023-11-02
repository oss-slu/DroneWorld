import React, { useState, useEffect } from 'react'; 
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import DroneConfiguration from './DroneConfiguration';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'; 
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      padding: '5px',
    },
  }));
  
  export default function MissionConfiguration(props) {
    const [magnetometer, setMagnetometer] = useState({
      noiseSigma: 0.005,
      scaleFactor: 1,
      noiseBias: 0,
      updateLatency: 0,
      updateFrequency: 50,
      startupDelay: 0,
    });
    const missionData = props.mission || {};
    const mainJsonValue = missionData.mainJsonValue || {};
  
    const classes = useStyles();
    const [droneCount, setDroneCount] = useState(
      props.mission?.mainJsonValue?.Drones != null
        ? props.mission.mainJsonValue.Drones.length
        : 1
    );
    const [droneArray, setDroneArray] = useState(
      props.mission?.mainJsonValue.Drones != null
        ? props.mission.mainJsonValue.Drones
        : [
            {
              id: droneCount - 1,
              droneName: "Drone " + droneCount,
              VehicleType: "SimpleFlight",
              DefaultVehicleState: "Armed",
              PawnPath: "",
              EnableCollisionPassthrogh: false,
              EnableCollisions: true,
              AllowAPIAlways: true,
              EnableTrace: false,
              Name: "Drone " + droneCount,
              X:
                props.mission?.mainJsonValue.environment != null
                  ? props.mission?.mainJsonValue.environment.Origin.Latitude
                  : 0,
              Y:
                props.mission?.mainJsonValue.environment != null
                  ? props.mission?.mainJsonValue.environment.Origin.Longitude
                  : 0,
              Z:
                props.mission?.mainJsonValue.environment != null
                  ? props.mission?.mainJsonValue.environment.Origin.Height
                  : 0,
              Pitch: 0,
              Roll: 0,
              Yaw: 0,
              Sensors: null,
              MissionValue: null,
              Mission: {
                name: "fly_to_points",
                param: [],
              },
            },
        ]
    );

  const setDrone = () => {
    setDroneArray((droneArray) => [
      ...droneArray,
      {
        id: droneCount,
        droneName: "Drone " + (droneCount + 1),
        VehicleType: "SimpleFlight",
        DefaultVehicleState: "Armed",
        PawnPath: "",
        EnableCollisionPassthrogh: false,
        EnableCollisions: true,
        AllowAPIAlways: true,
        EnableTrace: false,
        Name: "Drone " + (droneCount + 1),
      X:
        props.mission.mainJsonValue.environment != null
          ? droneCount > 0
            ? props.mission.mainJsonValue.environment.Origin.Latitude +
              0.0001 * droneCount
            : props.mission.mainJsonValue.environment.Origin.Latitude
          : 0,
      Y:
        props.mission.mainJsonValue.environment != null
          ? props.mission.mainJsonValue.environment.Origin.Longitude
          : 0,
      Z:
        props.mission.mainJsonValue.environment != null
          ? props.mission.mainJsonValue.environment.Origin.Height
          : 0,
      Pitch: 0,
      Roll: 0,
      Yaw: 0,
      Sensors: null,
      MissionValue: null,
      Mission: {
        name: "fly_to_points",
        param: [],
      },
    }]);
  };

  const handleMagnetometerChange = (e) => {
    setMagnetometer({
      ...magnetometer,
      [e.target.name]: e.target.value,
    });
  };

  const popDrone = () => {
    setDroneArray((droneArray) => droneArray.slice(0, -1));
  };

  const handleIncrement = () => {
    setDroneCount(droneCount + 1);
    setDrone();
  };

  const handleDecrement = () => {
    setDroneCount(droneCount - 1);
    popDrone();
  };

  const handleChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setDroneName = (e, index) => {
    setDroneArray((droneArray) =>
      droneArray.map((obj) =>
        obj.id === index ? { ...obj, droneName: e } : obj
      )
    );
  };

  useEffect(() => {
    if (props.mission) {
      props.mission.droneArrayJson(droneArray, props.mission.id);
    }
  }, [droneArray, props.mission]);

  const setDroneJson = (json, index) => {
    const updatedArray = [...droneArray];
    const target = updatedArray.find((obj) => obj.id === index);
    Object.assign(target, json);
    setDroneArray(updatedArray);
    console.log('droneArray----Mission Config', updatedArray);
  }; 

  return (
    <Box
      sx={{
        border: 1,
        borderRadius: 3,
        maxHeight: props.mission?.windowHeight - 200,
        overflow: 'scroll',
        padding: 3,
      }}
    >
      <Grid container direction="row" style={{ padding: '12px' }}>
        <strong>Configure sUAS (small unmanned aircraft system) or drone characteristics in your scenario</strong>
      </Grid>
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        Please make sure that no two sUAS (small unmanned aircraft system) have the same Home Geolocation
      </Alert>
      <Grid container direction="row" alignItems="center" justifyContent="right" style={{ padding: '12px', fontSize: '18px' }}>
        Number of sUAS &nbsp;&nbsp;
        <ButtonGroup size="small" aria-label="small outlined button group">
          {droneCount > 1 && <Button style={{ fontSize: '15px' }} onClick={handleDecrement}>-</Button>}
          {droneCount && <Button style={{ fontSize: '15px' }} variant="contained" color="primary">{droneCount}</Button>}
          <Button style={{ fontSize: '15px' }} onClick={handleIncrement} disabled={droneCount === 10}>+</Button>
        </ButtonGroup>
      </Grid>
      <div>
        {droneArray.map((drone, index) => (
          <div key={index}>
            <div>
              <div className={classes.root}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      {drone?.droneName || "Default"}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <DroneConfiguration
                        name={drone?.droneName || "Default"}
                        id={drone.id}
                        resetName={setDroneName}
                        droneJson={setDroneJson}
                        droneObject={droneArray[drone.id] || {}}
                      />

                      <DroneConfiguration
                        name="Default"
                        magnetometer={magnetometer}
                        handleChange={handleChange}
                      /> 
                        <TextField
                          label="Noise Sigma"
                          name="noiseSigma"
                          value={magnetometer.noiseSigma}
                          onChange={(e) => handleMagnetometerChange(e)}
                        />
                        <TextField
                          label="Scale Factor"
                          name="scaleFactor"
                          value={magnetometer.scaleFactor}
                          onChange={(e) => handleMagnetometerChange(e)}
                        />
                        <TextField
                          label="Noise Bias"
                          name="noiseBias"
                          value={magnetometer.noiseBias}
                          onChange={(e) => handleMagnetometerChange(e)}
                        />
                        <TextField
                          label="Update Latency"
                          name="updateLatency"
                          value={magnetometer.updateLatency}
                          onChange={(e) => handleMagnetometerChange(e)}
                        />
                        <TextField
                          label="Update Frequency"
                          name="updateFrequency"
                          value={magnetometer.updateFrequency}
                          onChange={(e) => handleMagnetometerChange(e)}
                        />
                        <TextField
                          label="Startup Delay"
                          name="startupDelay"
                          value={magnetometer.startupDelay}
                          onChange={(e) => handleMagnetometerChange(e)}
                        />
                        <DroneConfiguration magnetometer={magnetometer} />
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Box>
  );
}

MissionConfiguration.propTypes = {
  mission: PropTypes.shape({
    mainJsonValue: PropTypes.shape({
      Drones: PropTypes.array,
      environment: PropTypes.shape({
        Origin: PropTypes.shape({
          Latitude: PropTypes.number,
          Longitude: PropTypes.number,
          Height: PropTypes.number,
        }),
      }),
    }),
    droneArrayJson: PropTypes.array,
    id: PropTypes.string,
    windowHeight: PropTypes.number,
  },)}
