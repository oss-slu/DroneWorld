import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import MonitorTabels from './MonitorTabels';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import EnvironmentConfiguration from './EnvironmentConfiguration';
import dayjs from 'dayjs';

export default function MonitorControl (monJson) {
    const [value, setValue] = React.useState('2');
    const [verticalValue, setVerticalValue] = React.useState('1.1');
    const [zoneCount, setZoneCount] = React.useState(1);

    const handleIncrement = () => {
        setZoneCount(zoneCount +1)
    }
    
    const [monitor, setMonitor] = React.useState(monJson.mainJsonValue.monitors != null ? monJson.mainJsonValue.monitors : {
        circular_deviation_monitor: {
            enable:false,
            param:[15]
        },
        collision_monitor: {
            enable:false,
            param:[]
        },
        unordered_waypoint_monitor: {
            enable:false,
            param:[1]
        },
        ordered_waypoint_monitor: {
            enable:false,
            param:[1]
        },
        point_deviation_monitor: {
            enable:false,
            param:[15]
        },
        min_sep_dist_monitor: {
            enable:false,
            param:[1,1]
        },
        landspace_monitor: {
            enable:false,
            param:[]
        },
        no_fly_zone_monitor: {
            enable:false,
            param:[
                []
            ]
        },
        drift_monitor:{
            enable:false,
            param:[1]
        },
        battery_monitor:{
            enable:false,
            param:[1,1]
        }
    })

    const [envConf, setEnvConf] = React.useState(monJson.mainJsonValue.environment != null ? monJson.mainJsonValue.environment : {
        enableFuzzy: false,
        timeOfDayFuzzy: false,
        positionFuzzy: false,
        windFuzzy: false,
        Wind: {
            Direction: "NE",
            Velocity: 1,
        },
        Origin: {
            Latitude: 41.980381,
            Longitude: -87.934524,
        },
        TimeOfDay: "10:00:00",
        UseGeo: true,
        time:dayjs('2020-01-01 10:00')
    }); 

    const environmentJson = (event) => {
        monJson.monitorJson(event, "environment");
    }    
    React.useEffect(() => {
        environmentJson(envConf)
    }, [envConf])
    const handleBatteryMonitor = (val, index) => {
        setMonitor(prevState => ({
            ...prevState,
            battery_monitor: {
                ...prevState.battery_monitor,
                param: prevState.battery_monitor.param.map((item, i) =>
                    i === index ? parseFloat(val.target.value) : item
                )
            }
        }))
    }

    const handleMinHorizontalSepChange = (val) => {
        setMonitor(prevState => ({
            ...prevState,
            min_sep_dist_monitor: {
                ...monitor.min_sep_dist_monitor,
                param: [
                    parseFloat(val.target.value), // Convert to number before setting horizontal distance
                    parseFloat(monitor.min_sep_dist_monitor.param[1]) // Convert to number before keeping vertical distance
                ]
            }
        }));
    };

    const handleMinLateralSepChange = (val) => {
        setMonitor(prevState => ({
            ...prevState,
            min_sep_dist_monitor: {
                ...monitor.min_sep_dist_monitor,
                param: [
                    parseFloat(monitor.min_sep_dist_monitor.param[0]), // Convert to number before keeping horizontal distance
                    parseFloat(val.target.value) // Convert to number before setting lateral distance
                ]
            }
        }));
    };
    const  handleWayPointThreshChange= (val) => {
        setMonitor(prevState => ({
            ...prevState,
            unordered_waypoint_monitor: {
                ...monitor.unordered_waypoint_monitor,
                param: [
                    parseFloat(val.target.value)
                ]
            }
        }))
        setMonitor(prevState => ({
            ...prevState,
            ordered_waypoint_monitor: {
                ...monitor.ordered_waypoint_monitor,
                param: [
                    parseFloat(val.target.value)
                ]
            }
        }))
        setMonitor(prevState => ({
            ...prevState,
            drift_monitor: {
                ...monitor.drift_monitor,
                param: [
                    parseFloat(val.target.value)
                ]
            }
        }))
    }

    const  handleDeviationPercent= (val) => {
        setMonitor(prevState => ({
            ...prevState,
            point_deviation_monitor: {
                ...monitor.point_deviation_monitor,
                param: [
                    parseFloat(val.target.value)
                ]
            }
        }))
        setMonitor(prevState => ({
            ...prevState,
            circular_deviation_monitor: {
                ...monitor.circular_deviation_monitor,
                param: [
                    parseFloat(val.target.value)
                ]
            }
        }))
    }

    const  handleOrderedPtChange= (val) => {
        setMonitor(prevState => ({
            ...prevState,
            ordered_waypoint_monitor: {
                ...monitor.ordered_waypoint_monitor,
                param:[ parseFloat(val.target.value)]
            }
        }))
    }

    const handleDriftThreshChange= (val) => {
        setMonitor(prevState => ({
            ...prevState,
            drift_monitor: {
                ...monitor.drift_monitor,
                param: [
                    parseFloat(val.target.value),
                ]
            }
        }))
    }

    const handleChange = (even, newValue) => {
        setValue(newValue);
        if(newValue =='1') {
            setVerticalValue('1.1')
        } else {
            setVerticalValue('2.1')
        }
    };

    const handleVerticalChange = (even, newValue) => {
        setVerticalValue(newValue);
    };

    const monitorJson = (event) => {
        monJson.monitorJson(event, monJson.id);
    }

    React.useEffect(() => {
        monJson.monitorJson(monitor, monJson.id);
    }, [monitor])
    const handleChangeSwitch = (val, id) => {
        setMonitor(prevState => ({
            ...prevState,
            [id]: {
                ...monitor[id],
                enable:val.target.checked
            }
        }))
    }

    const setLandspaceZones = (parmData) => {
        let newVal = []
        parmData.map(dd => {
            let mainArr = []
            console.log(dd)
            mainArr.push(dd[0])
            mainArr.push(dd[1])
            newVal.push(mainArr)
        })
        setMonitor(prevState => ({
            ...prevState,
            landspace_monitor: {
            ...monitor.landspace_monitor,
                        param: [
                            parseFloat(monitor.landspace_monitor.param[0]),
                            newVal
                            ]
                    }
                }))
    }

    const setLandspaceParameters = (parmData) => {
        let newVal = []
        parmData.map(dd => {
            let mainArr = []
            console.log(dd)
            mainArr.push(dd[0])
            mainArr.push(dd[1])
            newVal.push(mainArr)
        })
        setMonitor(prevState => ({
            ...prevState,
            landspace_monitor: {
                ...monitor.landspace_monitor,
                param: [newVal]
            }
        }))
    }

    const setLandspaceThreshold = (val) => {
        setMonitor(prevState => ({
            ...prevState,
            landspace_monitor: {
            ...monitor.landspace_monitor,
                        param: [
                            parseFloat(val.target.value),
                            monitor.landspace_monitor.param[1]
                            ]

                    }
                }))
    }

    const handleZoneDelete = (index) => {
        console.log('index----', index)
        let newRows = [...monitor.no_fly_zone_monitor.param[0]]
        console.log('newRows---', newRows)
        let innerRows = [...newRows]
        console.log('innerRows---', innerRows[index])
        innerRows.splice(index,1)
        newRows = [innerRows]
        console.log('new rows after set', newRows)
        setMonitor(prevState => ({
            ...prevState,
            no_fly_zone_monitor: {
                    ...monitor.no_fly_zone_monitor,
                    param: [newRows]
            }
        }))
        setZoneCount(zoneCount-1)
    }

    const setNoFlyParameters = (parmData, index) => {
        let newVal = []
        let paramArray = []
        parmData.map(dd => {
            let mainArr = []
            console.log(dd)
            mainArr.push(dd[0])
            mainArr.push(dd[1])
            mainArr.push(dd[2])
            newVal.push(mainArr)
        })
        let newRows = [...monitor.no_fly_zone_monitor.param[0]]
        newRows.splice(index,1)
        newRows.push(newVal)
        setMonitor(prevState => ({
            ...prevState,
            no_fly_zone_monitor: {
                    ...monitor.no_fly_zone_monitor,
                    param: [newRows]
            }
        }))
    }
    const singleMonitors = [
        {
            name: "Collision",
            value: '1.1',
            description: "Test if a drone collides with other drones or the environment",
            btns: null,
            images: null,
            colorText:monitor.collision_monitor.enable == true ? 'green': null,
            enableBtn:
                <Grid container direction="row">
                        <strong style={{paddingTop:'7px'}}>Status</strong>&nbsp;&nbsp;&nbsp;
                        <FormGroup>
                            <FormControlLabel control={<Switch checked={monitor.collision_monitor.enable} onChange={(e) => handleChangeSwitch(e, "collision_monitor")} inputProps={{ 'aria-label': 'controlled' }} />} label={monitor.collision_monitor.enable ? "Enabled" : "Disabled"} />
                        </FormGroup>
                </Grid>,
            tableData:null,
            isMultipleTable: false
        },
        {
            name: "Landing",
            value: '1.2',
            description: "Test whether the drones land at safe landing locations",
            btns: null,
            colorText:monitor.landspace_monitor.enable == true ? 'green': null,
            images: null,
            enableBtn:
             
            <Grid container direction="row">
                <strong style={{paddingTop:'7px'}}>Status</strong>&nbsp;&nbsp;&nbsp;
                <FormGroup>
                    <FormControlLabel control={<Switch checked={monitor.landspace_monitor.enable} onChange={(e) => handleChangeSwitch(e, "landspace_monitor")} inputProps={{ 'aria-label': 'controlled' }} />} label={monitor.landspace_monitor.enable ? "Enabled" : "Disabled"} />
                </FormGroup>
            </Grid>,

            tableData:<React.Fragment>{monitor.landspace_monitor.enable === true ? 
            <><Grid item xs={12}><strong>Configure safe landing spots for drones </strong></Grid>
            <MonitorTabels hideAltitude="true" errorMessage="false" jsonVal={setLandspaceParameters} /></>:null}</React.Fragment>,
            isMultipleTable: false
        },
        {
            name: "Drift",
            value: '2.1',
            description: "Test whether the drones drift from its planned flight path",
            colorText:monitor.point_deviation_monitor.enable == true ? 'green': null,
            btns:
                <React.Fragment>{monitor.point_deviation_monitor.enable == true ? 
                <Grid item xs={12}>
                    <Grid item xs={12} style={{paddingBottom:20}}><strong>Configure the acceptable flight drift </strong></Grid>
                    <FormGroup>
                        <Tooltip title="Max total acceptable deviation from the actual flight path (in meters)" placement='bottom'>
                            <Grid item xs={6}>
                                <TextField id="standard-basic" label="Deviation/Drift (in meters)" type="number" step="0.1" variant="standard" onChange={handleDeviationPercent} value={monitor.point_deviation_monitor.param[0]}></TextField>
                            </Grid>
                        </Tooltip>
                    </FormGroup>
                    <Grid item xs={12} style={{paddingTop:50}}>
                    <Alert severity="info">
                        Note: Flight drift is calculated by analyzing whether the sUAS or drone drifts away from the planned path and breaches the configured distace at any point in the mission
                     </Alert>
                        
                        </Grid>
                </Grid> 
                : null}</React.Fragment>,
            images: null,
            enableBtn:
                <Grid container direction="row"><strong style={{paddingTop:'7px'}}>Status</strong>&nbsp;&nbsp;&nbsp;
                
                <FormControlLabel control={<Switch checked={monitor.point_deviation_monitor.enable} onChange={(e) => {
                    handleChangeSwitch(e, "point_deviation_monitor")
                    handleChangeSwitch(e, "circular_deviation_monitor")
                }} inputProps={{ 'aria-label': 'controlled' }} />} label={monitor.point_deviation_monitor.enable ? "Enabled" : "Disabled"} /></Grid>,
            tableData:null,
            isMultipleTable: false

        },
        {
            name: "Airspace",
            value: '2.6',
            description: "Test whether the drones avoid entering no fly zones",
            colorText:monitor.no_fly_zone_monitor.enable == true ? 'green': null,
            btns:null,
            bodyText:null,
            images:null,
            enableBtn:
                <Grid container direction="row">
                    <strong style={{paddingTop:'7px'}}>Status</strong>&nbsp;&nbsp;&nbsp;
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={monitor.no_fly_zone_monitor.enable} onChange={(e) => handleChangeSwitch(e, "no_fly_zone_monitor")} inputProps={{ 'aria-label': 'controlled' }} />} label={monitor.no_fly_zone_monitor.enable ? "Enabled" : "Disabled"} />
                    </FormGroup>
                </Grid>,
            mutlipleBtn:
                <React.Fragment>{monitor.no_fly_zone_monitor.enable == true ? 
                   
                            <><Grid item xs={12}><strong>Configure no-fly zones : Ferature Development in Progress </strong></Grid>
                        <img src="../images/dummy_map_configurator.png"></img>
                    <Alert severity="info">Note : We are excited to announce that we are currently developing a new feature that will allow users to create 3D polygons on the map to define one or more no fly zones. This feature will give users greater control over where their drones can and cannot fly, helping to ensure safer and more responsible drone operation.           </Alert>
                    
                    
                            <div style={{ padding: 15 }}>


                        
                    </div></>:null}</React.Fragment>,
            isMultipleTable: false,
        },
        {
            name: "Separation",
            value: '2.7',
            colorText:monitor.min_sep_dist_monitor.enable == true ? 'green': null,
            description: "Test whether the drones breach the minimum separation distance with other drones",
            btns:
            <React.Fragment>{monitor.min_sep_dist_monitor.enable == true ? <React.Fragment>
               
                <Grid item xs={12}><strong>Configure minimum separation distances </strong></Grid>
                
                <Tooltip title="Enter Minimum Horizontal separation distance in Meters" placement='bottom'>
                <Grid item xs={6}>
                <TextField id="standard-basic" label="Minimum Horizontal Separation (meters)" type="number" step="0.1" variant="standard" style = {{width:250}} onChange={handleMinHorizontalSepChange} value={monitor.min_sep_dist_monitor.param[0] }></TextField>
                </Grid>
                </Tooltip>
            </React.Fragment>:null}</React.Fragment>,
            images: null,
            enableBtn:
                <Grid container direction="row">
                    <strong style={{paddingTop:'7px'}}>Status</strong>&nbsp;&nbsp;&nbsp;
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={monitor.min_sep_dist_monitor.enable} onChange={(e) => handleChangeSwitch(e, "min_sep_dist_monitor")} inputProps={{ 'aria-label': 'controlled' }} />} label={monitor.min_sep_dist_monitor.enable ? "Enabled" : "Disabled"} />
                    </FormGroup>
                </Grid>,
            tableData:null,
            isMultipleTable: false
        },
        {
            name: "Battery",
            value: '2.8',
            description: "Test whether the drone's battery dropped below the certain percentage",
            colorText:monitor.battery_monitor.enable == true ? 'green': null,
            btns:
                <React.Fragment>{monitor.battery_monitor.enable == true ? 
                <Grid item xs={12}>
                    <Grid item xs={12} style={{paddingBottom:20}}><strong>Configure the current battery capacity </strong></Grid>
                    <FormGroup>
                        <Tooltip title="Input the current battery capacity of the drone as % (0-100)" placement='bottom'>
                            <Grid item xs={6} style={{marginBottom: '20px'}}>
                                <TextField id="battery-capacity" label="Battery Capacity (%)" type="number" step="0.1" variant="standard" style={{width: '190px'}} inputProps={{min:0, max:100}} onChange={(val) => handleBatteryMonitor(val, 0)} value={monitor.battery_monitor.param[0]}></TextField>
                            </Grid>
                        </Tooltip>
                        <Tooltip title="Input the target failure battery percentage for testing" placement='bottom'>
                            <Grid item xs={6}>
                                <TextField id="target-failure" label="Target Failure Percentage (%)" type="number" step="0.1" variant="standard" style={{width: '190px'}} inputProps={{min:0, max:100}} onChange={(val) => handleBatteryMonitor(val, 1)} value={monitor.battery_monitor.param[1]}></TextField>
                            </Grid>                         
                        </Tooltip>
                    </FormGroup>
                    <Grid item xs={12} style={{paddingTop:50}}>
                     <Alert severity="info">
                        <AlertTitle>Info</AlertTitle>
                        This feature is still in development.
                    </Alert>
                    </Grid>
                </Grid>
                : null}</React.Fragment>,
            images: null,
            enableBtn:
                <Grid container direction="row"><strong style={{paddingTop:'7px'}}>Status</strong>&nbsp;&nbsp;&nbsp;
                <FormControlLabel control={<Switch checked={monitor.battery_monitor.enable} onChange={(e) => {
                    handleChangeSwitch(e, "battery_monitor")
                }} inputProps={{'aria-label': 'controlled'}} />} label={monitor.battery_monitor.enable ? "Enabled" : "Disabled"} /></Grid>,
            tableData: null,
            isMultipleTable: false
        }
    ]
    const handleFuzzyWindChange = (val) => {
        setEnvConf(prevState => ({
            ...prevState,
            windFuzzy: val.target.checked,
            enableFuzzy: val.target.checked || prevState.positionFuzzy || prevState.timeOfDayFuzzy
        }))
    }

    const handleFuzzyPositionChange = (val) => {
        setEnvConf(prevState => ({
            ...prevState,
            positionFuzzy: val.target.checked,
            enableFuzzy: val.target.checked || prevState.windFuzzy || prevState.timeOfDayFuzzy
        }))
    }

    const handleFuzzyTimeChange = (val) => {
        setEnvConf(prevState => ({
            ...prevState,
            timeOfDayFuzzy: val.target.checked,
            enableFuzzy: val.target.checked || prevState.windFuzzy || prevState.positionFuzzy
        }))
    }
    const CheckboxComponent = () => {

      return(
        <div>
        <div>
            <input
            type="checkbox"
            name="timeOfDayFuzzy"
            checked={envConf.timeOfDayFuzzy}
            onChange={handleFuzzyTimeChange}
            />
        <label htmlFor="timeOfDayFuzzy">Time of Day</label>
            <p style={{ fontSize: '12px', fontStyle: 'oblique' }}>Check the box if you would like there to be a Fuzzy Test for the time of day.</p>
        </div>

        <div>
            <input
                type="checkbox"
                name="position"
                checked={envConf.positionFuzzy}
                onChange={handleFuzzyPositionChange}
            />
        <label htmlFor="position">Position</label>
        <p style={{ fontSize: '12px', fontStyle: 'oblique' }}>Check the box if you would like there to be a Fuzzy Test for the drone position.</p>
        </div>

        <div>
            <input
            type="checkbox"
            name="wind"
            checked={envConf.windFuzzy}
            onChange={handleFuzzyWindChange}
            />
            <label htmlFor="wind">Wind</label>
            <p style={{ fontSize: '12px', fontStyle: 'oblique' }}> Check the box if you would like there to be a Fuzzy Test for the wind. </p>
        </div>
        </div>
      );
    };
    
    return(
        <div>
            <Box sx={{ width: '100%', border: '1px solid grey', padding: 5, paddingTop: 2, maxHeight: '400px', overflow:'scroll'}}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    <Tab label="Test Properties" value="2" />
                                    <Tab label= "Fuzzy Test Configuration" value ="Fuzzy" />
                                </Tabs>
                            </Box>
                            
                            <TabPanel value="2">
                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <TabContext value={verticalValue}>
                                        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
                                            <Tabs
                                                orientation="vertical"
                                                value={verticalValue}
                                                onChange={handleVerticalChange}
                                                variant="scrollable"
                                                scrollButtons="auto"
                                                sx={{ borderRight: 1, borderColor: 'divider', minWidth:'100px' }}
                                            >
                                                {singleMonitors.map(function(single, index) {
                                                    return <Tab key={index} label={single.name} value={single.value} style={{ justifyContent: "block", alignItems:"block", color:single.colorText}} wrapped/>
                                                })}
                                            </Tabs>
                                            {singleMonitors.map(function(sing, index) {
                                                return(
                                                    <TabPanel key={index} value={sing.value}>
                                                        <Container maxWidth="md">
                                                            <Typography>
                                                                <Grid container spacing={2} direction="row" style={{fontSize:"20px"}} >
                                                                   <Grid item xs={12}><strong>Description: </strong>{sing.description}</Grid>
                                                                </Grid>
                                                                <Grid container direction="row">
                                                                    {sing.enableBtn}
                                                                </Grid>
                                                                <br/>
                                                                <Grid container spacing={2} direction="row">
                                                                    {sing.btns}
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    {sing.mutlipleBtn}
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    {sing.tableData}
                                                                </Grid>
                                                                {sing.isMultipleTable == false ? null : 
                                                                    <React.Fragment> 
                                                                        {Array.apply(0, Array(zoneCount)).map(function (x, i) {
                                                                            return <div key={i}>
                                                                                <Typography style={{border:'1px solid', padding: '12px', marginBottom: '10px'}}> <strong>Zone {i+1}</strong>
                                                                                <ButtonGroup size="small" color="secondary" aria-label="small outlined button group" style={{float:'right', paddingBottom:'20px'}}>
                                                                                    <Button  style={{color:'red'}}>Delete Zone</Button>
                                                                                </ButtonGroup>
                                                                                <div style={{paddingTop: '10px'}}>
                                                                                <MonitorTabels hideAltitude="false" errorMessage="true" jsonVal={(e) => setNoFlyParameters(e, i)}/>
                                                                                </div>
                                                                                </Typography>
                                                                                </div>;
                                                                        })}
                                                                    </React.Fragment>
                                                                }
                                                            </Typography>
                                                        </Container>
                                                    </TabPanel>
                                                )
                                            })}
                                        </Box>
                                    </TabContext>
                                </Box>
                            </TabPanel>
                            <TabPanel value="Fuzzy">
                                    <CheckboxComponent/>
                            </TabPanel>
                        </TabContext>
                    </Box>
            </Box>
        </div>
    )
}
