import { Box } from '@mui/material';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import SimulationController from '../components/Configuration/SimulationController';
import { MainJsonProvider } from '../contexts/MainJsonContext';
import { simulationMainBoxstyle } from '../css/SimulationPageStyles';

const Simulation = () => {
  return (
    <>
      <Box sx={simulationMainBoxstyle}>
        <MainJsonProvider>
          <SimulationController />
        </MainJsonProvider>
      </Box>
    </>
  );
};

export default Simulation;
