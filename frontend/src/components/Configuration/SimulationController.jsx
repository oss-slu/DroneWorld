import { useState, useRef, Fragment, useEffect } from 'react';
import { CircularProgress, Box, Grid } from '@mui/material';
import MissionConfiguration from './MissionConfiguration';
import EnvironmentConfiguration from './EnvironmentConfiguration';
import CesiumMap from '../cesium/CesiumMap';
import MonitorControl from '../MonitorControl';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { useMainJson } from '../../contexts/MainJsonContext';
import { StyledTab, StyledTabs } from '../../css/SimulationPageStyles';
import { callAPI } from '../../utils/ApiUtils';
import { mapControls } from '../../constants/map';
import ControlsDisplay from './ControlsDisplay';
import { BootstrapTooltip, StyledButton } from '../../css/muiStyles';
import SaveConfigModal from '../SaveConfigModal';
import { steps } from '../../constants/simConfig';
import { mapEnvironmentData } from '../../utils/mapper/envMapper';
import { mapDroneData } from '../../utils/mapper/droneMapper';
import { isTokenExpired } from '../../utils/authUtils';
import useSessionManager from '../../hooks/useSessionManager';

export default function SimulationController() {
  // START of DOM model ===================
  const navigate = useNavigate();
  const { state } = useLocation();
  const { mainJson, setMainJson, envJson, setEnvJson, activeScreen } = useMainJson();
  const { handleSessionExpiration } = useSessionManager();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const configId = state?.configData.id;
  const [loading, setLoading] = useState(false);
  // END of DOM Model================

  const fetchConfigDetailsFromApi = async () => {
    if (isTokenExpired()) {
      handleSessionExpiration(location, null);
      return;
    }

    setLoading(true);
    try {
      const data = await callAPI(`api/sade_task/${configId}`, 'GET', null, 'JSON');

      const droneData = mapDroneData(data.drones);
      mainJson.drones = droneData;
      setMainJson(mainJson);

      const envData = mapEnvironmentData(data.environment);
      setEnvJson(envData);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch config details:', error);
      setLoading(false);
    }
  };

  const fetchConfigDetailsFromLocalStorage = () => {
    try {
      const savedJson = localStorage.getItem('mainJson');
      if (configId || !savedJson) return;
      const parsedJson = JSON.parse(savedJson);

      const droneData = mapDroneData(parsedJson.drones);
      mainJson.drones = droneData;
      setMainJson(mainJson);

      const envData = mapEnvironmentData(parsedJson.environment);
      setEnvJson(envData);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch config details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (configId) {
      localStorage.removeItem('mainJson');
      fetchConfigDetailsFromApi();
    } else {
      fetchConfigDetailsFromLocalStorage();
    }
  }, [configId]);

  const redirectToHome = () => {
    navigate('/');
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleTabChange = (event, newValue) => {
    setActiveStep(newValue);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    setIsModalOpen(true);
  };

  const stepsComponent = [
    {
      name: 'Environment Configuration',
      id: 1,
      comp: (
        <EnvironmentConfiguration
          environemntJSONSetState={setEnvJson}
          id='environment'
          mainJSON={mainJson}
          environmentJSON={envJson}
          mainJSONSetState={setMainJson}
          tabIndex={0}
          configId={configId}
        />
      ),
    },
    {
      name: 'sUAS Configuration',
      id: 2,
      comp: (
        <MissionConfiguration
          id='drones'
          windowHeight={windowSize.current[1]}
          mainJSON={mainJson}
          mainJSONSetState={setMainJson}
          tabIndex={1}
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
          tabIndex={2}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    );
  }

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
      <BootstrapTooltip title='Return to home' placement='bottom'>
        <HomeIcon
          style={{ float: 'right', cursor: 'pointer', fontSize: '35px', color: 'white' }}
          onClick={redirectToHome}
        />
      </BootstrapTooltip>

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
          <StyledTabs value={activeStep} onChange={handleTabChange} aria-label='Configuration Tabs'>
            <StyledTab label='Environment' />
            <StyledTab label='sUAS' />
            {/* <StyledTab label="Test" /> */}
          </StyledTabs>
          <div>{activeStep != steps.length && stepsComponent[activeStep].comp}</div>
        </Box>

        <Box sx={{ width: '55%', overflow: 'hidden', border: 1, borderColor: 'yellow', ml: 5 }}>
          <Grid container>
            <ControlsDisplay mapControl={mapControls.default} />
            <Grid item xs={12}>
              <CesiumMap activeConfigStep={activeStep} />
            </Grid>

            <ControlsDisplay mapControl={mapControls[activeScreen]} />
          </Grid>
        </Box>
      </Box>

      {activeStep === steps.length ? (
        <Fragment>Redirect to dashboard //TODO</Fragment>
      ) : (
        <Fragment>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pt: 2,
              position: 'fixed',
              bottom: 8,
              left: 12,
              right: 12,
            }}
          >
            <StyledButton
              color='inherit'
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              variant='outlined'
            >
              Back
            </StyledButton>

            {activeStep === steps.length - 1 ? (
              <StyledButton variant='outlined' onClick={handleFinish}>
                Finish
              </StyledButton>
            ) : (
              <StyledButton variant='outlined' onClick={handleNext}>
                Next
              </StyledButton>
            )}
          </Box>
        </Fragment>
      )}

      <SaveConfigModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        activeStep={activeStep}
      />
    </Box>
  );
}
