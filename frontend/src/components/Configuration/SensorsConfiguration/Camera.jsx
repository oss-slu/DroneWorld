import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';

export default function Camera(sensor) {
  const [camera, setCamera] = React.useState({
    Enabled: true,
    key: 'Camera',
    ImageType: 0,
    Width: 256,
    Height: 144,
    FOV_Degrees: 90,
    AutoExposureSpeed: 100,
    AutoExposureBias: 0,
    AutoExposureMaxBrightness: 0.64,
    AutoExposureMinBrightness: 0.03,
    MotionBlurAmount: 0,
    TargetGamma: 1.0,
    ProjectionMode: '',
    OrthoWidth: 5.12,
  });

  const handleChangeSwitch = (val) => {
    setCamera((prevState) => ({
      ...prevState,
      Enabled: val.target.checked,
    }));
  };

  const closeModal = () => {
    sensor.closeModal(camera, sensor.name);
  };

  const handleChange = (val) => {
    setCamera((prevState) => ({
      ...prevState,
      [val.target.id]: val.target.value,
    }));
  };

  return (
    <div>
      <Box>
        <Typography variant='h6' component='h2'>
          {camera.key}
        </Typography>
        <Typography>
          <Grid container spacing={2} direction='row'>
            <Grid item xs={3}>
              <FormGroup>
                <FormControlLabel
                  disabled
                  value={camera.Enabled}
                  control={
                    <Switch
                      defaultChecked
                      onChange={handleChangeSwitch}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label='Enabled'
                />
              </FormGroup>
            </Grid>
            {/* <Grid item xs={3}>
                            <TextField id="key" onChange={handleChange} label="Name" variant="standard" value={camera.key}/>
                        </Grid> */}
            {/* <Grid item xs={3}>
                            <TextField id="ImageType" onChange={handleChange} label="ImageType" variant="standard" value={camera.ImageType}/>
                        </Grid> */}
            {/* <Grid item xs={3}>
                        <Tooltip title="Specify the desired resolution of image width in pixels" placement="top">
                                
                        <TextField id="Width" onChange={handleChange} label="Image Width (Pixels)" variant="standard" value={camera.Width}/>         
                             </Tooltip>
                        </Grid>
                        <Grid item xs={3}>
                            <Tooltip title="Specify the desired resolution of image height in pixels" placement="top">
                                <TextField id="Height" onChange={handleChange} label="Image Height (Pixels)" variant="standard" value={camera.Height}/>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={3}>
                        <Tooltip title="Please enter the desired field of view in degrees. A 90-degree field of view (FOV) means that the camera can capture an image that covers an angle of 90 degrees horizontally or vertically." placement="top">
                        
                            <TextField id="FOV_Degrees" onChange={handleChange} label="Field-of-View (Degrees)" variant="standard" value={camera.FOV_Degrees}/>
                        </Tooltip>
                        </Grid> */}
            {/* <Grid item xs={3}>
                            <TextField id="AutoExposureSpeed" onChange={handleChange} label="AutoExposureSpeed" variant="standard" value={camera.AutoExposureSpeed}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="AutoExposureBias" onChange={handleChange} label="AutoExposureBias" variant="standard" value={camera.AutoExposureBias}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="AutoExposureMaxBrightness" onChange={handleChange} label="AutoExposureMaxBrightness" variant="standard" value={camera.AutoExposureMaxBrightness}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="AutoExposureMinBrightness" onChange={handleChange} label="AutoExposureMinBrightness" variant="standard" value={camera.AutoExposureMinBrightness}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="MotionBlurAmount" onChange={handleChange} label="MotionBlurAmount" variant="standard" value={camera.MotionBlurAmount}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="TargetGamma" onChange={handleChange} label="TargetGamma" variant="standard" value={camera.TargetGamma}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="ProjectionMode" onChange={handleChange} label="ProjectionMode" variant="standard" value={camera.ProjectionMode}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="OrthoWidth" onChange={handleChange} label="OrthoWidth" variant="standard" value={camera.OrthoWidth}/>
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
