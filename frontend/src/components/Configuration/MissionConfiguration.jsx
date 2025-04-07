import * as React from 'react';
import Box from '@mui/material/Box'
import Container from '@mui/material/Container';
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

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      padding: '5px'
    }
  }));

export default function MissionConfiguration (mission) {
    const { mainJson, setMainJson } = useMainJson();
    const [duplicateNameIndex, setDuplicateNameIndex] = React.useState(-1);
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
        MissionValue: null,
        Mission : {
            name:"fly_to_points",
            param : []
        },
        // Cameras: {
        //     CaptureSettings: [
        //         {
        //           ImageType: 0,
        //           Width: 256,
        //           Height: 144,
        //           FOV_Degrees: 90,
        //           AutoExposureSpeed: 100,
        //           AutoExposureBias: 0,
        //           AutoExposureMaxBrightness: 0.64,
        //           AutoExposureMinBrightness: 0.03,
        //           MotionBlurAmount: 0,
        //           TargetGamma: 1,
        //           ProjectionMode: '',
        //           OrthoWidth: 5.12
        //         }
        //     ],
        //     NoiseSettings: [
        //         {
        //           Enabled: false,
        //           ImageType: 0,
        //           RandContrib: 0.2,
        //           RandSpeed: 100000,
        //           RandSize: 500,
        //           RandDensity: 2,
        //           HorzWaveContrib: 0.03,
        //           HorzWaveStrength: 0.08,
        //           HorzWaveVertSize: 1,
        //           HorzWaveScreenSize: 1,
        //           HorzNoiseLinesContrib: 1,
        //           HorzNoiseLinesDensityY: 0.01,
        //           HorzNoiseLinesDensityXY: 0.5,
        //           HorzDistortionContrib: 1,
        //           HorzDistortionStrength: 0.002
        //         }
        //     ],
        //     Gimbal: {
        //         Stabilization: 0,
        //         Pitch: 0,
        //         Roll: 0,
        //         Yaw: 0
        //     },
        //     X:0,
        //     Y:0,
        //     Z:0,
        //     Pitch: 0,
        //     Roll: 0, 
        //     Yaw: 0
        // }
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
            MissionValue: null,
            Mission : {
                name:"fly_to_points",
                param : []
            },
            // Cameras: {
            //     CaptureSettings: [
            //         {
            //           ImageType: 0,
            //           Width: 256,
            //           Height: 144,
            //           FOV_Degrees: 90,
            //           AutoExposureSpeed: 100,
            //           AutoExposureBias: 0,
            //           AutoExposureMaxBrightness: 0.64,
            //           AutoExposureMinBrightness: 0.03,
            //           MotionBlurAmount: 0,
            //           TargetGamma: 1,
            //           ProjectionMode: '',
            //           OrthoWidth: 5.12
            //         }
            //     ],
            //     NoiseSettings: [
            //         {
            //           Enabled: false,
            //           ImageType: 0,
            //           RandContrib: 0.2,
            //           RandSpeed: 100000,
            //           RandSize: 500,
            //           RandDensity: 2,
            //           HorzWaveContrib: 0.03,
            //           HorzWaveStrength: 0.08,
            //           HorzWaveVertSize: 1,
            //           HorzWaveScreenSize: 1,
            //           HorzNoiseLinesContrib: 1,
            //           HorzNoiseLinesDensityY: 0.01,
            //           HorzNoiseLinesDensityXY: 0.5,
            //           HorzDistortionContrib: 1,
            //           HorzDistortionStrength: 0.002
            //         }
            //     ],
            //     Gimbal: {
            //         Stabilization: 0,
            //         Pitch: 0,
            //         Roll: 0,
            //         Yaw: 0
            //     },
            //     X:0,
            //     Y:0,
            //     Z:0,
            //     Pitch: 0,
            //     Roll: 0, 
            //     Yaw: 0
            // }
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

    const popDrone = () =>{
        droneArray.pop()
    }

    const handleIncrement = () => {
        setDroneCount(droneCount +1)
        setDrone()
    }

    const handleDecrement = () => {
        setDroneCount(droneCount -1)
        setDroneArray(prev => {
            if (prev.length <= 1) return prev;
                const removedDrone = prev[prev.length - 1];
                mainJson.deleteDroneById(removedDrone.id);
                setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
                return prev.slice(0, -1);
            }
        );
      };
      
    
    const setDroneName = (e, index) => {
        setDroneArray(objs => {
            return objs.map((obj, i) => {
                if(index === obj.id) {
                    obj = {
                        ...obj,
                        droneName: e
                    }
                }
                return obj
            })
        })
    }

    React.useEffect(() => {
        mission.droneArrayJson(droneArray, mission.id)
    }, [droneArray])

    const setDroneJson = (json, index) => {
        console.log('set drone json---', json, index)
        // json = {...json, id: index, droneName:json.Name}
        // droneArray.splice(index, 1);
        // droneArray.push(json)
        // let newArry = droneArray.filter(((obj) => {return obj.id != index}))
        // console.log('newArry-----', newArry)
        // // setDroneArray(droneArray=>droneArray.splice(index, 1));
        // setDroneArray((oldArry) => {
        //     return oldArry.filter((obj) => obj.id !== index);
        // })
        // let indx = droneArray.findIndex(prod => prod.id === index)
        // console.log('indx-----', indx)
        // // if (indx > -1) { //make sure you found it
        // //     setDroneArray(prevState => prevState.splice(index, 1));
        // //    } 
        // droneArray.push(json)
        const target = droneArray.find(obj => obj.id == index);
        Object.assign(target, json)
        console.log('droneArray----Missin Config', droneArray)
    }

    return (
        <Box sx={{width: '100%', border:1, borderRadius: 3, overflow:'scroll', padding: 3}} >
            {/* <Container fixed> */}
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
                                {/* <div key={drone.id}>{drone.name}</div> */}
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
            {/* </Container> */}
        </Box>
    )
}