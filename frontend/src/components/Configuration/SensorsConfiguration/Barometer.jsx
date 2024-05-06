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
import Snackbar from '@mui/material/Snackbar';


//const defaultBarometer = {   
       //   PressureFactorSigma: '0.001825',
  //      PressureFactorTau: '3600',
        //  UncorrelatedNoiseSigma: '2.7',
 ///      UpdateLatency: '0',
 //       UpdateFrequency: '50',
   //     StartupDelay: '0'

//}  

export default function Barometer (sensor) {
    console.log('In barometer') 
    console.log(sensor.barometerObj);

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


   //React.useEffect(() => {
   // setBarometer({
  //    ...barometer, 
   //   ...defaultBarometer
   // });
  //}, []);  

   React.useEffect(() => {  
    sensor.updateJson(barometer, sensor.name) 
   }, [barometer])

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

    //const handleChange = (val) => {
      //  setBarometer(prevState => ({
        //    ...prevState,
          //  [val.target.id]: val.target.type === "number" ? parseInt(val.target.value, 10) : val.target.value
       // }))
   // }  

   const handleChange = (event) => {
    const { id, value } = event.target;
    const parsedValue = event.target.type === "number" ? parseFloat(value) : value;
    setBarometer((prevBarometer) => ({
      ...prevBarometer,
      [id]: parsedValue,
    }));
  };
  

    const handleReset = () => {  
        setBarometer(sensor.barometerObj);
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

   // const setDefaultBarometer = () => {
    //    setBarometer(prevState => ({
     //       ...prevState,
     //       ...sensor.barometerObj,
   //         PressureFactorSigma: '0.001825',
   //         PressureFactorTau: '3600',
    //        UncorrelatedNoiseSigma: '2.7',
    //        UpdateLatency: '0',
   ///         UpdateFrequency: '50',
  //          StartupDelay: '0'
//    }))
 //   } 


 return(
    <div>
        <Box>
            <Typography variant="h6" component="h2">
                {barometer.Key || ""}
            </Typography> 
            <Typography>
                <Grid container spacing={2} direction="row">
                    <Grid item xs={3}>
                        <FormGroup>
                            <FormControlLabel disabled control={<Switch checked={barometer.Enabled} inputProps={{ 'aria-label': 'controlled' }} />} label="Enabled" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={3}>
                        <Tooltip title="The frequency at which the compass should send readings to the flight controller."> 
                            <TextField id="UpdateFrequency" onChange={handleChange} label="Update Frequency (Hz)" type="number" variant="standard" value={barometer.UpdateFrequency}/>
                        </Tooltip>   
                    </Grid>
                    <Grid item xs={3}>  
                    <TextField 
                    id="UncorrelatedNoiseSigma" 
                    label="Noise Sigma" 
                    type="number" 
                    InputProps={{ 
                        inputProps: { min: 0, max: Infinity, step: 0.1 },  
                    
                    }} 
                    value={barometer.UncorrelatedNoiseSigma} 
                    onChange={handleChange} 
                    variant="standard" 
                    />
                    </Grid>     
                    <Grid item xs={3}>   
                    <TextField 
                    id="PressureFactorSigma" 
                    label="Pressure Factor Sigma" 
                    type="number" 
                    InputProps={{ 
                        inputProps: { min: 0, max: Infinity, step: 0.00001 },  
                    
                    }} 
                    value={barometer.PressureFactorSigma} 
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
                            value={barometer.UpdateLatency}   
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
                            value={barometer.StartupDelay}   
                            onChange={handleChange}    
                            variant="standard"   
                        />   
                    </Grid>            
                    <Grid item xs ={3}>
                        <TextField    
                            id="PressureFactorTau"   
                            label="Pressure Factor Tau"   
                            type="number"   
                            InputProps={{ inputProps: {min: 0, max: Infinity } }}   
                            value={barometer.PressureFactorTau}   
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