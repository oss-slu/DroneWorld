import React, { Fragment, useEffect, useState } from 'react';
import { Button, Typography, Grid, Box, Divider, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NoEntryIcon from '@mui/icons-material/Block';
import Icon from '@mdi/react';
import { mdiQuadcopter, mdiWeatherWindy } from '@mdi/js';
import { callAPI } from '../../utils/ApiUtils';
import { StyledBackground, ConfigsBox, ProfilesDivider } from '../../css/commonStyles';
import { BootstrapTooltip } from '../../css/muiStyles';
import { StyledLink, StyledButton } from '../../css/commonStyles';
import { numberStyle, labelStyle, iconStyle } from '../../css/simConfigListStyles';
import { isTokenExpired } from '../../utils/authUtils';
import useSessionManager from '../../hooks/useSessionManager';

function SimulationConfigs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleSessionExpiration } = useSessionManager();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);

  const fetchConfigs = async (page = 1, resetList = false) => {
    if (isTokenExpired()) {
      handleSessionExpiration(location, null);
      return;
    }

    setLoading(true);

    if (resetList) {
      setConfigs([]);
    }

    try {
      const endPoint = `api/sade_task/pagination/${page}`;
      const data = await callAPI(endPoint, 'GET', null, 'JSON');
      if (data.length > 0) {
        setConfigs((prevConfigs) => [...prevConfigs, ...data]);
        fetchConfigs(page + 1);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch configs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs(1, true);
  }, []);

  const toggleDescription = (id) => {
    setSelectedConfig(selectedConfig === id ? null : id);
  };

  const handleDelete = async (configId) => {
    try {
      if (isTokenExpired()) {
        handleSessionExpiration(location, null);
        return;
      }

      const endPoint = `api/sade_task/${configId}`;
      await callAPI(endPoint, 'DELETE', null, 'JSON');
      setConfigs(configs.filter((config) => config.id !== configId));
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  };

  const handleStop = async (configId) => {
    try {
      if (isTokenExpired()) {
        handleSessionExpiration(location, null);
        return;
      }

      const endPoint = `api/sade_task/terminate/${configId}`;
      callAPI(endPoint, 'POST', null, 'JSON')
        .then((data) => {
          fetchConfigs(1, true);
        })
        .catch((error) => {
          console.error('Error Stopping config names:', error);
        });
      // setConfigs(configs.filter((config) => config.id !== configId));
    } catch (error) {
      console.error('Error Stopping config:', error);
    }
  };

  const handleSelect = async (config) => {
    try {
      navigate('/simulation', { state: { configData: config } });
    } catch (error) {
      console.error('Error Navigating to /simulation page:', error);
    }
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress color='primary' />
        <Typography sx={{ ml: 2 }}>Loading, please wait...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={StyledBackground}>
      <Box sx={ConfigsBox}>
        {configs.length > 0 ? (
          <Fragment>
            <Typography variant='h3' sx={{ color: 'white', fontWeight: 'bold' }}>
              SELECT PROFILE
            </Typography>
            <Divider sx={ProfilesDivider} />
          </Fragment>
        ) : (
          <Box sx={{ mt: '35vh' }}>
            <Typography variant='h3' sx={{ color: 'white', fontWeight: 'bold' }}>
              No Previous Configurations Available
            </Typography>
            <StyledLink to='/simulation'>
              <StyledButton variant='contained' sx={{ mt: 5 }}>
                CREATE NEW SIM CONFIg
              </StyledButton>
            </StyledLink>
          </Box>
        )}

        <Grid container spacing={4} sx={{ mt: 2, mb: 2, pl: 15, pr: 10 }}>
          {configs.map((config) => (
            <React.Fragment key={`fragment-${config.id}`}>
              <Grid container item xs={8} key={config.id}>
                <Grid container direction='column'>
                  <Grid container item sx={{ backgroundColor: '#cc7e09', color: 'white' }}>
                    <Grid item xs={8} sx={{ p: 1 }}>
                      <BootstrapTooltip title='Click to see more about this Config'>
                        <Typography
                          style={{
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                          }}
                          onClick={() => toggleDescription(config.id)}
                        >
                          <img
                            src='/images/drone-bottom-view.png'
                            width='8%'
                            height='8%'
                            style={{ verticalAlign: 'middle', margin: 'auto 10px' }}
                          ></img>
                          {config.name}
                        </Typography>
                      </BootstrapTooltip>
                    </Grid>

                    <Grid item xs={4} sx={{ p: 1, textAlign: 'right' }}>
                      <Typography sx={{ verticalAlign: 'middle', fontWeight: 'bold' }}>
                        {config.date_created}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid item sx={{ bgcolor: '#321f0199', color: 'white', pl: 2, pr: 2, pt: 1 }}>
                    {selectedConfig === config.id && (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                          <Box sx={{ ...labelStyle }}>
                            <Box sx={{ display: 'flex' }}>
                              <Icon
                                path={mdiWeatherWindy}
                                size='2rem'
                                color='white'
                                sx={{ mr: 1 }}
                              />
                              <Typography variant='subtitle1' sx={{ color: 'white', ml: 0.8 }}>
                                Wind Sources
                              </Typography>
                            </Box>
                            <Typography sx={{ ...numberStyle, fontSize: '1.6rem' }}>
                              {config.wind_source_count}
                            </Typography>
                          </Box>
                          <Box sx={{ ...labelStyle }}>
                            <Box sx={{ display: 'flex' }}>
                              <NoEntryIcon sx={{ ...iconStyle }} />
                              <Typography variant='subtitle1' sx={{ color: 'white', ml: 0.8 }}>
                                Sade Zones
                              </Typography>
                            </Box>
                            <Typography sx={{ ...numberStyle, fontSize: '1.6rem' }}>
                              {config.sade_zone_count}
                            </Typography>
                          </Box>
                          <Box sx={{ ...labelStyle }}>
                            <Box sx={{ display: 'flex' }}>
                              <Icon path={mdiQuadcopter} size='1.6rem' />
                              <Typography variant='subtitle1' sx={{ color: 'white', ml: 0.8 }}>
                                Drones
                              </Typography>
                            </Box>
                            <Typography sx={{ ...numberStyle, fontSize: '1.6rem' }}>
                              {config.drone_count}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 10 }}>
                            <Typography sx={{ ...labelStyle }}>Origin Lat:</Typography>
                            <Typography sx={{ ...numberStyle, color: '#4fc3f7' }}>
                              {config.origin_latitude}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ ...labelStyle }}>Origin Long:</Typography>
                            <Typography sx={{ ...numberStyle, color: '#4fc3f7' }}>
                              {config.origin_longitude}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                          <Typography sx={{ ...labelStyle }}>User Description:</Typography>
                          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                            {config.description || 'NA'}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={1}>
                <BootstrapTooltip title='Reuse this Config'>
                  <Box sx={{ backgroundColor: '#4fc3f7', borderRadius: '10%', pt: 0.5, pb: 0.5 }}>
                    <IconButton
                      aria-label='select'
                      onClick={() => handleSelect(config)}
                      sx={{ color: 'white' }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Box>
                </BootstrapTooltip>
              </Grid>
              <Grid item xs={1}>
                <BootstrapTooltip title='Permanently delete this config'>
                  <Box sx={{ backgroundColor: '#C62828', borderRadius: '10%', pt: 0.5, pb: 0.5 }}>
                    <IconButton
                      aria-label='delete'
                      onClick={() => handleDelete(config.id)}
                      sx={{ color: 'white' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </BootstrapTooltip>
              </Grid>
              <Grid item xs={1}>
                <BootstrapTooltip title='Stop the running config'>
                  <Box sx={{ backgroundColor: '#C62828', borderRadius: '10%', pt: 0.5, pb: 0.5 }}>
                    <IconButton
                      aria-label='cancel'
                      onClick={() => handleStop(config.id)}
                      sx={{ color: 'white' }}
                      disabled={!config.task_running}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </BootstrapTooltip>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default SimulationConfigs;
