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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; 


export default function Magnetometer (sensor) {
    const [magnetometer, setMagnetometer]  = React.useState(sensor.magnetometerObj || {})

    //const handleChangeSwitch = (val) => {
     //   setMagnetometer(prevState => ({
         //       ...prevState,
       //         Enabled: val.target.checked
     //   }))
   // }

    React.useEffect(() => {
        sensor.updateJson(magnetometer, sensor.name)
    }, [magnetometer])

    
    const closeModal = () => {
        sensor.closeModal(magnetometer, sensor.name)
    }

    const handleChange = (event) => {
        const { id, value } = event.target;
        const parsedValue = event.target.type === 'number' ? parseFloat(value) : value;
        setMagnetometer((prevMagnetometer) => ({
          ...prevMagnetometer,
          [id]: parsedValue,
        }));
      }; 

    const handleReset = () => {
        setMagnetometer(sensor.magnetometerObj);
      };
      const [snackBarState, setSnackBarState] = React.useState({
        open: true,
    });

    const handleSnackBarVisibility = (val) => {
        setSnackBarState(prevState => ({
            ...prevState,
            open: val
        }))
    }

    return(
        <div>
            {/* <Snackbar open={snackBarState.open} 
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }} 
        autoHideDuration={6000} onClose={e => handleSnackBarVisibility(false)}>
        <Alert onClose={e => handleSnackBarVisibility(false)} severity="info" sx={{ width: '100%' }}>
             {"Magnetometer Changes is under Developement !"}
        </Alert>
    </Snackbar> */}
            <Box>
                <Typography variant="h6" component="h2">
                    {magnetometer.Key || ""}
                </Typography> 
                <Typography>
                    <Grid container spacing={2} direction="row">
                        <Grid item xs={3}>
                            <FormGroup>
                                <FormControlLabel disabled control={<Switch checked={magnetometer.Enabled} inputProps={{ 'aria-label': 'controlled' }} />} label="Enabled" />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={3}>
                            <Tooltip title="The frequency at which the compass should send readings to the flight controller."> 
                                <TextField id="UpdateFrequency" onChange={handleChange} label="Update Frequency (Hz)" type="number" variant="standard" value={magnetometer.UpdateFrequency}/>
                            </Tooltip>   
                        </Grid>
                        <Grid item xs={3}>  
                            <TextField 
                                id="NoiseSigma" 
                                label="Noise Sigma" 
                                type="number" 
                                InputProps={{ 
                                    inputProps: { min: 0, max: Infinity, step: 0.001 },  
                                
                                }} 
                                value={magnetometer.NoiseSigma} 
                                onChange={handleChange} 
                                variant="standard" 
                                /> 
                        </Grid>     
                        <Grid item xs={3}>   
                            <TextField  
                                id="NoiseBias"  
                                label="Noise Bias"  
                                type="number"  
                                InputProps={{ 
                                    inputProps: { min: 0, max: Infinity},  
                                
                                }} 
                                value={magnetometer.NoiseBias} 
                                onChange={handleChange} 
                                variant="standard" 
                                />
                        </Grid> 
                        <Grid item xs={3}>
                            <TextField    
                            id="UpdateLatency"   
                            label="Update Latency (s)"   
                            type="number"   
                            InputProps={{ inputProps: {min: 0, max: Infinity } }}   
                                value={magnetometer.UpdateLatency}   
                                onChange={handleChange}    
                                variant="standard"   
                            />   
                        </Grid>  
                        <Grid item xs={3}>
                            <TextField    
                                id="StartupDelay"   
                                label="Startup Delay (s)"   
                                type="number"   
                                InputProps={{ inputProps: {min: 0, max: Infinity } }}   
                                value={magnetometer.StartupDelay}   
                                onChange={handleChange}    
                                variant="standard"   
                            />   
                        </Grid>            
                        <Grid item xs ={3}>
                            <TextField    
                                id="ScaleFactor"   
                                label="Scale Factor"   
                                type="number"   
                                InputProps={{ inputProps: {min: 0, max: Infinity } }}   
                                value={magnetometer.ScaleFactor}   
                                onChange={handleChange}    
                                variant="standard"   
                            />     
                        </Grid>
                    </Grid>    
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" style={{paddingTop:'15px', marginTop:'15px'}}>
                        <Grid item xs={3}><Button onClick={() => handleReset()} style={{paddingLeft:'1px', margin: '5px'}}> Reset to Default </Button></Grid>
                        <Grid item xs={9}><Button variant="outlined" onClick={closeModal} style={{float:'right'}}>Ok</Button> &nbsp;&nbsp;&nbsp;</Grid>
                    </Grid>
                </Typography>  
            </Box>
        </div>
    )
}