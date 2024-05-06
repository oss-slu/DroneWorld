import React, { useState } from 'react';
import "../styles.css"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#0000CD',
    fontFamily: 'Arial, sans-serif',
  },
  siteTitle: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
  },
  navList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    fontFamily: 'Arial, sans-serif',
  },
  navListItem: {
    display: 'inline-block',
    marginLeft: '1rem',
  },
  aboutLink: {
    textDecoration: 'none',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '30px',
    transition: 'background-color 0.3s ease',
  },
}));
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function NavigationBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(false); // State for modal
  // const navigate = useNavigate(); 
  // const redirectToHome = () => {
  //   navigate('/')
  // }
  return (
    <div>
      <nav className={classes.nav}>
        <a href="/" className={classes.siteTitle}>
          Drone World
        </a>
        <ul className={classes.navList}>
          <li className={classes.navListItem}>
            <Box component="span">
              <Button
                className={classes.aboutLink}
                onClick={() => setOpen(true)}
                style={{ color: '#fff' }}
              >
                About Us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Button>
              {/* <Tooltip title="Home" placement="bottom">
            <HomeIcon style={{ float: 'right', cursor: 'pointer', fontSize: '35px' }} onClick={redirectToHome} />
          </Tooltip> */}
            </Box>
          </li>
        </ul>
      </nav>
    {/* About Us Modal */}
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
            style={{ position: 'absolute', top: 16, right: 16 }}
          >
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
              Drone World is revolutionizing sUAS (small Uncrewed Aerial Systems) testing. In the dynamic world of sUAS, safety and reliability are paramount. Traditional field testing across diverse environments is costly and challenging.
            </p>
            <p>
              Drone World offers an innovative sUAV simulation ecosystem that generates high-fidelity, realistic environments mimicking real-world complexities like adverse weather and wireless interference. Our automated solution allows developers to specify constraints and generate tailored test environments.
            </p>
            <p>
              The program monitors sUAV activities against predefined safety parameters and generates detailed acceptance test reports. This approach provides actionable insights for effective debugging and analysis, enhancing the safety, reliability, and efficiency of sUAS applications.
            </p>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default NavigationBar;