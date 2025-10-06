import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#1e40af',
    padding: '2rem 0',
  },
  glassTile: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '32px',
    padding: '4rem',
    color: '#fff',
    textAlign: 'center',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    margin: '0 0.5rem',
    '&:hover': {
      filter: 'brightness(0.75)',
    },
  },
  fullWidthTile: {
    width: 'calc(100% - 1rem)',
    marginBottom: '2rem',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '32px',
    padding: '50px 60px',
    color: '#fff',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      filter: 'brightness(0.75)',
    },
  },
  tableTile: {
    width: 'calc(100% - 1rem)',
    marginBottom: '2rem',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '32px',
    padding: '50px 60px',
    color: '#fff',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      filter: 'brightness(0.75)',
    },
  },
  gradientTile: {
    width: 'calc(100% - 1rem)',
    marginBottom: '2rem',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3730a3 100%)',
    backdropFilter: 'none',
    border: 'none',
    borderRadius: '32px',
    padding: '6rem',
    color: '#fff',
    textAlign: 'center',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      filter: 'brightness(0.75)',
    },
  },
  gridContainer: {
    marginBottom: '2rem',
  },
  title: {
    color: '#fff',
    fontWeight: 700,
    marginBottom: '3rem',
    textAlign: 'center',
  },
}));

const commonStyles = {
  emoji: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  heading: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1rem',
    color: '#374151',
    lineHeight: 1.6,
    fontWeight: 'normal',
  },
  tableHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e40af',
  },
  tableDescription: {
    fontSize: '1rem',
    color: '#374151',
    fontWeight: 'light',
  },
};

const GridTile = ({ emoji, heading, description }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography sx={commonStyles.emoji}>{emoji}</Typography>
    <Typography variant='h5' component='h3' sx={commonStyles.heading}>
      {heading}
    </Typography>
    <Typography component='span' sx={commonStyles.description}>
      {description}
    </Typography>
  </Box>
);

GridTile.propTypes = {
  emoji: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

function AboutUs() {
  const classes = useStyles();

  return (
    <Box className={classes.pageContainer}>
      <Container maxWidth='lg'>
        <Paper className={classes.fullWidthTile} elevation={0}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='h3'
              component='h1'
              sx={{
                color: '#1e40af',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              About Drone World
            </Typography>
            <Typography
              component='span'
              sx={{
                fontSize: '1.1rem',
                color: '#374151',
                lineHeight: 1.6,
              }}
            >
              Revolutionizing sUAS testing through innovative simulation ecosystems and automated
              testing solutions
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.glassTile} elevation={0}>
              <GridTile
                emoji='🔬'
                heading='Revolutionary Testing'
                description='Drone World is revolutionizing sUAS (small Uncrewed Aerial Systems) testing. In the dynamic world of sUAS, safety and reliability are paramount. Traditional field testing across diverse environments is costly and challenging.'
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.glassTile} elevation={0}>
              <GridTile
                emoji='🌐'
                heading='Simulation Ecosystem'
                description='Drone World offers an innovative sUAV simulation ecosystem that generates high-fidelity, realistic environments mimicking real-world complexities like adverse weather and wireless interference. Our automated solution allows developers to specify constraints and generate tailored test environments.'
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.glassTile} elevation={0}>
              <GridTile
                emoji='📊'
                heading='Automated Analysis'
                description='The program monitors sUAV activities against predefined safety parameters and generates detailed acceptance test reports. This approach provides actionable insights for effective debugging and analysis, enhancing the safety, reliability, and efficiency of sUAS applications.'
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.glassTile} elevation={0}>
              <GridTile
                emoji='🛡️'
                heading='Safety & Reliability'
                description='Our comprehensive testing platform ensures your sUAS meets the highest safety standards through rigorous simulation of real-world scenarios, environmental challenges, and operational constraints before deployment in actual field conditions.'
              />
            </Paper>
          </Grid>
        </Grid>

        <Paper className={classes.tableTile} elevation={0}>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography sx={commonStyles.tableHeader}>Dr. Ankit Agrawal</Typography>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography sx={commonStyles.tableHeader}>OSS-SLU Team</Typography>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography sx={commonStyles.tableHeader}>MIT License</Typography>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography sx={commonStyles.tableHeader}>Since 2023</Typography>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography sx={commonStyles.tableDescription}>Project Client</Typography>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography sx={commonStyles.tableDescription}>Development Team</Typography>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography sx={commonStyles.tableDescription}>Open Source</Typography>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography sx={commonStyles.tableDescription}>Active Development</Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Paper>

        <Paper className={classes.gradientTile} elevation={0}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='h4'
              component='h2'
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
              }}
            >
              Advanced sUAS Testing Platform
            </Typography>
            <Typography
              component='span'
              sx={{
                fontSize: '1rem',
                color: '#fff',
                lineHeight: 1.6,
                fontWeight: 'normal',
              }}
            >
              DroneWorld, developed by Dr. Ankit Agrawal and the OSS-SLU team, is an advanced
              simulation platform for testing small unmanned aerial systems (sUAS). Our platform
              enables users to configure detailed test scenarios by specifying environmental
              conditions, sUAS capabilities, and mission objective. By generating realistic 3D
              simulation environments and monitoring data for safety compliance, we produce
              comprehensive test reports that help developers refine their systems and iterate more
              rapidly on complex missions.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AboutUs;
