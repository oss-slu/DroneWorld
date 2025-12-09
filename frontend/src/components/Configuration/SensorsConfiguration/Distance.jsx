import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function Distance(sensor) {
  const [distance, setDistance] = React.useState({
    SensorType: 5,
    Enabled: true,
    MinDistance: 0.2,
    MaxDistance: 40,
    X: 0,
    Y: 0,
    Z: -1,
    Yaw: 0,
    Pitch: 0,
    Roll: 0,
    // DrawDebugPoints: false,
    Key: 'Distance',
  });

  const closeModal = () => {
    sensor.closeModal(distance, sensor.name);
  };

  const handleChange = (val) => {
    setDistance((prevState) => ({
      ...prevState,
      [val.target.id]:
        val.target.type === 'number' ? parseInt(val.target.value, 10) : val.target.value,
    }));
  };

  return (
    <div>
      <Box>
        <Typography variant='h6' component='h2'>
          {distance.Key}
        </Typography>
        <Typography>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={3}>
              <FormGroup>
                <FormControlLabel
                  disabled
                  control={
                    <Switch
                      checked={distance.Enabled}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
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
                value={distance.Key}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='MinDistance'
                onChange={handleChange}
                label='Min Distance'
                type='number'
                variant='standard'
                value={distance.MinDistance}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='MaxDistance'
                onChange={handleChange}
                label='Max Distance'
                type='number'
                variant='standard'
                value={distance.MaxDistance}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='X'
                onChange={handleChange}
                label='X'
                variant='standard'
                type='number'
                value={distance.X}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Y'
                onChange={handleChange}
                label='Y'
                variant='standard'
                type='number'
                value={distance.Y}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Z'
                onChange={handleChange}
                label='Z'
                variant='standard'
                type='number'
                value={distance.Z}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Yaw'
                onChange={handleChange}
                label='Yaw'
                variant='standard'
                type='number'
                value={distance.Yaw}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Pitch'
                onChange={handleChange}
                label='Pitch'
                variant='standard'
                type='number'
                value={distance.Pitch}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Roll'
                onChange={handleChange}
                label='Roll'
                variant='standard'
                value={distance.Roll}
              />
            </Grid>
            {/* <Grid item xs={3}>
                            <TextField id="DrawDebugPoints"  onChange={handleChange} label="DrawDebugPoints" variant="standard" value={distance.DrawDebugPoints} />
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
