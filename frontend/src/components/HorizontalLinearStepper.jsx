import * as React from 'react';
import { Box, Grid } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import MissionConfiguration from './Configuration/MissionConfiguration';
import EnvironmentConfiguration from './EnvironmentConfiguration';
import MonitorControl from './MonitorControl';
import Home from '../pages/Home';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';
import CesiumMap from './cesium/CesiumMap';
import { mapControls } from '../constants/map';
import ControlsDisplay from './Configuration/ControlsDisplay';

const StyledButton = styled(Button)`
  border-radius: 25px;
  font-size: 18px;
  font-weight: bolder;
`;

const steps = ['Environment Configuration', 'Mission Configuration', 'Test Configuration'];

export default function HorizontalLinearStepper(data) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [mainJson, setJson, activeScreen] = React.useState({
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
    // if(activeStep == 0) {
    //   setMainJson();
    // }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    addTask();
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

  //Start Logic For Calling POST

  //This function goes in and gets the drone data from main JSON and formats it all pretty for the POST Call
  function getDronesForPayload(mainJson) {
    return Array.isArray(mainJson?.Drones)
      ? mainJson.Drones.map((d) => {
          const { id, droneName, Sensors, ...rest } = d || {};
          const sanitizedSensors = Sensors
            ? {
                ...Sensors,
                Barometer: Sensors.Barometer
                  ? (({ Key, ...b }) => b)(Sensors.Barometer)
                  : undefined,
                Magnetometer: Sensors.Magnetometer
                  ? (({ Key, ...m }) => m)(Sensors.Magnetometer)
                  : undefined,
                GPS: Sensors.GPS
                  ? (({ Key, ...g }) => g)(Sensors.GPS)
                  : undefined,
              }
            : undefined;
          return { ...rest, Sensors: sanitizedSensors };
        })
      : [];
  }

  //this function goes in and gets the data for the environment from mainJSON
  function getEnvironmentForPayload(env) {
    if (!env) return null;

    const useGeo = !!env.UseGeo;

    const origin = env.Origin || {};
    const lat = origin.Latitude ?? origin.latitude;
    const lon = origin.Longitude ?? origin.longitude;

    const environmentToSend = {
      UseGeo: useGeo,
      Origin: {
        Latitude: lat,
        Longitude: lon,
      },
    };

    if (env.Wind) environmentToSend.Wind = env.Wind;
    if (env.TimeOfDay) environmentToSend.TimeOfDay = env.TimeOfDay;
    if (env.Sades) environmentToSend.Sades = env.Sades;

    return environmentToSend;
  }

  //meat and potatoes, this function actually makes the call
  //the other end is simulation_server.py line 139
  async function addTask() {
    if (activeStep !== steps.length - 1) return;

    const dronesToSend = getDronesForPayload(mainJson);
    if (dronesToSend.length === 0) {
      console.warn('No drones configured; not submitting.');
      return;
    }

    const environmentToSend = getEnvironmentForPayload(mainJson.environment);
    if (
      !environmentToSend ||
      (environmentToSend.UseGeo &&
        (environmentToSend.Origin.Latitude == null ||
        environmentToSend.Origin.Longitude == null))
    ) {
      console.warn('Environment incomplete; not submitting.');
      return;
    }

    const payload = {
      Drones: dronesToSend,
      environment: environmentToSend,
      ...(mainJson.monitors ? { monitors: mainJson.monitors } : {}),
      ...(mainJson.FuzzyTest ? { FuzzyTest: mainJson.FuzzyTest } : {}),
    };

    try {
      console.log('POST /addTask payload:', payload);
      const res = await fetch('http://127.0.0.1:5000/addTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const bodyText = await res.text(); 
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${bodyText}`);

      let data;
      try { data = JSON.parse(bodyText); } catch { data = { raw: bodyText }; }
      console.log('Task queued:', data); 

    } catch (err) {
      console.error('Submit failed:', err);

    }
  }

  const stepsComponent = [
    {
      name: 'Environment Configuration',
      id: 1,
      comp: (
        <EnvironmentConfiguration
          environmentJson={setMainJson}
          id='environment'
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
          id='Drones'
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
          id='monitors'
          mainJsonValue={mainJson}
          windowHeight={windowSize.current[1]}
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: '95%' }}>
      <Typography sx={{ mb: 1 }} variant='h4' component='h4'>
        Requirement
        <Tooltip title='Home' placement='bottom'>
          <HomeIcon
            style={{ float: 'right', cursor: 'pointer', fontSize: '35px' }}
            onClick={redirectToHome}
          />
        </Tooltip>
      </Typography>
      <Typography sx={{ mt: 2, mb: 1 }} variant='h6' component='h4'>
        {data.desc}
      </Typography>
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
      {activeStep === steps.length ? (
        <React.Fragment>
          Redirect to dashboard //TODO
          {/* <Typography sx={{ mt: 2, mb: 1 }}>finish</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box> */}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1 }}  variant="h4" component="h4">Requirement</Typography>
          <Typography sx={{ mt: 2, mb: 1 }}  variant="h6" component="h4">{data.desc}</Typography> */}
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Box sx={{ width: '45%' }}>
              {stepsComponent.map((compo, index) => {
                return compo.id === activeStep + 1 ? compo.comp : '';
              })}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <StyledButton
                  color='inherit'
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  variant='outlined'
                >
                  Back
                </StyledButton>
                <Box sx={{ flex: '1 1 auto' }} />
                <StyledButton variant='outlined' onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </StyledButton>
              </Box>
            </Box>

            <Box sx={{ width: '55%', overflow: 'hidden', ml: 5 }}>
              <Grid container>
                <ControlsDisplay mapControl={mapControls.default} />
                <Grid item xs={12}>
                  <CesiumMap activeConfigStep={activeStep} />
                </Grid>

                <ControlsDisplay mapControl={mapControls[activeScreen]} />
              </Grid>
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}