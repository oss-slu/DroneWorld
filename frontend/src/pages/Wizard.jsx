import { Box } from '@mui/material';
import { useLocation, useSearchParams } from 'react-router-dom';
import HorizontalLinearStepper from '../components/HorizontalLinearStepper';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '95%',
  height: '90%',
  bgcolor: 'background.paper',
  p: 4,
};

const requirementsArray = [{}];

const Wizard = () => {
  const accordionList = [];
  const location = useLocation();
  console.log({ location });
  return (
    <>
      <Box sx={style}>
        <HorizontalLinearStepper desc={location.state.descs} title={location.state.title} />
      </Box>
    </>
  );
};

export default Wizard;
