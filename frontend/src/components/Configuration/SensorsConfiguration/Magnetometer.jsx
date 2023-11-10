import * as React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip'; 


const defaultMagnetometer = {
    NoiseSigma: 0.005,
    ScaleFactor: 1,
    NoiseBias: 0, 
    UpdateLatency: 0,
    StartupDelay: 0,
   
  };

export default function Magnetometer (sensor) {
    const [magnetometer, setMagnetometer]  = React.useState(sensor.magnetometerObj)

    const handleChangeSwitch = (val) => {
        setMagnetometer(prevState => ({
                ...prevState,
                Enabled: val.target.checked
        }))
    }

    React.useEffect(() => {
        if (sensor.updateJson) {
            sensor.updateJson(magnetometer, sensor.name);
        }
    }, [magnetometer])

    
    const closeModal = () => {
        sensor.closeModal(magnetometer, sensor.name)
    }

    const handleChange = (val) => {
        setMagnetometer(prevState => ({
            ...prevState,
            [val.target.id]: val.target.type === "number" ? parseInt(val.target.value, 10) : val.target.value
        }))
    }

    return(
        <div>
            <Box>
                <Typography variant="h6" component="h2">
                    {magnetometer.Key}
                </Typography>
                <Typography>
                    <Grid container spacing={2} direction="row">
                        <Grid item xs={3}>
                            <FormGroup>
                                <FormControlLabel disabled control={<Switch checked={magnetometer.Enabled} inputProps={{ 'aria-label': 'controlled' }} />} label="Enabled" />
                            </FormGroup>
                        </Grid>
                        {/* <Grid item xs={3}>
                            <TextField id="Key" onChange={handleChange} label="Name" variant="standard" value={magnetometer.Key}/>
                        </Grid> */}
                        {/* <Grid item xs={3}>
                            <TextField id="NoiseSigma" onChange={handleChange} label="NoiseSigma" variant="standard" value={magnetometer.NoiseSigma}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="ScaleFactor" onChange={handleChange} label="ScaleFactor" variant="standard" value={magnetometer.ScaleFactor}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="NoiseBias" onChange={handleChange} label="NoiseBias" variant="standard" value={magnetometer.NoiseBias}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="UpdateLatency" onChange={handleChange} label="UpdateLatency" variant="standard" value={magnetometer.UpdateLatency}/>
                        </Grid> */}
                        
                        
                        <Tooltip title="The frequency at which the compass should send readings to the flight controller.">
                        <Grid item xs={3}>
                            <TextField id="UpdateFrequency" onChange={handleChange} label="Update Frequency (Hz)" type="number" variant="standard" value={defaultMagnetometer.UpdateFrequency}/>
                        </Grid>
                        </Tooltip>
                        {/* <Grid item xs={3}>
                            <TextField id="StartupDelay" onChange={handleChange} label="StartupDelay" variant="standard" value={magnetometer.StartupDelay}/>
                        </Grid> */}
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" style={{paddingTop:'15px', marginTop:'15px'}}>
                        <Button variant="outlined" onClick={closeModal}>Ok</Button> &nbsp;&nbsp;&nbsp;
                    </Grid>
                </Typography>
            </Box>
        </div>
    )
}