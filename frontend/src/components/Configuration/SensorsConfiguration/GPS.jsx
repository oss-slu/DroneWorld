
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


const defaultGps = {
    EphTimeConstant: 0.9,
    EpvTimeConstant: 0.9,
    EphInitial: 25, 
    EpvInitial: 25,
    EphFinal: 0.1,
    EpvFinal: 0.1, 
    EphMin3d: 3,
    EphMin2d: 4,
    UpdateLatency: 0.2,
    UpdateFrequency: 50,
    StartupDelay: 1  
  };

export default function GPS (sensor) {
    const[gps, setGps] = React.useState(defaultGps) 
    

    React.useEffect(() => {
        sensor.updateJson(gps, sensor.name)  
          }, [gps])

    const closeModal = () => {
        sensor.closeModal(gps, sensor.name)
    }

    const handleChangeSwitch = (val) => {
        setGps(prevState => ({
                ...prevState,
                Enabled: val.target.checked
        }))
    }  
    const tooltips = {
        EphTimeConstant: "Tooltip text...",
        EpvTimeConstant: "Tooltip text...",
        // etc for other fields
      }

    const handleChange = (val) => {   
        setGps(prevState => ({
            ...prevState,
            [val.target.id]: val.target.type === "number" ? parseInt(val.target.value, 10) : val.target.value
        }));  
    } 


    const handleReset = () => {
        setGps(defaultGps);
      };
    return(
        <div>  
            <Typography variant="h6" component="h2" style={{ marginBottom: '5px' }}>
                    {gps.Key}
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
            <TextField 
            id="EphTimeConstant"
            label="EphTimeConstant"
            type="number"
            InputProps={{
                inputProps: { min: 0, max: 100, step: 0.1 },
                onChange: (e) => {
                  let value = parseFloat(e.target.value);
                  value = Math.round(value / 0.1) * 0.1;
                  value = Math.min(Math.max(value, 0), 100);
        
                  // Format the value to a string with 2 decimal places
                  const formattedValue = value.toFixed(2);
        
                  setGps({ ...gps, EphTimeConstant: formattedValue });
                },
              }}
            value={gps.EphTimeConstant}
            onChange={handleChange} 
            variant="standard" 
            //style={{ marginBottom: '16px' }}  
            style={{ width: 160 }}
            /> 
            </Grid> 
            
         </Tooltip>  
         
         <Tooltip title={tooltips.EpvTimeConstant}>  
         <Grid item xs ={3}> 
         <TextField 
         id="EpvTimeConstant"
         label="EpvTimeConstant"
         type="number"
         InputProps={{
            inputProps: { min: 0, max: 100, step: 0.1 },
            onChange: (e) => {
              let value = parseFloat(e.target.value);
              value = Math.round(value / 0.1) * 0.1;
              value = Math.min(Math.max(value, 0), 100);
    
              // Format the value to a string with 2 decimal places
              const formattedValue = value.toFixed(2);
    
              setGps({ ...gps, EpvTimeConstant: formattedValue });
            },
          }}
         value={gps.EpvTimeConstant}
         onChange={handleChange} 
         variant="standard" 
         style={{ width: 160 }}

         />   
         </Grid>  
         </Tooltip>    
         <Grid item xs ={3}>
         <TextField 
         id="EphInitial"
         label="EphInitial"
         type="number"
         InputProps={{ inputProps: { min: 0, max: Infinity } }} 
         value={gps.EphInitial}
         onChange={handleChange} 
         variant="standard" 
         style={{ width: 160 }}

         />    
         </Grid>  
         <Grid item xs ={3}>
         <TextField 
         id="EpvInitial"
         label="EpvInitial"
         type="number"
         InputProps={{ inputProps: { min: 0, max: Infinity} }} 
         value={gps.EpvInitial}
         onChange={handleChange} 
         variant="standard" 
         style={{ width: 160 }}
         />    
         </Grid>        

         </Grid> 


         <Grid item xs ={3}>
         <TextField 
         id="EphFinal"
         label="EphFinal"
         type="number"
         InputProps={{
            inputProps: { min: 0, max: 100, step: 0.1 },
            onChange: (e) => {
              let value = parseFloat(e.target.value);
              value = Math.round(value / 0.1) * 0.1;
              value = Math.min(Math.max(value, 0), 100);
    
              // Format the value to a string with 2 decimal places
              const formattedValue = value.toFixed(2);
    
              setGps({ ...gps, EphFinal: formattedValue });
            },
          }}
         value={gps.EphFinal}
         onChange={handleChange} 
         variant="standard" 
         style={{ width: 160 }}
         />    
         </Grid>    

         <Grid item xs = {3}> 
         <TextField 
         id="EpvFinal"
         label="EpvFinal"
         type="number" 
         InputProps={{
            inputProps: { min: 0, max: 100, step: 0.1 },
            onChange: (e) => {
              let value = parseFloat(e.target.value);
              value = Math.round(value / 0.1) * 0.1;
              value = Math.min(Math.max(value, 0), 100);
    
              // Format the value to a string with 2 decimal places
              const formattedValue = value.toFixed(2);
    
              setGps({ ...gps, EpvFinal: formattedValue });
            },
          }}
         value={gps.EpvFinal}
         onChange={handleChange} 
         variant="standard" 
         style={{ width: 160 }}
         />    
         </Grid> 

         <Grid item xs={3}> 
         <TextField  
         id="EphMin3d" 
         label="EphMin3d" 
         type="number" 
         InputProps={{ inputProps: {min: 0, max: Infinity } }} 
         value={gps.EphMin3d} 
         onChange={handleChange} 
         variant="standard" 
         style={{ width: 160 }}
         
         />    
         </Grid> 

         <Grid item xs={3}> 
         <TextField  
         id="EphMin2d" 
         label="EphMin2d" 
         type="number" 
         InputProps={{ inputProps: {min: 0, max: Infinity } }} 
         value={gps.EphMin2d} 
         onChange={handleChange} 
         variant="standard" 
         style={{ width: 160 }}
         />  
         </Grid>    

         
         <Grid/>  


        
         </Grid>
                
                <Typography >
                <Grid container spacing={4} >
                <Grid container item xs={9} style={{marginTop: 10}}>
                <Grid container spacing={4} direction="row">
                        <Grid item xs={10.5}>
                          
            
                        
                        {/* <Grid item xs={3}>
                            <TextField id="Key" onChange={handleChange} label="Name" variant="standard" value={gps.Key}/>
                        </Grid> */}
                        {/* <Grid item xs={3}>
                            <TextField id="EphTimeConstant" onChange={handleChange} label="EphTimeConstant" variant="standard" value={gps.EphTimeConstant}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="EpvTimeConstant" onChange={handleChange} label="EpvTimeConstant" variant="standard" value={gps.EpvTimeConstant}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="EphInitial" onChange={handleChange} label="EphInitial" variant="standard" value={gps.EphInitial}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="EpvInitial" onChange={handleChange} label="EpvInitial" variant="standard" value={gps.EpvInitial}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="EphFinal" onChange={handleChange} label="EphFinal" variant="standard" value={gps.EphFinal}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="EpvFinal" onChange={handleChange} label="EpvFinal" variant="standard" value={gps.EpvFinal}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="EphMin3d" onChange={handleChange} label="EphMin3d" variant="standard" value={gps.EphMin3d}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="EphMin2d" onChange={handleChange} label="EphMin2d" variant="standard" value={gps.EphMin2d}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id="UpdateLatency" onChange={handleChange} label="UpdateLatency" variant="standard" value={gps.UpdateLatency}/>
                        </Grid> */} 
                         <Grid container xs={18} spacing={12} justifyContent="flex-end" >
                       

                        <Tooltip title="Please enter the GPS update frequency (in Hertz) to ensure accurate location tracking. A higher update frequency will provide more real-time and accurate data, while a lower frequency may result in less accurate location updates." placement="top">
                        <Grid item xs={4}>
                            <TextField id="UpdateFrequency" onChange={handleChange} type="number" label="Update Frequency (Hz)" variant="standard" value={gps.UpdateFrequency} style={{ width: '150%' }}/> 
                        </Grid>  
                         
                        
                        </Tooltip>  
                    


                    <Grid item xs={4}> 
                     <TextField   
                      id="StartupDelay"  
                      label="StartupDelay (s)"  
                      type="number"  
                      InputProps={{ inputProps: {min: 0, max: Infinity } }}  
                      value={gps.StartupDelay}  
                      onChange={handleChange}   
                      variant="standard"  
                      style={{ width: 160 }} 
                      />   
                      
                      </Grid>    
    
                      <Grid item xs={4}>  
                      <TextField   
                      id="UpdateLatency"  
                      label="UpdateLatency (s)"  
                      type="number"  
                      InputProps={{
                        inputProps: { min: 0, max: 100, step: 0.1 },
                        onChange: (e) => {
                          let value = parseFloat(e.target.value);
                          value = Math.round(value / 0.1) * 0.1;
                          value = Math.min(Math.max(value, 0), 100);
                
                          // Format the value to a string with 2 decimal places
                          const formattedValue = value.toFixed(2);
                
                          setGps({ ...gps, UpdateLatency: formattedValue });
                        },
                      }}  
                      value={gps.UpdateLatency} 
                      onChange={handleChange}  
                      variant="standard"  
                      style={{ width: 160 }} 
                      />   
                      </Grid>    
                      </Grid>  
                      </Grid>  
                      </Grid> 
                      </Grid> 

                
                        
                        {/* <Grid item xs={3}>
                            <TextField id="StartupDelay" onChange={handleChange} label="StartupDelay" variant="standard" value={gps.StartupDelay}/>
                        </Grid> */}
                
                    
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" style={{paddingTop:'15px', marginTop:'15px'}}>
                        <Button variant="outlined" onClick={closeModal}>Ok</Button> &nbsp;&nbsp;&nbsp;
                   
                    </Grid>
                    </Grid>  
                </Typography> 
                <Button onClick={() => setGps(defaultGps)}> 
                Reset to Default 
                </Button> 
            </Box> 
        </div> 
    )
}