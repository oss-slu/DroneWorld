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
  const [imu, setImu] = React.useState({
    SensorType: 2,
    Enabled: true,
    // AngularRandomWalk: 0.3,
    // GyroBiasStabilityTau: 500,
    // GyroBiasStability: 4.6,
    // VelocityRandomWalk: 0.24,
    // AccelBiasStabilityTau: 800,
    // AccelBiasStability: 36,
    Key: 'IMU',
  });

  const closeModal = () => {
    sensor.closeModal(imu, sensor.name);
  };

  const handleChangeSwitch = (val) => {
    setImu((prevState) => ({
      ...prevState,
      Enabled: val.target.checked,
    }));
  };

  const handleChange = (val) => {
    setImu((prevState) => ({
      ...prevState,
      [val.target.id]: val.target.value,
    }));
  };

  return (
    <div>
      <Box>
        <Typography variant='h6' component='h2'>
          {imu.Key}
        </Typography>
        <Typography>
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
            <Grid item xs={3}>
              <TextField
                id='Key'
                onChange={handleChange}
                label='Name'
                variant='standard'
                value={imu.Key}
              />
            </Grid>
            {/* <Grid item xs={3}>
                            <TextField id="AngularRandomWalk" onChange={handleChange} label="AngularRandomWalk" variant="standard" value={imu.AngularRandomWalk}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="GyroBiasStabilityTau" onChange={handleChange} label="GyroBiasStabilityTau" variant="standard" value={imu.GyroBiasStabilityTau}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="GyroBiasStability" onChange={handleChange} label="GyroBiasStability" variant="standard" value={imu.GyroBiasStability}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="VelocityRandomWalk" onChange={handleChange} label="VelocityRandomWalk" variant="standard" value={imu.VelocityRandomWalk} />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="AccelBiasStabilityTau" onChange={handleChange} label="AccelBiasStabilityTau" variant="standard" value={imu.AccelBiasStabilityTau} />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="AccelBiasStability" onChange={handleChange} label="AccelBiasStability" variant="standard" value={imu.AccelBiasStability}/>
                        </Grid> */}
          </Grid>
          <Grid
            container
            direction='row'
            justifyContent='flex-end'
            alignItems='center'
            style={{ paddingTop: '15px', marginTop: '15px' }}
          >
            <Button variant='outlined' onClick={closeModal}>
              Ok
            </Button>{' '}
            &nbsp;&nbsp;&nbsp;
          </Grid>
        </Typography>
      </Box>
    </div>
  );
}
