import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function IMU(sensor) {
  const [imu, setImu] = React.useState(sensor.imuObj || {});

  React.useEffect(() => {
    sensor.updateJson(imu, sensor.name);
  }, [imu]);

  const closeModal = () => {
    // sends local state to the parent.
    // fixed async state issue in SensorConfiguration.jsx's handleClose function.
    sensor.closeModal(imu, sensor.name);
  };

  const handleChangeSwitch = (val) => {
    setImu((prevState) => ({
      ...prevState,
      Enabled: val.target.checked,
    }));
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    const parsedValue = event.target.type === 'number' ? parseFloat(value) : value;

    setImu((prevImu) => ({
      ...prevImu,
      [id]: parsedValue,
    }));
  };

  const handleReset = () => {
    setImu(sensor.imuObj);
  };

  return (
    <div>
      <Typography variant='h6' component='h2' style={{ marginBottom: '15px' }}>
        {imu.Key || 'IMU'}
      </Typography>
      <Box>
        <Grid container spacing={2} direction='row'>
          <Grid item xs={3}>
            <FormGroup>
              <FormControlLabel
                disabled
                control={
                  <Switch checked={imu.Enabled} inputProps={{ 'aria-label': 'controlled' }} />
                }
                label='Enabled'
              />
            </FormGroup>
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: '10px' }}>
          <Grid item xs={4}>
            <TextField
              id='AngularRandomWalk'
              onChange={handleChange}
              label='Angular Random Walk'
              type='number'
              InputProps={{
                inputProps: { min: 0, step: 0.1 },
              }}
              variant='standard'
              value={imu.AngularRandomWalk}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id='GyroBiasStabilityTau'
              onChange={handleChange}
              label='Gyro Bias Stability Tau'
              type='number'
              InputProps={{
                inputProps: { min: 0, step: 1 },
              }}
              variant='standard'
              value={imu.GyroBiasStabilityTau}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id='GyroBiasStability'
              onChange={handleChange}
              label='Gyro Bias Stability'
              type='number'
              InputProps={{
                inputProps: { min: 0, step: 0.1 },
              }}
              variant='standard'
              value={imu.GyroBiasStability}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id='VelocityRandomWalk'
              onChange={handleChange}
              label='Velocity Random Walk'
              type='number'
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
              }}
              variant='standard'
              value={imu.VelocityRandomWalk}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id='AccelBiasStabilityTau'
              onChange={handleChange}
              label='Accel Bias Stability Tau'
              type='number'
              InputProps={{
                inputProps: { min: 0, step: 1 },
              }}
              variant='standard'
              value={imu.AccelBiasStabilityTau}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id='AccelBiasStability'
              onChange={handleChange}
              label='Accel Bias Stability'
              type='number'
              InputProps={{
                inputProps: { min: 0, step: 1 },
              }}
              variant='standard'
              value={imu.AccelBiasStability}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          style={{ paddingTop: '15px', marginTop: '15px' }}
        >
          <Grid item xs={3}>
            <Button onClick={handleReset} style={{ paddingLeft: '25px', margin: '5px' }}>
              Reset to Default
            </Button>
          </Grid>
          <Grid item xs={9}>
            <Button variant='outlined' onClick={closeModal} style={{ float: 'right' }}>
              Ok
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
