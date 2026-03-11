import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
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

const Wizard = () => {
  const location = useLocation()
 console.log({location });
  return (
    <>
      <Box sx={style}>
        <HorizontalLinearStepper desc={location.state.descs} title={location.state.title}/>
      </Box>
    </>
  );
};

export default Wizard;
