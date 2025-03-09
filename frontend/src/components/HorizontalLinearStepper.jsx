import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import MissionConfiguration from './Configuration/MissionConfiguration';
import EnvironmentConfiguration from './EnvironmentConfiguration';
import MonitorControl from './MonitorControl';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';
import CesiumMap from '../cesium/CesiumMap';

const StyledButton = styled(Button)`
  border-radius: 25px;
  font-size: 18px;
  font-weight: bolder;
`;

const steps = [
  'Environment Configuration',
  'Mission Configuration',
  'Test Configuration',
];

export default function HorizontalLinearStepper(data) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [mainJson, setJson] = React.useState({
    Drones: null,
    environment: null,
    monitors: null,
  });

  const windowSize = React.useRef([window.innerWidth, window.innerHeight]);

  const redirectToHome = () => {
    navigate('/');
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const setMainJson = (envJson, id) => {
    if (
      id == 'environment' &&
      mainJson.Drones != null &&
      mainJson.Drones[0].X != envJson.Origin.Latitude
    ) {
      setJson((prevState) => ({
        ...prevState,
        Drones: null,
      }));
    }
    setJson((prevState) => ({
      ...prevState,
      [id]: envJson,
    }));
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    invokePostAPI();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  React.useEffect(() => {
    if (
      mainJson.environment != null &&
      mainJson.environment.enableFuzzy == true &&
      mainJson.environment.enableFuzzy != null
    ) {
      setJson((prevState) => ({
        ...prevState,
        FuzzyTest: {
          target: 'Wind',
          precision: 5,
        },
      }));
      delete mainJson.environment['enableFuzzy'];
    }
    if (
      mainJson.environment != null &&
      mainJson.environment.enableFuzzy == false &&
      mainJson.FuzzyTest != null
    ) {
      delete mainJson.FuzzyTest;
    }
  }, [mainJson]);

  const invokePostAPI = () => {
    console.log('mainJson-----', mainJson);
    if (activeStep === steps.length - 1) {
      mainJson.Drones.map((drone) => {
        delete drone['id'];
        delete drone['droneName'];
        delete drone.Sensors.Barometer['Key'];
        delete drone.Sensors.Magnetometer['Key'];
        delete drone.Sensors.GPS['Key'];
      });

      delete mainJson.environment['time'];
      mainJson.monitors.circular_deviation_monitor['enable'] == true
        ? delete mainJson.monitors.circular_deviation_monitor['enable']
        : delete mainJson.monitors.circular_deviation_monitor;
      mainJson.monitors.collision_monitor['enable'] == true
        ? delete mainJson.monitors.collision_monitor['enable']
        : delete mainJson.monitors.collision_monitor;
      mainJson.monitors.unordered_waypoint_monitor['enable'] == true
        ? delete mainJson.monitors.unordered_waypoint_monitor['enable']
        : delete mainJson.monitors.unordered_waypoint_monitor;
      mainJson.monitors.ordered_waypoint_monitor['enable'] == true
        ? delete mainJson.monitors.ordered_waypoint_monitor['enable']
        : delete mainJson.monitors.ordered_waypoint_monitor;
      mainJson.monitors.point_deviation_monitor['enable'] == true
        ? delete mainJson.monitors.point_deviation_monitor['enable']
        : delete mainJson.monitors.point_deviation_monitor;
      mainJson.monitors.min_sep_dist_monitor['enable'] == true
        ? delete mainJson.monitors.min_sep_dist_monitor['enable']
        : delete mainJson.monitors.min_sep_dist_monitor;
      mainJson.monitors.landspace_monitor['enable'] == true
        ? delete mainJson.monitors.landspace_monitor['enable']
        : delete mainJson.monitors.landspace_monitor;
      mainJson.monitors.no_fly_zone_monitor['enable'] == true
        ? delete mainJson.monitors.no_fly_zone_monitor['enable']
        : delete mainJson.monitors.no_fly_zone_monitor;
      mainJson.monitors.drift_monitor['enable'] == true
        ? delete mainJson.monitors.drift_monitor['enable']
        : delete mainJson.monitors.drift_monitor;
      mainJson.monitors.battery_monitor['enable'] == true
        ? delete mainJson.monitors.battery_monitor['enable']
        : delete mainJson.monitors.battery_monitor;
      delete mainJson.environment['enableFuzzy'];
      delete mainJson.environment['timeOfDayFuzzy'];
      delete mainJson.environment['windFuzzy'];
      delete mainJson.environment['positionFuzzy'];
      console.log('mainJson-----', JSON.stringify(mainJson));
      navigate('/report-dashboard', {
        state: { mainJson: mainJson },
      });
      fetch('http://127.0.0.1:5000/addTask', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(mainJson),
      })
        .then((res) => res.json())
        .then((res) => console.log(res));
    }
  };

  const stepsComponent = [
    {
      name: 'Environment Configuration',
      id: 1,
      comp: (
        <EnvironmentConfiguration
          environmentJson={setMainJson}
          id="environment"
          mainJsonValue={mainJson}
        />
      ),
    },
    {
      name: 'Mission Configuration',
      id: 2,
      comp: (
        <MissionConfiguration
          droneArrayJson={setMainJson}
          id="Drones"
          mainJsonValue={mainJson}
          windowHeight={windowSize.current[1]}
        />
      ),
    },
    {
      name: 'Test Configuration',
      id: 3,
      comp: (
        <MonitorControl
          monitorJson={setMainJson}
          id="monitors"
          mainJsonValue={mainJson}
          windowHeight={windowSize.current[1]}
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        maxHeight: '98vh',
        overflowY: 'hidden',
        padding: '1vw',
        boxSizing: 'border-box',
      }}
    >
      <Tooltip title="Return to home" placement="bottom">
        <HomeIcon
          style={{ float: 'right', cursor: 'pointer', fontSize: '35px', color: 'white' }}
          onClick={redirectToHome}
        />
      </Tooltip>
      <Box
        sx={{
          display: 'flex',
          width: '98vw',
          alignItems: 'start',
          padding: '1vw',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ width: '45%' }}>
          <Stepper activeStep={activeStep} style={{ padding: 20 }}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <Box sx={{ mt: 2 }}>
            {stepsComponent[activeStep].comp}
          </Box>
        </Box>
          
        <Box sx={{ width: '55%', overflow: 'hidden', border: 1, borderColor: 'yellow', ml: 5 }}>
          <CesiumMap activeConfigStep={activeStep} />
        </Box>
      </Box>
    </Box>
  );
}