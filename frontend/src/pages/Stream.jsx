import React from 'react';
import { Alert, Box, Chip, Container, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LiveTvIcon from '@mui/icons-material/LiveTv';

const useStyles = makeStyles(() => ({
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)',
    padding: '2.5rem 1.25rem 4rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heading: {
    color: '#0f172a',
    fontWeight: 800,
  },
  subheading: {
    color: '#475569',
    lineHeight: 1.6,
  },
  theatreFrame: {
    width: '100%',
    minHeight: 540,
    borderRadius: 24,
    border: '1px solid #dbeafe',
    background: 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 900px)': {
      minHeight: 390,
    },
    '@media (max-width: 600px)': {
      minHeight: 280,
      borderRadius: 18,
    },
  },
  scanLines: {
    position: 'absolute',
    inset: 0,
    background:
      'repeating-linear-gradient(0deg, rgba(148, 163, 184, 0.12) 0px, rgba(148, 163, 184, 0.12) 1px, transparent 1px, transparent 6px)',
    pointerEvents: 'none',
  },
  placeholderCard: {
    width: 'min(90%, 820px)',
    borderRadius: 18,
    background: '#ffffff',
    border: '1px solid #dbeafe',
    padding: '2.5rem 1.75rem',
    textAlign: 'center',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
    zIndex: 2,
    '@media (max-width: 600px)': {
      padding: '1.5rem 1rem',
    },
  },
  icon: {
    fontSize: '3rem',
    color: '#1d4ed8',
    marginBottom: '0.8rem',
  },
  placeholderTitle: {
    color: '#0f172a',
    fontWeight: 700,
    marginBottom: '0.75rem',
  },
  placeholderText: {
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: '1.25rem',
  },
}));

function Stream() {
  const classes = useStyles();

  return (
    <Box className={classes.page}>
      <Container maxWidth='lg'>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant='h4' component='h1' className={classes.heading}>
            Stream
          </Typography>
          <Typography className={classes.subheading}>
            View live Pixel Streaming output for your simulation runs. This player area will switch
            from offline placeholder to live feed when the stream service is connected.
          </Typography>
        </Stack>

        <Box className={classes.theatreFrame}>
          <Box className={classes.scanLines} />
          <Box className={classes.placeholderCard}>
            <LiveTvIcon className={classes.icon} />
            <Typography variant='h5' component='h2' className={classes.placeholderTitle}>
              Stream Offline
            </Typography>
            <Typography className={classes.placeholderText}>
              Pixel Streaming is currently unavailable. Start the simulator and connect the stream
              backend to activate this player.
            </Typography>
            <Stack direction='row' spacing={1} justifyContent='center' sx={{ mb: 2 }}>
              <Chip label='Pixel Streaming' color='primary' variant='outlined' size='small' />
              <Chip label='Status: Offline' color='warning' variant='outlined' size='small' />
            </Stack>
            <Alert severity='info' variant='outlined' sx={{ textAlign: 'left' }}>
              When online, this area will render the simulator video stream in this same frame.
            </Alert>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Stream;
