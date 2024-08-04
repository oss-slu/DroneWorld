import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import { useLocation } from 'react-router-dom';
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
import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import CircularProgress from '@mui/material/CircularProgress';
import { Table, TableBody, TableCell, TableRow, TableColumn } from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Loading from './Loading';

const useStyles = makeStyles((theme) => ({
  lightBlueBackground: {
    backgroundColor: '#e3f2fd',
  },
  cardMedia: {
    width: '80%',
    height: 'auto',
  },
  fullWidthBox: {
    width: '100vw',
    margin: 0,
    padding: 0,
  },
  card: {
    maxWidth: 400,
    height: 270,
    border: '1px solid lightgreen',
    backgroundColor: '#e3f2fd',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  },
  fullScreenContainer: {
    width: '50%',
    padding: 0,
    margin: 0,
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

//const sampleData = [
//  {
//    "contains_fuzzy": false,
//    "drone_count": 0,
//    "fail": 0,
//    "filename": ".DS_Store",
//    "pass": 0
//},
//{
//  "contains_fuzzy": true,
// "drone_count": 1,
// "fail": 0,
//  "filename": "2023-10-10-15-09-38_Batch_1",
//  "pass": 2
//},
//{
//   "contains_fuzzy": true,
//   "drone_count": 10,
//   "fail": 2,
//   "filename": "2023-10-10-15-13-17_Batch_2",
//   "pass": 8
//},
//{
//  "contains_fuzzy": true,
//  "drone_count": 15,
//  "fail": 5,
//  "filename": "2023-10-10-15-15-35_Batch_3",
// "pass": 10
//}
//];

export default function ReportDashboard(showTitle) {
  const [reportFiles, setReportFiles] = React.useState([]);
  const [isLoading, setIsloading] = React.useState(false);
  // const isFuzzy = file.filename.includes('Fuzzy');
  const classes = useStyles();

  const navigate = useNavigate();
  const redirectToHome = () => {
    navigate('/');
  };
  const redirectToFuzzyDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchData = () => {
      setIsloading(true);
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
        })
        .finally(() => {
          setIsloading(false);
        });;
    };

    // Set the sample data initially
    //setReportFiles(sampleData);

    // Fetch data after setting the sample data
    setReportFiles([]);

    fetchData();
  }, []);

  const [snackBarState, setSnackBarState] = React.useState({
    open: false,
  });

  const handleSnackBarVisibility = (val) => {
    setSnackBarState((prevState) => ({
      ...prevState,
      open: val,
    }));
  };
  const handleClickAway = () => {
    handleSnackBarVisibility(true);
  };
  useEffect(() => {
    handleSnackBarVisibility(true);
  }, []);
  const getFolderContents = (file) => {
    fetch(`http://localhost:5000/list-folder-contents/${file.filename}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: {},
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('No response from server/something went wrong');
        }
        return res.json();
      })
      .then((data) => {
        console.log('File Json: ', data);
        navigate('/dashboard', {
          state: {
            data: data,
            file: { fuzzy: file.contains_fuzzy, fileName: file.filename, fail: file.fail },
          },
        });
        return data;
      })
      .catch((error) => {
        console.error('Error fetching report data:', error);
      });
  };
  const handleButtonClick = (file) => {
    console.log('Button clicked:', file);
    getFolderContents(file);
  };

  const acceptanceReportTypography = (
    <Typography
      variant='h4'
      fontWeight='bold'
      style={{ textAlign: 'center', marginTop: '20px', marginBottom: '2rem', color: '#000000' }}
    >
      <Link to='/report-dashboard' style={{ textDecoration: 'none', color: '#000000' }}>
        Acceptance Report
      </Link>
      <Tooltip title='Home' placement='bottom'>
        <HomeIcon
          style={{ float: 'right', cursor: 'pointer', fontSize: '35px' }}
          onClick={redirectToHome}
        />
      </Tooltip>
    </Typography>
  );

  return (
    <>
      <Box className={classes.fullWidthBox}>
        <CardMedia
        // component="iframe"
        //  src="your-embedded-content-url"
        // className={classes.cardMedia}
        // title="Embedded Content"
        />
      </Box>

      {acceptanceReportTypography}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {reportFiles.length === 0 && (
            <>
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
                  severity='info'
                  sx={{ maxHeight: '150px', maxWidth: '100%' }}
                >
                  {'No reports found'}
                </Alert>
              </Snackbar>

              <Container maxWidth='x1' style={{ padding: '10px', alignContent: 'center' }}>
                {/* ... (existing Container, Paper, and div) */}
              </Container>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Button variant='contained' color='primary' onClick={redirectToHome}>
                  Return to Home
                </Button>
              </div>
            </>
          )}

          {reportFiles.length > 0 && (
            <>
              <Grid
                container
                spacing={2}
                style={{ width: '100%', paddingLeft: '45px', justifyContent: 'flex-start' }}
              >
                {reportFiles.map((file) => {
                  const parts = file.filename.split('_');
                  const failed = file.fail > 0;
                  const passed = file.pass > 0;

                  if (!file || !file.filename || file.filename.includes('.DS_Store')) {
                    return null;
                  }

                  if (parts.length < 2) {
                    return (
                      <Grid key={file.id} item xs={12}>
                        <Accordion>{/* ... (other JSX components) */}</Accordion>
                      </Grid>
                    );
                  }

                  const datePart = parts[0];
                  const batchName = parts.slice(1).join('_');

                  const date = datePart.substr(0, 10);
                  const time = datePart.substr(11, 8);

                  const formattedDate = `${date.substr(5, 2)}-${date.substr(8, 2)}-${date.substr(
                    0,
                    4,
                  )}`;
                  const formattedTime = `${time.substr(0, 2)}:${time.substr(3, 2)}:${time.substr(
                    6,
                    2,
                  )}`;

                  const formattedTimestamp = `${formattedDate} ${formattedTime}`;

                  const passedPercent = Math.round((file.pass / (file.pass + file.fail)) * 100);

                  return (
                    <Grid key={file.id} item xs={12}>
                      <Accordion
                        style={{
                          border: '1px solid #2196F3',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px 0 rgba(33, 150, 243, 0.2)',
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Grid container alignItems='center'>
                            {/* Date and Batch Name */}
                            <Grid item xs>
                              <Typography
                                className={classes.heading}
                                style={{ fontWeight: 'bold', marginRight: '9px' }}
                              >
                                {formattedTimestamp}
                                <span style={{ fontStyle: 'italic', marginLeft: '9px' }}>
                                  {batchName}
                                </span>
                                {file.contains_fuzzy && (
                                  <Chip
                                    label='Fuzzy Test'
                                    style={{
                                      marginLeft: '9px',
                                      backgroundColor: 'lightgreen',
                                      color: 'black',
                                    }}
                                  />
                                )}
                              </Typography>
                            </Grid>

                            <Grid
                              item
                              style={{
                                marginLeft: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginRight: '8px',
                                }}
                              >
                                {file.fail > 0 && (
                                  <div
                                    style={{
                                      position: 'relative',
                                      display: 'flex',
                                      alignItems: 'center',
                                      marginRight: '8px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        border: '1px solid red',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        overflow: 'hidden',
                                        marginLeft: '4px',
                                        position: 'relative',
                                      }}
                                    >
                                      <CircularProgress
                                        variant='determinate'
                                        size={30}
                                        thickness={8}
                                        value={Math.round(
                                          (file.fail / (file.pass + file.fail)) * 100,
                                        )}
                                        style={{
                                          color: 'rgba(255, 0, 0, 0.3)',
                                        }}
                                      />
                                      <span
                                        style={{
                                          position: 'absolute',
                                          top: '50%',
                                          left: '50%',
                                          transform: 'translate(-50%, -50%)',
                                          fontSize: '12px',
                                          color: 'red',
                                        }}
                                      >
                                        ❌
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {passed && (
                                  <div
                                    style={{
                                      position: 'relative',
                                      display: 'flex',
                                      alignItems: 'center',
                                      marginRight: '8px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        border: '1px solid lightgreen',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        overflow: 'hidden',
                                        marginLeft: '4px',
                                        position: 'relative',
                                      }}
                                    >
                                      <CircularProgress
                                        variant='determinate'
                                        size={30}
                                        thickness={8}
                                        value={passedPercent}
                                        style={{
                                          color: 'lightgreen',
                                        }}
                                      />
                                      <span
                                        style={{
                                          position: 'absolute',
                                          top: '50%',
                                          left: '50%',
                                          transform: 'translate(-50%, -50%)',
                                          fontSize: '12px',
                                          color: 'lightgreen',
                                        }}
                                      >
                                        ✅
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Grid>
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Table style={{ width: '30%' }} aria-label='simple table'>
                            <TableBody>
                              <TableRow style={{ borderBottomWidth: '2px' }}>
                                {/* <TableCell align="center"></TableCell>  */}
                                <TableCell style={{ fontWeight: 'bold', color: 'blue' }}>
                                  Drone Count
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'green' }}>
                                  Pass
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'red' }}>
                                  Fail
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                {/* <TableCell align="right"></TableCell>  */}
                                <TableCell>{file.drone_count}</TableCell>
                                <TableCell>{file.pass}</TableCell>
                                <TableCell>{file.fail}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                            <Link
                              style={{ cursor: 'pointer', fontSize: '18px', paddingRight: '15px' }}
                              onClick={() => handleButtonClick(file)}
                            >
                              Simulation Data
                            </Link>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );
}
