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

export default function GPS (sensor) {
    const[gps, setGps] = React.useState(sensor.gPSObj || {}) 
    

    React.useEffect(() => {
        sensor.updateJson(gps, sensor.name)  
          }, [gps]); 

    const closeModal = () => {
        sensor.closeModal(gps, sensor.name)
    }
      
    const tooltips = {
        EphTimeConstant: "Tooltip text...",
        EpvTimeConstant: "Tooltip text...",
      }

    const handleChange = (event) => {
        const { id, value } = event.target;
        const parsedValue = event.target.type === 'number' ? parseFloat(value) : value;
        
        setGps((prevGps) => ({
            ...prevGps,
            [id]: parsedValue,
        }));
    };


    const handleReset = () => {  
        setGps(sensor.gPSObj);
      };

    return(
        <div>  
            <Typography variant="h6" component="h2" style={{ marginBottom: '5px' }}>
                    {gps.Key || ""}
                </Typography> 

                <Grid container spacing={2} direction="row">
                        <Grid item xs={3}> 
                        <Tooltip title={tooltips.EphTimeConstant}> 
                        </Tooltip>
                            <FormGroup>
                                <FormControlLabel disabled control={<Switch checked={gps.Enabled} inputProps={{ 'aria-label': 'controlled' }} />} label="Enabled" />
                            </FormGroup>
                </Grid>   
                </Grid>  
            <Box>     
            
            
            <Grid container spacing={2}>   
            <Grid container item xs={12}>
            <Tooltip title={tooltips.EphTimeConstant}>    
        

         <Grid item xs={3}>
                <TextField id="EphTimeConstant" label="EphTimeConstant" type="number" InputProps={{ 
                        inputProps: { min: 0, max: Infinity, step: 0.1 },  
                    
                    }} 
                    value={gps.EphTimeConstant} 
                    onChange={handleChange} 
                    variant="standard"  
                    />
         </Grid> 
            
         </Tooltip>  
         
         <Tooltip title={tooltips.EpvTimeConstant}>  
         <Grid item xs={3}>
                <TextField id="EpvTimeConstant" label="EpvTimeConstant" type="number"  
                 InputProps={{ 
                        inputProps: { min: 0, max: Infinity, step: 0.1 },  
                    
                    }} 
                    value={gps.EpvTimeConstant} 
                    onChange={handleChange} 
                    variant="standard"  
                    />
         </Grid>  

         </Tooltip>    
         <Grid item xs={3}>
                <TextField id="EphInitial" onChange={handleChange} label="EphInitial" type="number" variant="standard" value={gps.EphInitial}/>
         </Grid>  
         <Grid item xs={3}>
                <TextField id="EpvInitial" onChange={handleChange} label="EpvIntial" type="number" variant="standard" value={gps.EpvInitial}/>
         </Grid>     

         </Grid> 

         <Grid item xs={3}>
                <TextField id="EphFinal" label="EphFinal" type="number" InputProps={{ 
                        inputProps: { min: 0, max: Infinity, step: 0.1 },  
                    
                    }} 
                    value={gps.EphFinal} 
                    onChange={handleChange} 
                    variant="standard"  
                    />
         </Grid>    

         <Grid item xs={2.9}>
                <TextField id="EpvFinal" label="EpvFinal" type="number"  
                InputProps={{ 
                        inputProps: { min: 0, max: Infinity, step: 0.1 },  
                    
                    }} 
                    value={gps.EpvFinal} 
                    onChange={handleChange} 
                    variant="standard"  
                    />
         </Grid> 

         <Grid item xs={2.9}>
                <TextField id="EphMin3d" onChange={handleChange} label="EphMin3d" type="number" variant="standard" value={gps.EphMin3d} />
         </Grid> 

         <Grid item xs={3}>
                <TextField id="EphMin2d" onChange={handleChange} label="EphMin2d" type="number" variant="standard" value={gps.EphMin2d}/>
         </Grid> 

         
         <Grid/>  


        
         </Grid>
                
                <Typography >
                <Grid container spacing={4} >
                <Grid container item xs={9} style={{marginTop: 10}}>
                <Grid container spacing={4} direction="row">
                        <Grid item xs={10.5}>
                          
            
                        
                         <Grid container xs={18} spacing={12} justifyContent="flex-end" >
                       

                        <Tooltip title="Please enter the GPS update frequency (in Hertz) to ensure accurate location tracking. A higher update frequency will provide more real-time and accurate data, while a lower frequency may result in less accurate location updates." placement="top">
                        <Grid item xs={4}>
                            <TextField id="UpdateFrequency" onChange={handleChange} type="number" label="Update Frequency (Hz)" variant="standard" value={gps.UpdateFrequency} style={{ width: '150%' }}/> 
                        </Grid>  
                         
                        
                        </Tooltip>  
                    


                    <Grid item xs={3.99}>
                            <TextField id="StartupDelay" onChange={handleChange} label="Startup Delay (s)" type="number" variant="standard" value={gps.StartupDelay} style={{ width: '150%' }}/>
                    </Grid> 

                    <Grid item xs={4.01}>
                            <TextField id="UpdateLatency" label="Update Latency (Hz)" type="number" style={{ width: '150%' }} 
                            InputProps={{  
                                inputProps: { min: 0, max: Infinity, step: 0.1 },  
                    
                    }} 
                    value={gps.UpdateLatency} 
                    onChange={handleChange} 
                    variant="standard"  
                    />
                    </Grid>

                      </Grid>  
                      </Grid>  
                      </Grid> 
                      </Grid> 

                
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" style={{paddingTop:'15px', marginTop:'15px'}}>
                        <Grid item xs={3}><Button onClick={() =>  handleReset()} style={{paddingLeft:'25px', margin: '5px'}}> Reset to Default </Button></Grid>
                        <Grid item xs={9}><Button variant="outlined" onClick={closeModal} style={{float:'right'}}>Ok</Button> &nbsp;&nbsp;&nbsp;</Grid>
                    </Grid>
                    </Grid>  
                </Typography>  
            </Box> 
        </div> 
    )
}
