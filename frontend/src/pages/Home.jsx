import styled from '@emotion/styled';
import { Box, Button, TextField, Modal, Typography, Grid, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { useState, useEffect } from 'react';

const StyledButton = styled(Button)`
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  height: 50px;
`;

const StyledText = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px !important;
  width: 300px !important;
`;

const StyledTextField = styled(TextField)`
  width: 800px;
  height: 200px;
`;

const Home = () => {
  const [selectedvalue, setSelectedValue] = useState('');
  const [text, setText] = useState('Please select a requirement identifier');
  const [title, setTitle] = useState('');
  const [backendInfo, setBackendInfo] = useState({
    numQueuedTasks: 0,
    backendStatus: 'idle'
  });
  const [open, setOpen] = useState(false); // State for modal

  const getStatusStyle = () => {
    switch (backendInfo.backendStatus) {
      case 'idle':
        return { color: 'green' };
      case 'running':
        return { color: 'blue' };
      case 'error':
        return { color: 'red' };
      default:
        return { color: 'gray' };
    }
  };
  const statusStyle = getStatusStyle();

  const handleReqIdChange = (event) => {
    setSelectedValue(event.target.value);
    if (event.target.value === "UAV-301") {
      setText('Two sUAS (Small Unmanned Aircraft System) shall be able to complete a circular and square flight mission in windy weather conditions without colliding with stationary objects, the terrain, or other aircraft and drifting from its planned path by more than 10 meters.');
      setTitle("Circular and Square Flight Mission in Windy Weather")
    } else if (event.target.value === "UAV-302") {
      setText('Two sUAS (Small Unmanned Aircraft Systems) shall be able to complete their missions in windy weather conditions while maintaining a minimum separation distance of at least 5 meters between each other and without drifting by more than 5 meters.');
      setTitle("sUAS Mission Coordination in Windy Weather")
    } else if (event.target.value === "UAV-303") {
      setText('Two sUAS (Small Unmanned Aircraft Systems) shall be able to complete their respective missions in windy weather conditions without drifting from their planned path by more than 15 meters.');
      setTitle("sUAS Mission in Windy Weather with Path Accuracy")
    }
  };

  useEffect(() => {
    const callOnOpen = () => {
      fetch('http://localhost:5000/currentRunning')
        .then((res) => {
          if (!res.ok) {
            throw new Error('No response from server/something went wrong');
          }
          return res.text();
        })
        .then((data) => {
          const [status, queueSize] = data.split(', ');
          if (status === "None") {
            setBackendInfo({ numQueuedTasks: 0, backendStatus: 'idle' });
          } else if (status === "Running") {
            setBackendInfo({ numQueuedTasks: parseInt(queueSize), backendStatus: 'running' });
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setBackendInfo({ numQueuedTasks: -1, backendStatus: 'error' });
        });
    };
    callOnOpen();
  }, []);

  // Modal styles
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800, // Increase the width
    height: 400, // Increase the height
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <React.Fragment>
      <Typography style={{ width: 1000 }}>
        <Grid spacing={5} direction="row" style={{ marginTop: '15px', paddingTop: '15px', paddingLeft: '290px' }}>
          <Box border={1} borderColor={statusStyle.color} p={2} borderRadius={2} width={200} mb={5}>
            <Typography>
            Backend Status: <span style={statusStyle}>{backendInfo.backendStatus}</span>
            </Typography>
            </Box>
            <div style={{position: 'relative'}}>
            <div style={{position: 'absolute', left: 280, top: -80}}>
            <Typography>
            Queued Tasks: {backendInfo.numQueuedTasks}
            </Typography>
            </div>
            </div>
            </Grid>
            </Typography>
            <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexDirection: 'column',
      '& > :not(style)': {
        m: 1,
        width: 1000,
      },
    }}
  >
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Requirement ID</InputLabel>
      <Select
        labelId="req-id"
        id="req-id-select"
        value={selectedvalue}
        label="Requirement ID"
        onChange={handleReqIdChange}
      >
        <MenuItem value="UAV-301">UAV-301: Circular Flight Mission in Windy Weather</MenuItem>
        <MenuItem value="UAV-302">UAV-302: sUAS Mission Coordination in Windy Weather</MenuItem>
        <MenuItem value="UAV-303">UAV-303: sUAS Mission in Windy Weather with Path Accuracy</MenuItem>
      </Select>
    </FormControl>

    <Typography variant="h6" component="h4" style={{ marginTop: '3em' }}>
      {selectedvalue === '' ? text : `Title: ${title}`}
    </Typography>
    
    <Typography variant="h6" component="h4" style={{ marginTop: '1em' }}>
      {selectedvalue !== '' && `Description: ${text}`}
    </Typography>

    <StyledLink to='/simulation' state={{ req: selectedvalue.toString(), descs: text.toString(), title: title.toString() }}>
      <StyledButton variant='contained' disabled={text === "Please select a requirement identifier" ? true : false}>
        Start Scenario Configuration
      </StyledButton>
    </StyledLink>
    

    {/*Remove this code when implementing the header About us. Widen the component. Add a close button.*/}
    {/* Button to test Modal*/}
    {/* <Button onClick={() => setOpen(true)} style={{ marginTop: 20, marginBottom: 20 }}>About Us (Move this to Nav Bar later)</Button> */}

    {/* Modal Component */}
    <Modal
  open={open}
  onClose={() => setOpen(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={modalStyle}>
    {/* Close Button */}
    <Button 
      onClick={() => setOpen(false)} 
      style={{ position: 'absolute', top: 16, right: 16 }}>
      Close
    </Button>

    <Typography id="modal-modal-title" variant="h6" component="h2">
      {/* Title Content */}
    </Typography>

    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
    <p>
<strong>About Drone World</strong>
</p>
<p>
Drone World is revolutionizing sUAS (small Uncrewed Aerial Systems) testing. In the dynamic world
of sUAS, safety and reliability are paramount. Traditional field testing across diverse environments is costly
and challenging.
</p>
<p>
Drone World offers an innovative sUAV simulation ecosystem that generates high-fidelity, realistic environments
mimicking real-world complexities like adverse weather and wireless interference. Our automated solution allows
developers to specify constraints and generate tailored test environments.
</p>
<p>
The program monitors sUAV activities against predefined safety parameters and generates detailed acceptance test
reports. This approach provides actionable insights for effective debugging and analysis, enhancing the safety,
reliability, and efficiency of sUAS applications.
</p>
    </Typography>
  </Box>
</Modal>

  </Box>
</React.Fragment>
);
};

export default Home;
             
