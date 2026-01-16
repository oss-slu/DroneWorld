import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import ReportDashboard from './components/ReportDashboard';
import Loading from './components/Loading';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LandscapeIcon from '@mui/icons-material/Landscape';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

const useStyles = makeStyles((theme) => ({
  landingPage: {
    fontFamily: 'Roboto, sans-serif',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    //backgroundColor: '#0000CD',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
  },
  siteTitle: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
  },
  mainContent: {
    // padding: '1rem',
    // marginTop: '3rem',
  },
  buttonContainer: {
    position: 'absolute',
    top: '6rem',
    right: '2rem',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
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
    cursor: 'pointer',
  },
  acceptanceReportLink: {
    textDecoration: 'underline',
    color: '#800080',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '1rem',
  },
  reportDashboardTitle: {
    textDecoration: 'underline',
    color: '#800080',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    textAlign: 'center',
  },
  createSimulationLink: {
    textDecoration: 'none',
    display: 'block',
    width: 'fit-content',
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
  padding: '4',
};

export default function LandingPage() {
  const classes = useStyles();
  const [filesPresent, setFilesPresent] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/list-reports`, { method: 'GET' });
        const data = await response.json();
        const batchFiles = data.reports.filter((file) => file.filename.includes('Batch'));
        setFilesPresent(batchFiles.length > 0);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsloading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccordionToggle = () => {
    console.log('Accordion toggled');
  };

  return (
    <div className={classes.landingPage}>
      <nav className={classes.nav}>
        <Link to='/' className={classes.siteTitle}></Link>
        <ul className={classes.navList}>
          <li className={classes.navListItem}>
            <Box component='span' onClick={handleAccordionToggle}></Box>

            <Box component='span'>
              <Button
                className={classes.aboutLink}
                onClick={() => setOpen(true)}
                style={{ color: '#fff' }}
              ></Button>
            </Box>
          </li>
        </ul>
      </nav>

      <Box
        component="section"
        sx={{
          width: '100%',
          bgcolor: 'transparent',
          background:
            'linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%)', // blue -> darker blue
          color: '#fff',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 28, sm: 36, md: 44 },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Advanced Drone
            <br />
            Simulation Platform
          </Typography>

          <Typography
            variant="h6"
            sx={{
              maxWidth: 760,
              mx: 'auto',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 400,
              mb: 4,
            }}
          >
            Create realistic 3D environments, test multi-drone scenarios, and analyze
            performance with our comprehensive drone simulation platform.
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ flexWrap: 'wrap', rowGap: 2 }}
          >
            <Button
              component={Link}
              to="/home"
              variant="contained"
              size="large"
              startIcon={<PlayCircleOutlineIcon />}
              sx={{
                bgcolor: '#1e3a8a',
                '&:hover': { bgcolor: '#172554' },
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                borderRadius: 2,
              }}
            >
              Get Started
            </Button>

            <Button
              component={Link}
              to="" // change later leave blank for now
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                borderRadius: 2,
                bgcolor: 'transparent',
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      
      
      <Box component="section" sx={{ bgcolor: '#fff', py: { xs: 8, md: 10 } }}>
          <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Typography
              component="h2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: { xs: 26, md: 34 },
                mb: 1.5,
              }}
            >
              Powerful Simulation Features
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#475569',
                maxWidth: 820,
                mx: 'auto',
                mb: 6,
              }}
            >
              Everything you need to develop, test, and optimize drone operations in a
              safe, virtual environment.
            </Typography>

            <Grid container spacing={3}>
              {/* Card 1 */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: '#ede9fe', // light purple
                      }}
                    >
                      <LandscapeIcon sx={{ color: '#7c3aed' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                        3D Environment Generation
                      </Typography>
                      <Typography sx={{ color: '#475569' }}>
                        Create realistic terrains, cities, and landscapes for
                        comprehensive drone testing scenarios.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Card 2 */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: '#dcfce7', // light green
                      }}
                    >
                      <ShowChartIcon sx={{ color: '#16a34a' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                        Real-time Simulation
                      </Typography>
                      <Typography sx={{ color: '#475569' }}>
                        Monitor and control multiple drones simultaneously with live
                        data streaming and analytics.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Card 3 */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: '#f3e8ff', // purple-ish
                      }}
                    >
                      <GroupWorkIcon sx={{ color: '#8b5cf6' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                        Multi-drone Coordination
                      </Typography>
                      <Typography sx={{ color: '#475569' }}>
                        Test swarm intelligence and formation flight patterns with
                        advanced coordination algorithms.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Card 4 */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: '#ffedd5', // light orange
                      }}
                    >
                      <InsertChartOutlinedIcon sx={{ color: '#f97316' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                        Data Analytics
                      </Typography>
                      <Typography sx={{ color: '#475569' }}>
                        Comprehensive reporting and analysis tools to evaluate drone
                        performance and mission success.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
                    
        <Box
          component="section"
          sx={{ width: '80%', bgcolor: '#f8fafc', py: { xs: 6, md: 8 }, borderTop: '1px solid #e5e7eb' }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: '#0f172a',
                    fontSize: { xs: 22, md: 28 },
                    mb: 0.5,
                  }}
                >
                  Ready to start simulating?
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: '#1d4ed8', // blue emphasis
                    fontSize: { xs: 22, md: 28 },
                  }}
                >
                  Create your first test scenario today.
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                  <Button
                    component={Link}
                    to="/home"
                    variant="contained"
                    sx={{
                      bgcolor: '#1e3a8a',
                      '&:hover': { bgcolor: '#172554' },
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="https://oss-slu.github.io/projects/droneworld/about" // update if your docs route differs
                    variant="outlined"
                    sx={{
                      borderColor: '#cbd5e1',
                      color: '#172554',
                      '&:hover': { borderColor: '#94a3b8', backgroundColor: '#ffffff' },
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      bgcolor: '#fff',
                    }}
                  >
                    View Documentation
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      

      {isLoading ? (
        <Loading />
      ) : (
        <div className={classes.mainContent}>
          {filesPresent && (
            <div onClick={handleAccordionToggle}>
              <h2 className={classes.reportDashboardTitle}>
                <Link to='/report-dashboard' className={classes.reportDashboardTitle}>
                  <div style={{ textAlign: 'center' }}>{/* Content here */}</div>
                </Link>
              </h2>
              <ReportDashboard />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
