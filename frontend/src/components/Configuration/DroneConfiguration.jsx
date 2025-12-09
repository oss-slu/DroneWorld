import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SensorConfiguration from './SensorConfiguration';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useMainJson } from '../../contexts/MainJsonContext';
import { SimulationConfigurationModel } from '../../model/SimulationConfigurationModel';

const flightPaths = [
  { value: 'fly_in_circle', label: 'Circle', id: 1 },
  { value: 'fly_to_points', label: 'Square', id: 1 },
];

const droneTypes = [
  { value: 'FixedWing', label: 'Fixed Wing' },
  { value: 'MultiRotor', label: 'Multi Rotor' },
];

const droneModels = {
  FixedWing: [
    { value: 'SenseflyeBeeX', label: 'Sensefly eBee X' },
    { value: 'TrinityF90', label: 'Trinity F90' },
  ],
  MultiRotor: [
    { value: 'ParrotANAFI', label: 'Parrot ANAFI' },
    { value: 'DJI', label: 'DJI' },
    { value: 'StreamLineDesignX189', label: 'StreamLineDesign X189' },
  ],
};

export default function DroneConfiguration(droneData) {
  const { mainJson, setMainJson } = useMainJson();
  const {
    name = '',
    id = '',
    droneObject = {},
    resetName = () => {},
    droneJson = () => {},
  } = droneData || {};

  const [selectedLoc, setSelectedLoc] = React.useState('GeoLocation');
  const [selectedModel, setSelectedModel] = React.useState('');
  const [selectedDroneType, setselectedDroneType] = React.useState(droneTypes[1].value);
  const [snackBarState, setSnackBarState] = React.useState({ open: false });

  const [drone, setDrone] = React.useState(() => {
    const defaults = {
      VehicleType: 'SimpleFlight',
      DefaultVehicleState: 'Armed',
      EnableCollisionPassthrogh: false,
      EnableCollisions: true,
      AllowAPIAlways: true,
      EnableTrace: false,
      Name: name,
      droneName: name,
      X: 0,
      Y: 0,
      Z: 0,
      Pitch: 0,
      Roll: 0,
      Yaw: 0,
      Sensors: null,
      MissionValue: null,
      Mission: {
        name: 'fly_to_points',
        param: [],
      },
    };
    return { ...defaults, ...(droneData?.getDroneBasedOnIndex?.(id) || {}), ...droneObject };
  });

  const syncDroneLocation = React.useCallback(
    (x, y, z) => {
      const updatedDrone = {
        ...(droneData?.getDroneBasedOnIndex?.(id) || drone),
        X: x,
        Y: y,
        Z: z,
      };

      if (droneData?.updateDroneBasedOnIndex) {
        droneData.updateDroneBasedOnIndex(id, updatedDrone);
      }

      setDrone(updatedDrone);
      droneJson(updatedDrone, id);
    },
    [droneData, id, droneJson, drone],
  );

  const dropHandler = React.useCallback(
    (e) => {
      e.preventDefault();

      // Safely calculate position
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      syncDroneLocation(x, y, 0);
    },
    [syncDroneLocation],
  );

  // Set up event listeners
  React.useEffect(() => {
    const canvas = document.getElementById('drone-config-canvas');
    if (canvas) {
      canvas.addEventListener('drop', dropHandler);
      canvas.addEventListener('dragover', (e) => e.preventDefault());

      return () => {
        canvas.removeEventListener('drop', dropHandler);
        canvas.removeEventListener('dragover', (e) => e.preventDefault());
      };
    }
  }, [dropHandler]);

  // Sync position changes from external updates
  React.useEffect(() => {
    if (!droneData?.droneObject) return;

    setDrone((prev) => ({
      ...prev,
      X: droneData.droneObject.X ?? prev.X,
      Y: droneData.droneObject.Y ?? prev.Y,
      Z: droneData.droneObject.Z ?? prev.Z,
    }));
  }, [droneData?.droneObject?.X, droneData?.droneObject?.Y, droneData?.droneObject?.Z]);

  const handleMissionChange = (event) => {
    setDrone((prevState) => ({
      ...prevState,
      Mission: {
        ...prevState.Mission,
        name: event.target.value,
      },
    }));
  };

  const handleDroneTypeChange = (event) => {
    handleSnackBarVisibility(true);
    setselectedDroneType(event.target.value);
    setDrone((prevState) => ({
      ...prevState,
      droneType: event.target.value,
    }));
  };

  const handleDroneModelChange = (event) => {
    handleSnackBarVisibility(true);
    setSelectedModel(event.target.value);
    setDrone((prevState) => ({
      ...prevState,
      droneModel: event.target.value,
    }));
  };

  const handleChange = (val) => {
    let drone = mainJson.getDroneBasedOnIndex(id);
    if (val.target.id === 'Name') {
      drone.droneName = val.target.value;
      resetName(val.target.value, id);
      setDrone((prevState) => ({
        ...prevState,
        droneName: val.target.value,
      }));
    }
    setDrone((prevState) => ({
      ...prevState,
      [val.target.id]:
        val.target.type === 'number' ? parseFloat(val.target.value) : val.target.value,
    }));
    drone[val.target.id] =
      val.target.type === 'number' ? parseFloat(val.target.value) : val.target.value;
    mainJson.updateDroneBasedOnIndex(id, drone);
    setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
  };

  const setSensorConfig = (sensor) => {
    setDrone((prevState) => ({
      ...prevState,
      Sensors: sensor,
    }));
  };

  const handleSnackBarVisibility = (val) => {
    setSnackBarState((prevState) => ({
      ...prevState,
      open: val,
    }));
  };

  return (
    <div>
      <Snackbar
        open={snackBarState.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={6000}
        onClose={() => handleSnackBarVisibility(false)}
      >
        <Alert
          onClose={() => handleSnackBarVisibility(false)}
          severity='info'
          sx={{ width: '100%' }}
        >
          Drone Type and Drone Model Changes are under Development!
        </Alert>
      </Snackbar>

      <Box
        id='drone-config-canvas'
        sx={{
          width: '100%',
          border: '1px solid grey',
          paddingBottom: 5,
          paddingTop: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Container fixed sx={{ display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} direction='column' alignItems='center'>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label='Name'
                id='Name'
                value={drone.droneName}
                variant='standard'
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id='flight-path'>Mission</InputLabel>
                <Select
                  label='Flight Path'
                  value={drone.Mission.name}
                  onChange={handleMissionChange}
                >
                  {flightPaths.map((val) => (
                    <MenuItem value={val.value} key={val.id}>
                      <em>{val.label}</em>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id='drone-type'>Drone Type</InputLabel>
                <Select
                  label='Select Drone Type'
                  value={selectedDroneType}
                  onChange={handleDroneTypeChange}
                >
                  {droneTypes.map((val) => (
                    <MenuItem value={val.value} key={val.value}>
                      <em>{val.label}</em>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id='drone-model'>Drone Model</InputLabel>
                <Select
                  label='Select Drone Model'
                  value={selectedModel}
                  onChange={handleDroneModelChange}
                >
                  {droneModels[selectedDroneType]?.map((val) => (
                    <MenuItem value={val.value} key={val.value}>
                      <em>{val.label}</em>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid container direction='column' alignItems='center'>
              {!drone.X && (
                <FormControl variant='standard' sx={{ minWidth: 150 }}>
                  Home Location
                </FormControl>
              )}

              {selectedLoc === 'GeoLocation' ? (
                <>
                  <Tooltip title='Stepping distance of 0.0001, equivalent to 1m' placement='bottom'>
                    <Grid item xs={3}>
                      <TextField
                        id='X'
                        label='Latitude'
                        variant='standard'
                        type='number'
                        inputProps={{ step: '.0001' }}
                        value={drone.X}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Tooltip>
                  <Tooltip title='Stepping distance of 0.0001, equivalent to 1m' placement='bottom'>
                    <Grid item xs={3}>
                      <TextField
                        id='Y'
                        label='Longitude'
                        variant='standard'
                        type='number'
                        inputProps={{ step: '.0001' }}
                        value={drone.Y}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Tooltip>
                  <Tooltip title='Drone Spawning Height above ground (meters)' placement='bottom'>
                    <Grid item xs={3}>
                      <TextField
                        id='Z'
                        label='Height'
                        variant='standard'
                        type='number'
                        inputProps={{ step: '1' }}
                        value={drone.Z}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Grid item xs={3}>
                    <TextField
                      id='X'
                      label='X'
                      variant='standard'
                      type='number'
                      inputProps={{ step: '.0001' }}
                      value={drone.X}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id='Y'
                      label='Y'
                      variant='standard'
                      type='number'
                      inputProps={{ step: '.0001' }}
                      value={drone.Y}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id='Z'
                      label='Z'
                      variant='standard'
                      type='number'
                      inputProps={{ step: '.0001' }}
                      value={drone.Z}
                      disabled
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <SensorConfiguration setSensor={setSensorConfig} sensorJson={drone.Sensors} />
        </Container>
      </Box>
    </div>
  );
}
