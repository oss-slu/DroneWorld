import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Lidar from './SensorsConfiguration/Lidar';
import Barometer from './SensorsConfiguration/Barometer';
import IMU from './SensorsConfiguration/IMU';
import GPS from './SensorsConfiguration/GPS';
import Camera from './SensorsConfiguration/Camera';
import Magnetometer from './SensorsConfiguration/Magnetometer';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import RadarOutlinedIcon from '@mui/icons-material/RadarOutlined';
import DeveloperBoardOutlinedIcon from '@mui/icons-material/DeveloperBoardOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import Fab from '@mui/material/Fab';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BottomNavigation from '@mui/material/BottomNavigation';
import RouteIcon from '@mui/icons-material/Route';
import Distance from './SensorsConfiguration/Distance';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SensorConfiguration(param) {
  const [visibleSensor, setVisibleSensor] = React.useState(null);
  const [sensor, setSensor] = React.useState(
    param.sensorJson != null
      ? param.sensorJson
      : {
          Barometer: {
            SensorType: 1,
            Enabled: true,
            PressureFactorSigma: 0.001825,
            PressureFactorTau: 3600,
            UncorrelatedNoiseSigma: 2.7,
            UpdateLatency: 0,
            StartupDelay: 0,
            UpdateFrequency: 50,
            Key: 'Barometer',
          },
          IMU: {
            SensorType: 2,
            Enabled: true,
            AngularRandomWalk: 0.3,
            GyroBiasStabilityTau: 500,
            GyroBiasStability: 4.6,
            VelocityRandomWalk: 0.24,
            AccelBiasStabilityTau: 800,
            AccelBiasStability: 36,
            Key: 'IMU',
          },
          // Lidar: null,
          Magnetometer: {
            SensorType: 4,
            Enabled: true,
            NoiseSigma: 0.005,
            ScaleFactor: 1,
            NoiseBias: 0,
            UpdateLatency: 0,
            StartupDelay: 0,
            UpdateFrequency: 50,
            Key: 'Magnetometer',
          },
          GPS: {
            SensorType: 3,
            Enabled: true,
            EphTimeConstant: 0.9,
            EpvTimeConstant: 0.9,
            EphInitial: 25,
            EpvInitial: 25,
            EphFinal: 0.1,
            EpvFinal: 0.1,
            EphMin3d: 3,
            EphMin2d: 4,
            UpdateLatency: 0.2,
            StartupDelay: 1,
            UpdateFrequency: 50,
            Key: 'GPS',
          },
          // Distance:null
        },
  );
  const [open, setOpen] = React.useState(false);
  const handleOpen = (sensr) => {
    setOpen(true);
    setVisibleSensor(sensr);
  };
  const handleClose = (e, name) => {
    if (name != 'Camera') {
      setSensor((prevState) => ({
        ...prevState,
        [name]: e,
      }));
      param.setSensor(sensor);
    } else {
      param.setCamera(e);
    }
    setOpen(false);
  };

  const updateSensorOjb = (e, name) => {
    console.log('in sensor config--- updateSensorOjb----', e, 'gghgg---', name);
    if (name != 'Camera') {
      setSensor((prevState) => ({
        ...prevState,
        [name]: e,
      }));
      param.setSensor(sensor);
    } else {
      param.setCamera(e);
    }
  };

  React.useEffect(() => {
    console.log('use effect in sensor config');
    param.setSensor(sensor);
  }, [sensor]);

  const configBtns = [
    // {
    //     name:'Lidar',
    //     id:1,
    //     icon:<RadarOutlinedIcon/>,
    //     comp:<Lidar closeModal={handleClose} name="Lidar" lidarObj={sensor.Lidar}/>
    // },
    {
      name: 'Camera',
      id: 2,
      icon: <CameraAltOutlinedIcon />,
      comp: <Camera closeModal={handleClose} name='Camera' />,
    },
    {
      name: 'Barometer',
      id: 3,
      icon: <DeviceThermostatOutlinedIcon />,
      comp: (
        <Barometer
          closeModal={handleClose}
          name='Barometer'
          barometerObj={sensor.Barometer}
          updateJson={updateSensorOjb}
        />
      ),
    },
    {
      name: 'Magnetometer',
      id: 4,
      icon: <ExploreOutlinedIcon />,
      comp: (
        <Magnetometer
          closeModal={handleClose}
          name='Magnetometer'
          magnetometerObj={sensor.Magnetometer}
          updateJson={updateSensorOjb}
        />
      ),
    },
    {
      name: 'IMU',
      id: 5,
      icon: <DeveloperBoardOutlinedIcon />,
      comp: (
        <IMU closeModal={handleClose} name='IMU' imuObj={sensor.IMU} updateJson={updateSensorOjb} />
      ),
    },
    {
      name: 'GPS',
      id: 6,
      icon: <GpsFixedOutlinedIcon />,
      comp: (
        <GPS closeModal={handleClose} name='GPS' gPSObj={sensor.GPS} updateJson={updateSensorOjb} />
      ),
    },
    // {
    //     name:'Distance',
    //     id:7,
    //     icon:<RouteIcon/>,
    //     comp:<Distance closeModal={handleClose} name="Distance"/>
    // }
  ];

  return (
    <div>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        style={{ paddingTop: '15px', marginTop: '15px' }}
      >
        {configBtns.map(function (btns) {
          return (
            <div key={btns.id} style={{ padding: '5px' }}>
              <Grid item xs={4}>
                <ButtonGroup key={btns.id} size='small' aria-label='small outlined button group'>
                  <Button variant='outlined' onClick={() => handleOpen(btns)}>
                    <BottomNavigation value={btns.name}>
                      <BottomNavigationAction
                        value={btns.name}
                        label={btns.name}
                        style={{ color: 'black' }}
                        icon={
                          <Fab color='primary' size='small'>
                            {' '}
                            {btns.icon}{' '}
                          </Fab>
                        }
                      />
                    </BottomNavigation>
                  </Button>
                </ButtonGroup>
              </Grid>
            </div>
          );
        })}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>{visibleSensor != null ? visibleSensor.comp : ''}</Box>
      </Modal>
    </div>
  );
}
