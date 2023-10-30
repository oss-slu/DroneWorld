import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { ExpandMore } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import DroneConfiguration from './DroneConfiguration';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '5px',
  },
}));

export default function MissionConfiguration(mission) {
  const [magnetometer, setMagnetometer] = useState({
    noiseSigma: 0.005,
    scaleFactor: 1,
    noiseBias: 0,
    updateLatency: 0,
    updateFrequency: 50,
    startupDelay: 0,
  });

  const classes = useStyles();
  const [droneCount, setDroneCount] = React.useState(
    mission.mainJsonValue.Drones != null
      ? mission.mainJsonValue.Drones.length
      : 1
  );
  const [droneArray, setDroneArray] = React.useState(
    mission.mainJsonValue.Drones != null
      ? mission.mainJsonValue.Drones
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
              mission.mainJsonValue.environment != null
                ? mission.mainJsonValue.environment.Origin.Latitude
                : 0,
            Y:
              mission.mainJsonValue.environment != null
                ? mission.mainJsonValue.environment.Origin.Longitude
                : 0,
            Z:
              mission.mainJsonValue.environment != null
                ? mission.mainJsonValue.environment.Origin.Height
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
    droneArray.push({
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
        mission.mainJsonValue.environment != null
          ? droneCount > 0
            ? mission.mainJsonValue.environment.Origin.Latitude +
              0.0001 * droneCount
            : mission.mainJsonValue.environment.Origin.Latitude
          : 0,
      Y:
        mission.mainJsonValue.environment != null
          ? mission.mainJsonValue.environment.Origin.Longitude
          : 0,
      Z:
        mission.mainJsonValue.environment != null
          ? mission.mainJsonValue.environment.Origin.Height
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
    });
  };

  const handleMagnetometerChange = (e) => {
    setMagnetometer({
      ...magnetometer,
      [e.target.name]: e.target.value,
    });
  };

  const popDrone = () => {
    droneArray.pop();
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
    setDroneArray((objs) => {
      return objs.map((obj, i) => {
        if (index === obj.id) {
          obj = {
            ...obj,
            droneName: e,
          };
        }
        return obj;
      });
    });
  };

  React.useEffect(() => {
    mission.droneArrayJson(droneArray, mission.id);
  }, [droneArray]);

  const setDroneJson = (json, index) => {
    const target = droneArray.find((obj) => obj.id === index);
    Object.assign(target, json);
    console.log('droneArray----Mission Config', droneArray);
  };

  return (
    <Box sx={{ border: 1, borderRadius: 3, maxHeight: mission.windowHeight - 200, overflow: 'scroll', padding: 3 }}>
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
                expandIcon={<ExpandMore />} 
                aria-controls="panel1a-content" 
                id="panel1a-header" 
                > 
                  <Typography className={classes.heading}>{drone.droneName}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography> 
                      <DroneConfiguration
                        id={drone.id}
                        resetName={setDroneName}
                        droneJson={setDroneJson}
                        droneObject={droneArray[(drone.id)]}
                      />
                      <DroneConfiguration
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
                      <DroneConfiguration
                        magnetometer={magnetometer}
                      />
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
