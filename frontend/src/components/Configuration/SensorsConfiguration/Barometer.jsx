import * as React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import tooltip from '@mui/material/Tooltip';
import Tooltip from '@mui/material/Tooltip';

const defaultBarometer = {   
        PressureFactorSigma: '0.001825',
        PressureFactorTau: '3600',
        UncorrelatedNoiseSigma: '2.7',
        UpdateLatency: '0',
        UpdateFrequency: '50',
        StartupDelay: '0'

}  

export default function Barometer (sensor) {
    console.log('In barometer')
    const [barometer, setBarometer] = React.useState(sensor.barometerObj);

    //    ...sensor.barometerObj,
    //    PressureFactorSigma: '0.001825',
    //    PressureFactorTau: '3600',
    //    UncorrelatedNoiseSigma: '2.7',
    //    UpdateLatency: '0',
    //    UpdateFrequency: '50',
    //    StartupDelay: '0'
   //   });

   React.useEffect(() => {
    sensor.updateJson(barometer, sensor.name) 
   }, [barometer])


   React.useEffect(() => {
    setBarometer({
      ...barometer, 
      ...defaultBarometer
    });
  }, []); 

   // React.useEffect(() => {
    //    console.log('use effect in barometer')
      //  sensor.updateJson(barometer, sensor.name)
 //   }, [barometer])

  //  const handleChangeSwitch = (val) => {
   //     setBarometer(prevState => ({
         //       ...prevState,
       //         Enabled: val.target.checked
      //  }))
   // }

    const closeModal = () => {
        sensor.closeModal(barometer, sensor.name)
    }

    const handleChange = (val) => {
        setBarometer(prevState => ({
            ...prevState,
            [val.target.id]: val.target.type === "number" ? parseInt(val.target.value, 10) : val.target.value
        }))
    }

    const setDefaultBarometer = () => {
        setBarometer(prevState => ({
            ...prevState,
            ...sensor.barometerObj,
            PressureFactorSigma: '0.001825',
            PressureFactorTau: '3600',
            UncorrelatedNoiseSigma: '2.7',
            UpdateLatency: '0',
            UpdateFrequency: '50',
            StartupDelay: '0'
    }))
    }

    return (
        <div>
            <Box>
                <Typography variant="h6" component="h2">
                    {barometer.Key}
                </Typography>
                <Typography>
                    <Grid container spacing={2} direction="row">
                        <Grid item xs={3}>
                            <FormGroup>
                                <FormControlLabel disabled control={<Switch checked={barometer.Enabled}  inputProps={{ 'aria-label': 'controlled' }} />}  label="Enabled" />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="PressureFactorSigma" onChange={handleChange} label="Pressure Factor Sigma" type="number" variant="standard" value={barometer.PressureFactorSigma}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="PressureFactorTau" onChange={handleChange} label="Pressure Factor Tau" type="number" variant="standard" value={barometer.PressureFactorTau}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="UncorrelatedNoiseSigma" onChange={handleChange} label="Uncorrelated Noise Sigma" type="number" variant="standard" value={barometer.UncorrelatedNoiseSigma}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="UpdateLatency" onChange={handleChange} label="Update Latency" type="number" variant="standard" value={barometer.UpdateLatency}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="UpdateFrequency" onChange={handleChange} label="Update Frequency (Hz)" type="number" variant="standard" value={barometer.UpdateFrequency}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="StartupDelay" onChange={handleChange} label="Startup Delay" type="number" variant="standard" value={barometer.StartupDelay}/>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" style={{paddingTop:'15px', marginTop:'15px'}}>
                        <Grid item xs={3}><Button onClick={() => setDefaultBarometer()} style={{paddingLeft:'1px', margin: '5px'}}> Reset to Default </Button></Grid>
                        <Grid item xs={9}><Button variant="outlined" onClick={closeModal} style={{float:'right'}}>Ok</Button> &nbsp;&nbsp;&nbsp;</Grid>
                    </Grid>
                </Typography>
            </Box>
        </div>
    )
}
