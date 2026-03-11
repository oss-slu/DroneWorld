import * as React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


export default function Camera (sensor) {
    const [camera, setCamera] = React.useState({
        Enabled: true,
        key:"Camera",
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
        ProjectionMode: "", 
        OrthoWidth: 5.12
    })

    const handleChangeSwitch = (val) => {
        setCamera(prevState => ({
                ...prevState,
                Enabled: val.target.checked
        }))
    }

    const closeModal = () => {
        sensor.closeModal(camera, sensor.name)
    }

    const handleChange = (val) => {
        setCamera(prevState => ({
            ...prevState,
            [val.target.id]: val.target.value
        }))
    }

    return (
        <div>
            <Box>
                <Typography variant="h6" component="h2">
                    {camera.key}
                </Typography>
                <Typography>
                    <Grid container spacing={2} direction="row">
                        <Grid item xs={3}>
                            <FormGroup>
                                <FormControlLabel disabled value={camera.Enabled} control={<Switch defaultChecked onChange={handleChangeSwitch} inputProps={{ 'aria-label': 'controlled' }} />} label="Enabled" />
                            </FormGroup>
                            </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" style={{paddingTop:'15px', marginTop:'15px'}}>
                        <Button variant="outlined" onClick={closeModal}>Ok</Button> &nbsp;&nbsp;&nbsp;
                    </Grid>
                </Typography>
            </Box>
        </div>
    )

} 
