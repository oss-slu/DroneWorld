import * as React from 'react';
import Box from '@mui/material/Box'
import Container from '@mui/material/Container';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';
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
import { BootstrapTooltip } from '../../css/muiStyles';
import Tooltip from '@mui/material/Tooltip';
import colors from '../../utils/colors';
import { imageUrls } from '../../utils/const';
import { useMainJson } from '../../contexts/MainJsonContext';
import { SimulationConfigurationModel } from '../../model/SimulationConfigurationModel';
import { AccordionStyled } from '../../css/SimulationPageStyles';

export default function MissionConfiguration (mission) {
    const { mainJson, setMainJson, setCameraPositionRef } = useMainJson();
    const [droneCount, setDroneCount] = React.useState(mainJson.getAllDrones().length);
    
    const setDrone = () => {
        // droneArray.push({
        //     id: (droneCount), 
        //     droneName:"Drone " + (droneCount+1),
        //     FlightController: "SimpleFlight",
        //     droneType:"Multi Rotor", 
        //     droneModel:"DJI", 
        //     VehicleType: "SimpleFlight",
        //     DefaultVehicleState: "Armed",
        //     EnableCollisionPassthrogh: false,
        //     EnableCollisions: true,
        //     AllowAPIAlways: true,
        //     EnableTrace: false,
        //     Name:"Drone " + (droneCount+1),
        //     X:mission.mainJsonValue.environment != null ? droneCount > 0 ? (mission.mainJsonValue.environment.Origin.Latitude) + (0.0001 * droneCount): mission.mainJsonValue.environment.Origin.Latitude : 0,
        //     Y:mission.mainJsonValue.environment != null ? mission.mainJsonValue.environment.Origin.Longitude : 0,
        //     Z:mission.mainJsonValue.environment != null ? mission.mainJsonValue.environment.Origin.Height : 0,
        //     Pitch: 0,
        //     Roll: 0, 
        //     Yaw: 0,
        //     Sensors: null,
        //     MissionValue: null,
        //     Mission : {
        //         name:"fly_to_points",
        //         param : []
        //     },
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
        
    }

    const popDrone = () =>{
        mainJson.popLastDrone();
        setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
    };

    const handleIncrement = () => {
        setDroneCount(droneCount + 1);
        setDrone();
    };

    const handleDecrement = () => {
        setDroneCount(droneCount - 1);
        popDrone();
    };

    const handleDragStart = (event, index) => {
        const imgSrc = event.target.src;
        const dragData = {
          type: 'drone',
          src: imgSrc,
          index: index,
        };
    
        event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      };

    const setDroneName = (name, index) => {
        const drone = mainJson.getDroneBasedOnIndex(index);
        if (drone) {
            drone.Name = name;
            setMainJson(SimulationConfigurationModel.getReactStateBasedUpdate(mainJson));
        }
    };

    const handleLocateDrone = (event, index) => {
        event.stopPropagation();
        let drone = mainJson.getDroneBasedOnIndex(index);
        if (setCameraPositionRef.current) {
          setCameraPositionRef.current(drone.Y, drone.X, null, -Math.PI / 2);
        }
      };

    return (
        <div>
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

            {mainJson.getAllDrones()?.map((drone, index) => (
                <Grid container spacing={0} key={index}>
                    <Grid item xs={11.5}>
                        <AccordionStyled key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                                sx={{
                                    backgroundColor: `${colors.DRONE_ORANGE}cf`,
                                    '& .MuiAccordionSummary-content': {
                                        m: 0,
                                    },
                                    '&:first-of-type .MuiAccordionSummary-content': {
                                        margin: 0, // Specifically targeting the first item
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    }}
                                >
                                    <Typography variant='h5'>
                                        {drone.name.length > 10 ? `${drone.name.substring(0, 10)}...` : drone.name}
                                    </Typography>
                                    <Grid container alignItems='center' columnSpacing={2} sx={{ width: 'auto' }}>
                                        <Grid item>
                                            <BootstrapTooltip title='Click to fly to this drone on the map.'>
                                                <IconButton onClick={(e) => handleLocateDrone(e, index)}>
                                                    <MyLocationIcon />
                                                </IconButton>
                                            </BootstrapTooltip>
                                        </Grid>
                                        <Grid item>
                                            <BootstrapTooltip title='Drag and drop this drone to set or update its home location on the map.'>
                                                <img
                                                    src={imageUrls.drone_thick_orange}
                                                    alt='Draggable Icon'
                                                    draggable='true'
                                                    onDragStart={(e) => handleDragStart(e, index)}
                                                    style={{ width: 40, cursor: 'grab', marginRight: 20 }}
                                                />
                                            </BootstrapTooltip>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </AccordionSummary>
                        </AccordionStyled>
                    </Grid>
                </Grid>
            ))}
        </Box>
        </div>
    );
}