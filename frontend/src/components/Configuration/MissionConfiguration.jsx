import * as React from 'react';
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import {ExpandMore} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import DroneConfiguration from './DroneConfiguration'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { imageUrls } from '../../utils/const';
import { useMainJson } from '../../contexts/MainJsonContext';
import { SimulationConfigurationModel } from '../../model/SimulationConfigurationModel';

const useStyles = makeStyles(() => ({
    root: {
      width: '100%',
      padding: '5px'
    }
  }));

export default function MissionConfiguration (mission) {
    const { mainJson, setMainJson } = useMainJson();
    const classes = useStyles();
    const [droneCount, setDroneCount] = React.useState(mission.mainJsonValue.Drones != null ? mission.mainJsonValue.Drones.length : 1);
    const [droneArray, setDroneArray] = React.useState(mission.mainJsonValue.Drones != null ? mission.mainJsonValue.Drones : [{
        id: droneCount-1, 
        droneName:"Drone " + droneCount,
        FlightController: "SimpleFlight",
        droneType:"Multi Rotor", 
        droneModel:"DJI",
        VehicleType: "SimpleFlight",
        DefaultVehicleState: "Armed",
        EnableCollisionPassthrogh: false,
        EnableCollisions: true,
        AllowAPIAlways: true,
        EnableTrace: false,
        Name:"Drone " + (droneCount),
        X:mission.mainJsonValue.environment != null ? mission.mainJsonValue.environment.Origin.Latitude : 0,
        Y:mission.mainJsonValue.environment != null ? mission.mainJsonValue.environment.Origin.Longitude : 0,
        Z:mission.mainJsonValue.environment != null ? mission.mainJsonValue.environment.Origin.Height : 0,
        Pitch: 0,
        Roll: 0, 
        Yaw: 0,
        Sensors: null,
        MissionValue: "fly_to_points",
        Mission : {
            name:"fly_to_points",
            param : []
        },
    }]);

    React.useEffect(() => {
        if(droneArray.length===1){
            mainJson.addNewDrone(droneArray[droneCount-1]);
            setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
        }
    }, []);

    const setDrone = () => {
        droneArray.push({
            id: (droneCount), 
            droneName:"Drone " + (droneCount+1),
            FlightController: "SimpleFlight",
            droneType:"Multi Rotor", 
            droneModel:"DJI", 
            VehicleType: "SimpleFlight",
            DefaultVehicleState: "Armed",
            EnableCollisionPassthrogh: false,
            EnableCollisions: true,
            AllowAPIAlways: true,
            EnableTrace: false,
            Name:"Drone " + (droneCount+1),
            X:mission.mainJsonValue.environment != null ? droneCount > 0 ? (mission.mainJsonValue.environment.Origin.Latitude) + (0.0001 * droneCount): mission.mainJsonValue.environment.Origin.Latitude : 0,
            Y:mission.mainJsonValue.environment != null ? mission.mainJsonValue.environment.Origin.Longitude : 0,
            Z:mission.mainJsonValue.environment != null ? mission.mainJsonValue.environment.Origin.Height : 0,
            Pitch: 0,
            Roll: 0, 
            Yaw: 0,
            Sensors: null,
            MissionValue: "fly_to_points",
            Mission : {
                name:"fly_to_points",
                param : []
            },
        })
        mainJson.addNewDrone(droneArray[droneCount]);
        setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
    }

    const handleDragStart = (event, index) => {
        const imgSrc = event.target.src;
        const dragData = {
          type: 'drone',
          src: imgSrc,
          index: index,
        };

        event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      };

    const handleIncrement = () => {
        setDroneCount(droneCount +1)
        setDrone()
    }

    const handleDecrement = () => {
        // Ensure droneCount is greater than 0 to prevent negative counts
        if (droneCount > 0) {
          setDroneCount(prevCount => prevCount - 1);
      
          // Update the drone array by removing the last element
          setDroneArray(prevArray => {
            const updatedArray = prevArray.slice(0, -1); // Creates a new array without the last element
      
            // Call mainJson.popLastDrone() if it exists
            if (mainJson && typeof mainJson.popLastDrone === 'function') {
              mainJson.popLastDrone();
            } else {
              console.warn('mainJson.popLastDrone is not a function');
            }
      
            // Safely update mainJson state
            if (typeof SimulationConfigurationModel?.getReactStateBasedUpdate === 'function') {
              setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
            } else {
              console.warn('SimulationConfigurationModel.getReactStateBasedUpdate is not a function');
            }
      
            return updatedArray;
          });
        } else {
          console.warn('Drone count is already at zero.');
        }
      };
    
    const setDroneName = (e, index) => {
        setDroneArray(objs => {
            return objs.map((obj) => {
                if(index === obj.id) {
                    obj = {
                        ...obj,
                        droneName: e
                    }
                }
                return obj
            })
        })

        const updatedDrone = mainJson.getDroneBasedOnIndex(index);
        if (updatedDrone) {
            updatedDrone.droneName = e;
            mainJson.updateDroneBasedOnIndex(index, updatedDrone);
            setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
        }
    }

    React.useEffect(() => {
        mission.droneArrayJson(droneArray, mission.id)
    }, [droneArray])

    const setDroneJson = (json, index) => {
        console.log('set drone json---', json, index)
        const target = droneArray.find(obj => obj.id == index);
        Object.assign(target, json)
        console.log('droneArray----Missin Config', droneArray)
    }

    return (
        <Box sx={{width: '100%', border:1, borderRadius: 3, overflow:'scroll', padding: 3}} >
            <Grid container  direction="row" style={{padding: '12px'}} ><strong>Configure sUAS (small unmanned aircraft system) or drone characteristics in your scenario</strong></Grid>
                    <Alert severity="info">
                        <AlertTitle>Info</AlertTitle>
                        Please make sure that no two sUAS (small unmanned aircraft system) have the same Home Geolocation
                    </Alert>
                    <Grid container  direction="row" alignItems="center" justifyContent="right" style={{padding: '12px', fontSize:'18px'}}>
                        Number of sUAS &nbsp;&nbsp;
                        <ButtonGroup size="small" aria-label="small outlined button group" >
                        {droneCount >1 && <Button style={{fontSize:'15px'}} onClick={handleDecrement}>-</Button>}
                            
                            {droneCount && <Button style={{fontSize:'15px'}} variant="contained" color="primary">{droneCount}</Button>}
                            <Button style={{fontSize:'15px'}} onClick={handleIncrement} disabled={droneCount===10}>+</Button>
                        </ButtonGroup>
                    </Grid>
                    <div>
                        {droneArray.map((drone, index) => 
                        (<div key={index}>
                            <div>
                            <div className={classes.root}>
                                <Accordion>
                                    <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                    >
                                        <Typography className={classes.heading}>{drone.droneName}</Typography>
                                        <Grid container alignItems="center" columnSpacing={2} sx={{ width: 'auto' }}>
                                            <Grid item>
                                                <Tooltip title="Click to fly this drone on the map."></Tooltip>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip title="Drag and Drop this drone to set or update its home location on the map.">
                                                    <img
                                                        src={imageUrls.drone_icon}
                                                        alt="Draggable Icon"
                                                        draggable="true"
                                                        onDragStart={(e) => handleDragStart(e, index)}
                                                        style={{ width: 40, cursor: 'grab', marginRight: 20 }}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <Typography>
                                        <DroneConfiguration name={drone.droneName} id={drone.id} resetName={setDroneName} droneJson={setDroneJson} droneObject={droneArray[(drone.id)]}/>
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            </div>
                        </div>)
                        )}
                    </div>
        </Box>
    )
}
