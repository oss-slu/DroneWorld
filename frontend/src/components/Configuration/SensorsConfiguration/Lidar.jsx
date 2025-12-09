import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Size switch demo' } };
export default function Lidar(sensor) {
  const [lidar, setLidar] = React.useState({
    SensorType: 6,
    Enabled: false,
    NumberOfChannels: 16,
    RotationsPerSecond: 10,
    PointsPerSecond: 100000,
    X: 0,
    Y: 0,
    Z: -1,
    Roll: 0,
    Pitch: 0,
    Yaw: 0,
    VerticalFOVUpper: -15,
    VerticalFOVLower: -25,
    HorizontalFOVStart: -20,
    HorizontalFOVEnd: 20,
    // DrawDebugPoints: true,
    // DataFrame: "SensorLocalFrame",
    Key: 'Lidar',
  });

  const closeModal = () => {
    console.log('json---', JSON.stringify(lidar));
    sensor.closeModal(lidar, sensor.name);
  };

  const handleChangeSwitch = (val) => {
    setLidar((prevState) => ({
      ...prevState,
      Enabled: val.target.checked,
    }));
  };

  const handleChange = (val) => {
    setLidar((prevState) => ({
      ...prevState,
      [val.target.id]: val.target.value,
    }));
  };

  return (
    <div>
      <Box>
        <Typography variant='h6' component='h2'>
          {lidar.Key}
        </Typography>
        <Typography>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={3}>
              <FormGroup>
                <FormControlLabel
                  value={lidar.Enabled}
                  id='Enabled'
                  control={
                    <Switch
                      onChange={handleChangeSwitch}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label={`${lidar.Enabled ? 'Enabled' : 'Disabled'}`}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label='Name'
                id='Key'
                variant='standard'
                value={lidar.Key}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='NumberOfChannels'
                onChange={handleChange}
                label='Number Of Channels'
                variant='standard'
                value={lidar.NumberOfChannels}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='RotationsPerSecond'
                onChange={handleChange}
                label='Rotations/Second'
                variant='standard'
                value={lidar.RotationsPerSecond}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='PointsPerSecond'
                onChange={handleChange}
                label='Points/Second'
                variant='standard'
                value={lidar.PointsPerSecond}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='X'
                onChange={handleChange}
                label='X'
                variant='standard'
                value={lidar.X}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Y'
                onChange={handleChange}
                label='Y'
                variant='standard'
                value={lidar.Y}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Z'
                onChange={handleChange}
                label='Z'
                variant='standard'
                value={lidar.Z}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Roll'
                onChange={handleChange}
                label='Roll'
                variant='standard'
                value={lidar.Roll}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Pitch'
                onChange={handleChange}
                label='Pitch'
                variant='standard'
                value={lidar.Pitch}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='Yaw'
                onChange={handleChange}
                label='Yaw'
                variant='standard'
                value={lidar.Yaw}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='VerticalFOVUpper'
                onChange={handleChange}
                label='Vertical FOV Upper'
                variant='standard'
                value={lidar.VerticalFOVUpper}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='VerticalFOVLower'
                onChange={handleChange}
                label='Vertical FOV Lower'
                variant='standard'
                value={lidar.VerticalFOVLower}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='HorizontalFOVStart'
                onChange={handleChange}
                label='Horizontal FOV Start'
                variant='standard'
                value={lidar.HorizontalFOVStart}
                disabled={!lidar.Enabled}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id='HorizontalFOVEnd'
                onChange={handleChange}
                label='Horizontal FOV End'
                variant='standard'
                value={lidar.HorizontalFOVEnd}
                disabled={!lidar.Enabled}
              />
            </Grid>
            {/* <Grid item xs={3}>
                            <TextField id="DrawDebugPoints"  onChange={handleChange} label="DrawDebugPoints" variant="standard" value={lidar.DrawDebugPoints} disabled={!lidar.Enabled}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="DataFrame"  onChange={handleChange} label="DataFrame" variant="standard" value={lidar.DataFrame} disabled={!lidar.Enabled}/>
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
