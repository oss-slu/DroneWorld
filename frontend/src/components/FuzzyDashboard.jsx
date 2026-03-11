import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List'
import ClearIcon from '@mui/icons-material/Clear';
import { BASE_URL } from '../utils/const';
import { useLocation } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia'
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import AlertTitle from '@mui/material/AlertTitle';
import Link from '@mui/material/Link'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EMPTY_REPORT_DATA = {
  CircularDeviationMonitor: [],
  CollisionMonitor: [],
  LandspaceMonitor: [],
  UnorderedWaypointMonitor: [],
  OrderedWaypointMonitor: [],
  PointDeviationMonitor: [],
  MinSepDistMonitor: [],
  NoFlyZoneMonitor: [],
  htmlFiles: [],
};

export default function FuzzyDashboard() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const routeState = location.state ?? null;
  const hasRouteData = Boolean(routeState?.data);
  const resp = routeState?.data ?? EMPTY_REPORT_DATA;
  const mainJsonMonitors = routeState?.mainJson?.monitors ?? {};
  const deviation = mainJsonMonitors.circular_deviation_monitor?.param?.[0] ?? null;
  const horizontal = mainJsonMonitors.min_sep_dist_monitor?.param?.[0] ?? null;
  const [CircularDeviationMonitor, setCircularDeviationMonitor] = React.useState([])
  const [CollisionMonitor, setCollisionMonitor] = React.useState([])
  const [LandspaceMonitor, setLandspaceMonitor] = React.useState([])
  const [UnorderedWaypointMonitor, setUnorderedWaypointMonitor] = React.useState([])
  const [, setOrderedWaypointMonitor] = React.useState([])
  const [PointDeviationMonitor, setPointDeviationMonitor] = React.useState([])
  const [MinSepDistMonitor, setMinSepDistMonitor] = React.useState([])
  const [NoFlyZoneMonitor, setNoFlyZoneMonitor] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState();
  const routeFile = routeState?.file ?? {};
  const violation = (routeFile.fail ?? 0) > 0;
  const isFuzzyList = Boolean(routeFile.fuzzy);
  const [fuzzyTest, setFuzzyTest] = React.useState([]);
  const fileName = routeFile.fileName ?? 'Report';

  const names = [{name:0},{name:7},{name:14}]

  const handleOpen = (img) => {
    setOpen(true);
    setSelectedImage(img.imgContent)
  }
  const handleClose = () => {
      setOpen(false)
  };

  const redirectToReportDashboard = () => {
    navigate('/reports')
  }

  if (!hasRouteData) {
    return (
      <Box sx={{ p: 4 }}>
        <Paper elevation={3} sx={{ p: 3, maxWidth: 700, margin: '0 auto' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No Report Selected
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Open a report from the Reports page to view monitor details.
          </Typography>
          <Button variant="contained" onClick={redirectToReportDashboard}>
            Go to Reports
          </Button>
        </Paper>
      </Box>
    );
  }

  const returnContentsItem = (colorCode, keyValue, info, icon, fuzzyValue, severity_val) => {
    for (const mapKey of Object.keys(info)) {
      console.log(mapKey);
      console.log(info[mapKey])
      return (
      <React.Fragment>
        <Grid container spacing={2} direction="row" style={{fontFamily:"sans-serif"}}>
          <h4>{mapKey}</h4>&nbsp;&nbsp;
          </Grid>
        {info[mapKey].map((val) => {
        return (
          <React.Fragment key={keyValue} >
          <List key={keyValue}>
            <ListItem>
              <Alert variant="filled" severity={severity_val} style={{width:'100%'}}>
              
              <ListItemText primary={val} >
              </ListItemText>
                </Alert>
            </ListItem>
           
          </List>
          
          </React.Fragment>
        )
      })}
      </React.Fragment>)
    }
  }

  useEffect(() => {
    if(!hasRouteData) {
      return;
    }

    if(isFuzzyList) {
      setFuzzyTest([]);
      names.map(id=> {
        let unordered=[];
        let circular = [];
        let collision = [];
        let landscape = [];
        let orderWay = [];
        let pointDev = [];
        let minSep = [];
        let nonFly = [];
        resp.UnorderedWaypointMonitor.map(unorder => {
          if(id.name == unorder.fuzzyValue) {
              unordered.push(unorder)
          }
        })
        resp.CircularDeviationMonitor.map(circularDev => {
          if(id.name == circularDev.fuzzyValue) {
            circular.push(circularDev);
          }
        })
        resp.CollisionMonitor.map(coll => {
          if(id.name == coll.fuzzyValue) {
            collision.push(coll);
          }
        })
        resp.LandspaceMonitor.map(land => {
          if(id.name == land.fuzzyValue) {
            landscape.push(land);
          }
        })
        resp.OrderedWaypointMonitor.map( order => {
          if(id.name == order.fuzzyValue) {
            orderWay.push(order);
          }
        })
        resp.PointDeviationMonitor.map(point => {
          if(id.name == point.fuzzyValue) {
            pointDev.push(point);
          }
        })
        resp.MinSepDistMonitor.map(min => {
          if(id.name == min.fuzzyValue) {
            minSep.push(min);
          }
        })
        resp.NoFlyZoneMonitor.map(zone => {
          if(id.name == zone.fuzzyVale) {
            nonFly.push(zone)
          }
        })
        setFuzzyTest(prevState => [
          ...prevState,
          {
              "name":id.name,
              "UnorderedWaypointMonitor": unordered,
              "CircularDeviationMonitor": circular,
              "CollisionMonitor" : collision,
              "LandspaceMonitor": landscape,
              "OrderedWaypointMonitor": orderWay,
              "PointDeviationMonitor": pointDev,
              "MinSepDistMonitor": minSep,
              "NoFlyZoneMonitor":nonFly
          }
        ])
      })  
    } 
    if(!isFuzzyList) {
      setCircularDeviationMonitor(resp.CircularDeviationMonitor)
      setCollisionMonitor(resp.CollisionMonitor)
      setLandspaceMonitor(resp.LandspaceMonitor)
      setMinSepDistMonitor(resp.MinSepDistMonitor)
      setNoFlyZoneMonitor(resp.NoFlyZoneMonitor)
      setOrderedWaypointMonitor(resp.OrderedWaypointMonitor)
      setPointDeviationMonitor(resp.PointDeviationMonitor)
      setUnorderedWaypointMonitor(resp.UnorderedWaypointMonitor)
    }
  }, [hasRouteData, isFuzzyList, resp])
    
  return (
    <div>
      <Box>
      <Typography variant="h4" style={{textAlign:'center', padding:'10px', fontWeight: 700, marginTop: '5px'}}>
        {fileName} Detailed Report
      </Typography>
      </Box>
      <Box>
      <Typography variant="h4" style={{padding:'10px', fontWeight: 700, marginTop: '5px', alignContent:'right'}}>
        <Link
      style={{
        cursor: 'pointer',
        fontSize: '20px',
        position: 'relative',
        top: 0,
        right: 0,
        float: 'right'
      }}
      onClick={redirectToReportDashboard}
    >
      Back
    </Link>
      </Typography>
      </Box>
      {violation ? <Alert severity="warning">
                        <AlertTitle>Warning</AlertTitle>
                        <strong>Violation Detected</strong>
                    </Alert>  : null}
      
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>{isFuzzyList == true ? <React.Fragment>
        {fuzzyTest.length > 0 ? 
          <React.Fragment>
            {fuzzyTest.map(function(fuzzy, id){
              return (
                <Paper key={id} elevation={3} style={{margin:'25px', padding:20}}>
                  <Typography variant="h6" component="h2">
                    <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Fuzzed Parameter : Wind Velocity = {fuzzy.name} meters/s</div>
                  </Typography>
                  <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {fuzzy.CollisionMonitor.length > 0 ?<Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
            <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test: Drones shall avoid collisions with other drones and the environment</div>
          </Typography>
          <ul>
          {fuzzy.CollisionMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath, 'success'))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath, 'error'))}
                
               </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {fuzzy.CollisionMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                    image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null}
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {fuzzy.LandspaceMonitor.length > 0 ? <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test: Drone shall always land at safe locations</div>
          </Typography>
          <ul>
          {fuzzy.LandspaceMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
                
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {fuzzy.LandspaceMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>

                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                    image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null}
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {fuzzy.UnorderedWaypointMonitor.length > 0 ? <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test: Drones shall reach all waypoints in the mission</div>
          </Typography>
          <ul>
          {fuzzy.UnorderedWaypointMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                
                  
                
                { (returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                
                  {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error")) }
                
                
              </React.Fragment>:null
            )
          })}
         <Grid container spacing={2} direction="row" >
          {fuzzy.UnorderedWaypointMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
               <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
               <Card sx={{ maxWidth: 500 }} variant="outlined">
                 
                 <CardMedia
                   component="img"
                   image={`data:image/png;base64 , ${file.imgContent}`}/>
               </Card></Grid> }
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper>: null}
          
          
          
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {fuzzy.PointDeviationMonitor.length > 0 ? <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : A drone should not deviate more than {deviation != null ? deviation : 'X'} meters from its planned flight path</div>
          </Typography>
          <ul>
          {fuzzy.PointDeviationMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath, 'success'))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath, 'error'))}
                
                
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {fuzzy.PointDeviationMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                  <Card sx={{ maxWidth: 500 }} variant="outlined">
                    
                    <CardMedia
                      component="img"
                      image={`data:image/png;base64 , ${file.imgContent}`}/>
                  </Card>
                  </Grid>
                }
              </React.Fragment>
            )
          })}</Grid>
          </ul>

          <ul>
          {fuzzy.CircularDeviationMonitor.map(function(file, index) {
            return ( file.type=== 'text/plain' ? 
              <React.Fragment key={index}>
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
              </React.Fragment> : null
            ) 
          })}
          <Grid container spacing={2} direction="row" >
          {fuzzy.CircularDeviationMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null }

          
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {fuzzy.MinSepDistMonitor.length > 0 ?  <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          
            <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : Drones shall always maintain the separation distance of {horizontal != null ? horizontal : 'Y'} meters</div>
          </Typography>
          <ul>
          {fuzzy.MinSepDistMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                
                
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
                
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {fuzzy.MinSepDistMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null}
          {fuzzy.NoFlyZoneMonitor.length > 0 ?  <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : Drones entered in specified fly zones </div>
          </Typography>
          <ul>
          {fuzzy.NoFlyZoneMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}    
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {fuzzy.NoFlyZoneMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null}
      </Box>
                </Paper>
              )
            })}
          </React.Fragment>:null} </React.Fragment>: 
          <React.Fragment>
            <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {CollisionMonitor.length > 0 ?<Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
            <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test: Drones shall avoid collisions with other drones and the environment</div>
          </Typography>
          <ul>
          {CollisionMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                
                
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath, 'success'))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath, 'error'))}
                
                
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {CollisionMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null}
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {LandspaceMonitor.length > 0 ? <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test: Drone shall always land at safe locations</div>
          </Typography>
          <ul>
          {LandspaceMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                
                
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
                
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {LandspaceMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>

                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null}
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {UnorderedWaypointMonitor.length > 0 ? <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test: Drones shall reach all waypoints in the mission</div>
          </Typography>
          <ul>
          {UnorderedWaypointMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                
                  
                
                { (returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                
                  {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error")) }
                
                
              </React.Fragment>:null
            )
          })}
         <Grid container spacing={2} direction="row" >
          {UnorderedWaypointMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
               <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
               <Card sx={{ maxWidth: 500 }} variant="outlined">
                 
                 <CardMedia
                   component="img"
                    image={`data:image/png;base64 , ${file.imgContent}`}/>
               </Card></Grid> }
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper>: null}
          
          
          
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {PointDeviationMonitor.length > 0 ? <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : A drone should not deviate more than {deviation != null ? deviation : 'X'} meters from its planned flight path</div>
          </Typography>
          <ul>
          {PointDeviationMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                
                
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath, 'success'))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath, 'error'))}
                
                
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {PointDeviationMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                  <Card sx={{ maxWidth: 500 }} variant="outlined">
                    
                    <CardMedia
                      component="img"
                       image={`data:image/png;base64 , ${file.imgContent}`}/>
                  </Card>
                  </Grid>
                }
              </React.Fragment>
            )
          })}</Grid>
          </ul>

          
          
          <ul>
          {CircularDeviationMonitor.map(function(file, index) {
            return ( file.type=== 'text/plain' ? 
              <React.Fragment key={index}>
                
                
                
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
              </React.Fragment> : null
            ) 
          })}
          <Grid container spacing={2} direction="row" >
          {CircularDeviationMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null }

          
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}>
        {MinSepDistMonitor.length > 0 ?  <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          
            <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : Drones shall always maintain the separation distance of {horizontal != null ? horizontal : 'Y'} meters</div>
          </Typography>
          <ul>
          {MinSepDistMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                
                
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
                
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {MinSepDistMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null}
          {NoFlyZoneMonitor.length > 0 ?  <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : Drones entered in specified fly zones </div>
          </Typography>
          <ul>
          {NoFlyZoneMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}    
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {NoFlyZoneMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  
                <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                <Card sx={{ maxWidth: 500 }} variant="outlined">
                  
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null}
      </Box>
          </React.Fragment> }
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', m: 1 }}>
        <Paper elevation={3} sx={{ margin: '25px', padding: 2, width: '100%' }}>
          <Typography variant="h5" component="h2" sx={{ fontFamily: 'sans-serif', fontWeight: 700 }}>
            Interactable HTMLs
          </Typography>
          <ul>
            {resp.htmlFiles && resp.htmlFiles.length > 0 ? (
              resp.htmlFiles.map((htmlFile, index) => (
                <li key={index}>
                  <Link
                    href={`${BASE_URL}${encodeURI(htmlFile.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none', color: 'blue' }}
                  >
                    {htmlFile.name}
                  </Link>
                </li>
              ))
            ) : (
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                No HTML files available for interaction.
              </Typography>
            )}
          </ul>
        </Paper>
      </Box>
      
        <div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <img src={`data:image/png;base64, ${selectedImage}`} width="100%" />
            </Box>
        </Modal>
      </div>
    </div>
  );
}


