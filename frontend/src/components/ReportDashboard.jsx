import CardMedia from '@mui/material/CardMedia'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List'
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import { useLocation } from "react-router-dom";
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';
import AlertTitle from '@mui/material/AlertTitle';
import { wait } from '@testing-library/user-event/dist/utils';
//import { Card, CardContent } from '@mui/material';
import PropTypes from 'prop-types'; 
//import FuzzyDashboard from '/dashboard';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';   
import FuzzyDashboard from './FuzzyDashboard'; 
//import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// ReportDashboard.js
import React, { useEffect } from 'react';
//import { Card, CardHeader, CardContent } from '@material-ui/core';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const useStyles = makeStyles((theme) => ({ 
  lightBlueBackground: {
    backgroundColor: '#e3f2fd', 
  },
  card: {
    maxWidth: 400,
    height: 270,
    border: '1px solid lightgreen', 
    backgroundColor: '#e3f2fd', 
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', 
  },
  invalidData: {
    fontWeight: 'bold',
    color: 'red', 
  },
  button: {
    backgroundColor: '#1976d2', 
    color: '#fff', 
    '&:hover': {
      backgroundColor: '#1565c0', 
    },
  },
})); 

  
  export default function ReportDashboard(parameter) {

    const [reportFiles, setReportFiles] = React.useState([]);  
   // const isFuzzy = file.filename.includes('Fuzzy'); 
    const classes = useStyles();  

    const navigate = useNavigate(); 
    const redirectToHome = () => {
      navigate('/')
    }
    const redirectToFuzzyDashboard = () => {
      navigate('/dashboard')
    }

    useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:5000/list-reports', { method: 'GET' })
        .then((res) => {
          if (!res.ok) {
            throw new Error('No response from server/something went wrong');
          }
          return res.json();
        })
        .then((data) => {
          // 'data.reports' containing filename and fuzzy info
          console.log('Report Files:', data.reports);
          setReportFiles(data.reports);
        })
        .catch((error) => {
          console.error('Error fetching report data:', error);
        });
    };
    fetchData();
  }, []);
  const [snackBarState, setSnackBarState] = React.useState({
    open: false,
  });

  const handleSnackBarVisibility = (val) => {
    setSnackBarState(prevState => ({
      ...prevState,
      open: val
    }))
  }
  const handleClickAway = () => {
    handleSnackBarVisibility(true);
  };
  useEffect(() => {
    handleSnackBarVisibility(true);
  }, []);
    
  return (
    <>
      {reportFiles.length === 0 && (
        <Snackbar
          open={snackBarState.open}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={60000}
          onClose={() => handleSnackBarVisibility(false)}
        >
          <Alert
            onClose={() => handleSnackBarVisibility(false)}
            severity="info"
            sx={{ maxHeight: '150px', maxWidth: '100%' }}
          >
            {"No reports found"}
          </Alert>
        </Snackbar>
      )}
      <Typography variant="h4" fontWeight="bold" style={{ textAlign: 'center', marginTop: '20px', marginBottom: "2rem" }}>
        Acceptance Report
        <Tooltip title="Home" placement='bottom'><HomeIcon style={{ float: 'right', cursor: 'pointer', fontSize: '35px' }} onClick={redirectToHome} /></Tooltip>

        <Container maxWidth="sm" style={{ padding: '10px', alignContent: 'center' }}>
          {/* <Paper variant="outlined" square style={{textAlign:'center', padding:'10px'}}> */}
          {/* <div>UPLOAD FILE CONTENTS</div><br/><br/> */}
        </Container>
        {reportFiles.length === 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={redirectToFuzzyDashboard}
            style={{ marginTop: '10px' }}
          >
            Go to Fuzzy Dashboard
          </Button>
        )}
      </Typography>
      <Grid container spacing={2} style={{ width: '100%', paddingLeft: '45px', justifyContent: 'flex-start' }}>
        {reportFiles.map((file) => {
          const parts = file.filename.split('_');

          if (!file || !file.filename || file.filename.includes('.DS_Store')) {
            return null;
          }

          if (parts.length < 2) {
            return (
              <Grid key={file.id} item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Invalid Report Data: {file.filename}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <p>Drone Count: {file.drone_count}</p>
                      <p>Acceptance: {file.pass_count}</p>
                      {file.contains_fuzzy && <p>Fuzzy Testing {file.contains_fuzzy}</p>}
                      {!file.contains_fuzzy && <p>Simulation Testing</p>}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          }

          const datePart = parts[0];
          const batchName = parts.slice(1).join('_');

          const date = datePart.substr(0, 10);
          const time = datePart.substr(11, 8);

          const formattedDate = `${date.substr(5, 2)},${date.substr(8, 2)},${date.substr(0, 4)}`;
          const formattedTime = `${time.substr(0, 2)}:${time.substr(3, 2)}:${time.substr(6, 2)}`;

          const formattedTimestamp = `${formattedDate} ${formattedTime}`;

          return (
            <Grid key={file.id} item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>{formattedTimestamp} [{batchName}]</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <p>Acceptance: {file.pass_count}</p>
                    <p>Drone Count: {file.drone_count}</p>
                    {file.contains_fuzzy && <p>Fuzzy Testing {file.contains_fuzzy}</p>}
                    {!file.contains_fuzzy && <p>Simulation Testing</p>}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}