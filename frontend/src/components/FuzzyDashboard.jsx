import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List'
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import { useLocation } from "react-router-dom";
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia'
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';
import AlertTitle from '@mui/material/AlertTitle';
import { wait } from '@testing-library/user-event/dist/utils';
import Snackbar from '@mui/material/Snackbar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
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

export default function FuzzyDashboard() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const resp = location.state.data
  const deviation = location.state != null ? location.state.mainJson != null ? location.state.mainJson.monitors != null ?  
      location.state.mainJson.monitors.circular_deviation_monitor != null ? location.state.mainJson.monitors.circular_deviation_monitor.param[0] : null : null : null : null
  const horizontal = location.state != null ? location.state.mainJson != null ? location.state.mainJson.monitors != null ?  
      location.state.mainJson.monitors.min_sep_dist_monitor != null ? location.state.mainJson.monitors.min_sep_dist_monitor.param[0] : null : null : null : null
  const lateral = location.state != null ? location.state.mainJson != null ? location.state.mainJson.monitors != null ?  
      location.state.mainJson.monitors.min_sep_dist_monitor != null ? location.state.mainJson.monitors.min_sep_dist_monitor.param[1] : null : null : null  : null
  const [fileArray, setFileArray] = React.useState([])
  const [CircularDeviationMonitor, setCircularDeviationMonitor] = React.useState([])
  const [CollisionMonitor, setCollisionMonitor] = React.useState([])
  const [LandspaceMonitor, setLandspaceMonitor] = React.useState([])
  const [UnorderedWaypointMonitor, setUnorderedWaypointMonitor] = React.useState([])
  const [OrderedWaypointMonitor, setOrderedWaypointMonitor] = React.useState([])
  const [PointDeviationMonitor, setPointDeviationMonitor] = React.useState([])
  const [MinSepDistMonitor, setMinSepDistMonitor] = React.useState([])
  const [NoFlyZoneMonitor, setNoFlyZoneMonitor] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState();
  const [htmlLink, setHtmlLink] = React.useState();
  const [violation, setViolation] = React.useState(location.state.file.fail > 0 ? true : false)
  const [isFuzzyList, setIsFuzzyList] = React.useState(location.state.file.fuzzy);
  const [fuzzyTest, setFuzzyTest] = React.useState([]);
  const [fileName, setFileName] = React.useState(location.state.file.fileName)

  const names = [{name:0},{name:7},{name:14}]

  const handleOpen = (img) => {
    setOpen(true);
    setSelectedImage(img.imgContent)
    setHtmlLink(img.path)
  }
  const handleClose = (e, name) => {
      setOpen(false)
  };

  const redirectToReportDashboard = () => {
    navigate('/report-dashboard')
  }
  // const getInfoContents = (fileContents, keyMatch, droneMap) => {
  //   const content_array = fileContents.split("\n");
  //   let infoContent = [];
  //   content_array.map(content => {
  //     let content_split = content.split(";");
  //     if(content.includes(keyMatch) && content_split.length == 4) {
  //       if(keyMatch == "FAIL") {
  //         setViolation(true)
  //       }
  //       if(droneMap.get(content_split[2]) == null) {
  //         droneMap.set(content_split[2], [content_split[3]])
  //       } else {
  //         let val = []
  //         val = droneMap.get(content_split[2])
  //         val = val.concat([content_split[3]])
  //         droneMap.set(content_split[2], val)
  //       }
        
  //       infoContent.push(content_split[2] + ": " + content_split[3])
  //     }
  //   })
  //   return droneMap;
  // }
  const returnContentsItem = (colorCode, keyValue, info, icon, fuzzyValue, severity_val) => {
    for (const mapKey of Object.keys(info)) {
      console.log(mapKey);
      console.log(info[mapKey])
      let fuzzyValueArray = fuzzyValue.split("_")
      return (
      <React.Fragment>
        <Grid container spacing={2} direction="row" style={{fontFamily:"sans-serif"}}>
          <h4>{mapKey}</h4>&nbsp;&nbsp;
          </Grid>
        {info[mapKey].map((val, id) => {
        return (
          <React.Fragment key={keyValue} >
          <List key={keyValue}>
            <ListItem>
              <Alert variant="filled" severity={severity_val} style={{width:'100%'}}>
              {/* <AlertTitle>{mapKey} <span>&nbsp;&nbsp; Fuzzed Parameter : Wind Velocity = {fuzzyValueArray[2]} meters/second</span></AlertTitle> */}
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
  // const handleDirectorySelectFuzzy = () => {
  //   wait(1000);
  //   console.log('fuzztTestNames----- in handleDirectorySelectFuzzy', names)
  
  //   setFuzzyTest([]);
  //   names.map(id=> {
  //     let unordered=[];
  //     let circular = [];
  //   let collision = [];
  //   let landscape = [];
  //   let orderWay = [];
  //   let pointDev = [];
  //   let minSep = [];
  //   let nonFly = [];
  //     UnorderedWaypointMonitor.map(unorder => {
  //       console.log('UnorderedWaypointMonitor---', UnorderedWaypointMonitor)
  //       console.log('un  unorder.fuzzyValue', unorder.fuzzyValue)
  //       if(id.name == unorder.fuzzyValue) {
  //         console.log('inside unod')
  //         unordered.push(unorder)
  //       }
  //       console.log('unordered----', unordered)
  //     })
  //     CircularDeviationMonitor.map(circularDev => {
  //       if(id.name == circularDev.fuzzyValue) {
  //         circular.push(circularDev);
  //       }
  //     })
  //     CollisionMonitor.map(coll => {
  //       console.log('CollisionMonitor---', CollisionMonitor)
  //       if(id.name == coll.fuzzyValue) {
  //         collision.push(coll);
  //       }
  //     })
  //     LandspaceMonitor.map(land => {
  //       if(id.name == land.fuzzyValue) {
  //         landscape.push(land);
  //       }
  //     })
  //     OrderedWaypointMonitor.map( order => {
  //       if(id.name == order.fuzzyValue) {
  //         orderWay.push(order);
  //       }
  //     })
  //     PointDeviationMonitor.map(point => {
  //       if(id.name == point.fuzzyValue) {
  //         pointDev.push(point);
  //       }
  //     })
  //     MinSepDistMonitor.map(min => {
  //       if(id.name == min.fuzzyValue) {
  //         minSep.push(min);
  //       }
  //     })
  //     NoFlyZoneMonitor.map(zone => {
  //       if(id.name == zone.fuzzyVale) {
  //         nonFly.push(zone)
  //       }
  //     })
  //     setFuzzyTest(prevState => [
  //       ...prevState,
  //       {
  //           "name":id.name,
  //           "UnorderedWaypointMonitor": unordered,
  //           "CircularDeviationMonitor": circular,
  //           "CollisionMonitor" : collision,
  //           "LandspaceMonitor": landscape,
  //           "OrderedWaypointMonitor": orderWay,
  //           "PointDeviationMonitor": pointDev,
  //           "MinSepDistMonitor": minSep,
  //           "NoFlyZoneMonitor":nonFly
  //       }
  //     ])
  //   })
  // }


  useEffect(() => {
    if(isFuzzyList) {
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
    // handleDirectorySelectFuzzy()
  }, 
  //[UnorderedWaypointMonitor, CollisionMonitor, CircularDeviationMonitor, LandspaceMonitor, OrderedWaypointMonitor, PointDeviationMonitor, MinSepDistMonitor]
  [isFuzzyList])
    
  // React.useEffect(() => {}, [fileArray])
  // const handleDirectorySelect = (event) => {
  //   const files = event.target.files;
  //   let name = [];
  //   for (let i = 0; i < files.length; i++) {
  //     const fileReader = new FileReader();
  //     const file = files[i];
  //     console.log('file----', file)
  //     const data = [...fileArray]
  //     let path = file.webkitRelativePath
  //     let fuzzyPathValue = null
  //     let paths = path.split("/")
  //     console.log('paths----', paths)
  //     if(paths.length > 1) {
  //       fuzzyPathValue = paths[1]
  //       setIsFuzzyList(fuzzyPathValue.includes('Fuzzy')? true : false);
  //     }
  //     let fuzzyValueArray = fuzzyPathValue.split("_")
  //     let exist = false
  //     name.map(testName => {
  //       if(testName.name == fuzzyValueArray[2]) {
  //         exist = true;
  //       }
  //     }) 
  //     if(!exist) {
  //       name.push({name:fuzzyValueArray[2]})
  //     }
  //     console.log('fuzzyPathValue---', fuzzyPathValue)
  //     if (file.type === 'text/plain') {
  //       fileReader.onload = () => {
  //         const fileContents = fileReader.result;
  //         if(file.webkitRelativePath.includes("UnorderedWaypointMonitor")) {
  //           setUnorderedWaypointMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               content:fileContents,
  //               infoContent:getInfoContents(fileContents, "INFO", new Map()),
  //               passContent:getInfoContents(fileContents, "PASS", new Map()),
  //               failContent:getInfoContents(fileContents, "FAIL", new Map()),
  //               fuzzyPath:fuzzyPathValue,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("CircularDeviationMonitor")) {
  //           let info = getInfoContents(fileContents);
  //           console.log('info----', info)
  //           setCircularDeviationMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               content:fileContents,
  //               infoContent:getInfoContents(fileContents, "INFO", new Map()),
  //               passContent:getInfoContents(fileContents, "PASS", new Map()),
  //               failContent:getInfoContents(fileContents, "FAIL", new Map()),
  //               fuzzyPath:fuzzyPathValue,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("CollisionMonitor")) {
  //           setCollisionMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               content:fileContents,
  //               infoContent:getInfoContents(fileContents, "INFO", new Map()),
  //               passContent:getInfoContents(fileContents, "PASS", new Map()),
  //               failContent:getInfoContents(fileContents, "FAIL", new Map()),
  //               fuzzyPath:fuzzyPathValue,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("LandspaceMonitor")) {
  //           setLandspaceMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               content:fileContents,
  //               infoContent:getInfoContents(fileContents, "INFO", new Map()),
  //               passContent:getInfoContents(fileContents, "PASS", new Map()),
  //               failContent:getInfoContents(fileContents, "FAIL", new Map()),
  //               fuzzyPath:fuzzyPathValue,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("OrderedWaypointMonitor")) {
  //           setOrderedWaypointMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               content:fileContents,
  //               infoContent:getInfoContents(fileContents, "INFO", new Map()),
  //               passContent:getInfoContents(fileContents, "PASS", new Map()),
  //               failContent:getInfoContents(fileContents, "FAIL", new Map()),
  //               fuzzyPath:fuzzyPathValue,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("PointDeviationMonitor")) {
  //           setPointDeviationMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               content:fileContents,
  //               infoContent:getInfoContents(fileContents, "INFO", new Map()),
  //               passContent:getInfoContents(fileContents, "PASS", new Map()),
  //               failContent:getInfoContents(fileContents, "FAIL", new Map()),
  //               fuzzyPath:fuzzyPathValue,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("MinSepDistMonitor")) {
  //           setMinSepDistMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               content:fileContents,
  //               infoContent:getInfoContents(fileContents, "INFO", new Map()),
  //               passContent:getInfoContents(fileContents, "PASS", new Map()),
  //               failContent:getInfoContents(fileContents, "FAIL", new Map()),
  //               fuzzyPath:fuzzyPathValue,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("NoFlyZoneMonitor")) {
  //           setNoFlyZoneMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               content:fileContents,
  //               infoContent:getInfoContents(fileContents, "INFO", new Map()),
  //               passContent:getInfoContents(fileContents, "PASS", new Map()),
  //               failContent:getInfoContents(fileContents, "FAIL", new Map()),
  //               fuzzyPath:fuzzyPathValue,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
          
  //       };
  //       fileReader.readAsText(file);
  //     } else if (file.type === 'image/png') {
  //       console.log("its image")
  //       fileReader.onload = () => {
  //         const fileContents = fileReader.result;
  //         if(file.webkitRelativePath.includes("UnorderedWaypointMonitor")) {
  //           let htmlfile = file.webkitRelativePath.replace("_plot.png", "_interactive.html")
  //           setUnorderedWaypointMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               imgContent:URL.createObjectURL(file),
  //               path:htmlfile,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("CircularDeviationMonitor")) {
  //           let htmlfile = file.webkitRelativePath.replace("_plot.png", "_interactive.html")
  //           setCircularDeviationMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               imgContent:URL.createObjectURL(file),
  //               path:htmlfile,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("CollisionMonitor")) {
  //           let htmlfile = file.webkitRelativePath.replace("_plot.png", "_interactive.html")
  //           setCollisionMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               imgContent:URL.createObjectURL(file),
  //               path:htmlfile,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("LandspaceMonitor")) {
  //           let htmlfile = file.webkitRelativePath.replace("_plot.png", "_interactive.html")
  //           setLandspaceMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               imgContent:URL.createObjectURL(file),
  //               path:htmlfile,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("OrderedWaypointMonitor")) {
  //           let htmlfile = file.webkitRelativePath.replace("_plot.png", "_interactive.html")
  //           setOrderedWaypointMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               imgContent:URL.createObjectURL(file),
  //               path:htmlfile,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("PointDeviationMonitor")) {
  //           let htmlfile = file.webkitRelativePath.replace("_plot.png", "_interactive.html")
  //           setPointDeviationMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               imgContent:URL.createObjectURL(file),
  //               path:htmlfile,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("MinSepDistMonitor")) {
  //           let htmlfile = file.webkitRelativePath.replace("_plot.png", "_interactive.html")
  //           setMinSepDistMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               imgContent:URL.createObjectURL(file),
  //               path:htmlfile,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //         if(file.webkitRelativePath.includes("NoFlyZoneMonitor")) {
  //           let htmlfile = file.webkitRelativePath.replace("_plot.png", "_interactive.html")
  //           setNoFlyZoneMonitor(prevState => [
  //             ...prevState,
  //             {
  //               name:file.name,
  //               type:file.type,
  //               imgContent:URL.createObjectURL(file),
  //               path:htmlfile,
  //               fuzzyValue: fuzzyValueArray[2]
  //             }
  //           ])
  //         }
  //       }
  //       fileReader.readAsText(file);
  //     } else if (file.type === '') {
  //       const directoryReader = new FileReader();
  //       directoryReader.onload = () => {
  //         handleDirectorySelect({target: {files: directoryReader.result}});
  //       };
  //       directoryReader.readAsArrayBuffer(file);
  //     }
  //   }
  //   // setTestNames([name]);
  //   console.log('name----', name)
  //   // handleDirectorySelectFuzzy(name);
  // }
  const [folderDirectories, setFolderDirectories] = useState([]);
  // const componenet = () => {
  //   const handleDirectorySelect = (selectedFiles) => {
  //   console.log('Selected Files:', selectedFiles);
  // }
  
  // };


  // const [snackBarState, setSnackBarState] = React.useState({
  //   open: false,
  // });

  // const handleSnackBarVisibility = (val) => {
  //   setSnackBarState(prevState => ({
  //     ...prevState,
  //     open: val
  //   }))
  // }
  // const handleClickAway = () => {
  //   // Prevent closing when clicking outside the box
  //   handleSnackBarVisibility(true);
  // };
  // useEffect(() => {
  //   // Trigger the Snackbar to be open when the component mounts
  //   handleSnackBarVisibility(true);
  // }, []);
  return (
    <div>
    {/* <Snackbar
      open={snackBarState.open}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={60000}
      onClose={() => handleSnackBarVisibility(false)}
    >
      <Alert
        onClose={() => handleSnackBarVisibility(false)}
        severity="info"
        sx={{ maxHeight: '150px', maxWidth: '40%' }}
      >
        {"Enhancements to the view test report details are in progress! As we are implementing new features, please use the “SELECT SIMULATION DATA DIRECTORY” button to select the files you wish to upload. These files should be located within the ‘Airsim’ folder under your Documents folder on your local machine. You can either upload the entire ‘reports’ folder to access all results or choose specific folders for each test you want to upload."}
      </Alert>
    </Snackbar> */}
      <Box>
      <Typography variant="h4" style={{textAlign:'center', padding:'10px', fontWeight: 700, marginTop: '5px'}}>
        {fileName} Detailed Report
        <Container maxWidth="sm" style={{padding:'10px', alignContent:'center'}}>
        {/* <Paper variant="outlined" square style={{textAlign:'center', padding:'10px'}}> */}
        {/* <div>UPLOAD FILE CONTENTS</div><br/><br/> */}
        {/* <Button variant="contained" component="label">
        Select Simulation Data Directory
        <input hidden type="file" webkitdirectory="" multiple onChange={handleDirectorySelect} />
        </Button> */}
      </Container>
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
          {/* <Link style={{cursor:'pointer', fontSize:'20px', paddingRight: '15px'}} onClick={redirectToReportDashboard}>Back</Link> */}
        {/* </Container> */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
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
                
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
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
                {/* {file.infoContent.map((info, i) => { */}
                  {/* {(returnContentsItem('blue', index, file.infoContent, <InfoIcon/>))} */}
                {/* })} */}
                { (returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {/* {file.failContent.map((info, i) => { */}
                  {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error")) }
                {/* })} */}
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                 {/* <img src={file.imgContent} width="30%"/> */}
                 <CardMedia
                   component="img"
                   image={`data:image/png;base64 , ${file.imgContent}`}/>
               </Card></Grid> }
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper>: null}
          {/* {fuzzy.OrderedWaypointMonitor.length > 0 ? <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test: Drones must reach all their waypoints in  order</div>
          </Typography>
          <ul> */}
          {/* {fuzzy.OrderedWaypointMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>))}
                
                </React.Fragment>:null
            )
          })} */}
          {/* {fuzzy.OrderedWaypointMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null : <img src={file.imgContent} width="30%"/>}
              </React.Fragment>
            )
          })}
          </ul>
          </Paper> : null} */}
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
                
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {fuzzy.PointDeviationMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                  <Card sx={{ maxWidth: 500 }} variant="outlined">
                    {/* <img src={file.imgContent} width="30%"/> */}
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
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null }

          {/* </Paper> */}
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
          {/*<div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : Drones shall always maintain the lateral distance of {lateral != null ? lateral : 'X'} meters and separation distance of {horizontal != null ? horizontal : 'Y'} meters</div>*/}
            <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : Drones shall always maintain the separation distance of {horizontal != null ? horizontal : 'Y'} meters</div>
          </Typography>
          <ul>
          {fuzzy.MinSepDistMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                {/* {file.infoContent.map((info, i) => {
                  return (returnContentsItem('blue', i, info, <InfoIcon/>))
                })} */}
                {/* {file.passContent.map((info, i) => {
                  return (returnContentsItem('darkgreen', i, info, <CheckIcon />))
                })}
                {file.failContent.map((info, i) => {
                  return (returnContentsItem('darkred', i, info, <ClearIcon/>))
                })} */}
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
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
                {/* {file.infoContent.map((info, i) => {
                  return (returnContentsItem('blue', i, info, <InfoIcon/>))
                })} */}
                {/* {file.passContent.map((info, i) => {
                  return (returnContentsItem('darkgreen', i, info, <CheckIcon />))
                })}
                {file.failContent.map((info, i) => {
                  return (returnContentsItem('darkred', i, info, <ClearIcon/>))
                })} */}
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath, 'success'))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath, 'error'))}
                
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
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
                {/* {file.infoContent.map((info, i) => {
                  return (returnContentsItem('blue', i, info, <InfoIcon/>))
                })} */}
                {/* {file.passContent.map((info, i) => {
                  return (returnContentsItem('darkgreen', i, info, <CheckIcon />))
                })}
                {file.failContent.map((info, i) => {
                  return (returnContentsItem('darkred', i, info, <ClearIcon/>))
                })} */}
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
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
                {/* {file.infoContent.map((info, i) => { */}
                  {/* {(returnContentsItem('blue', index, file.infoContent, <InfoIcon/>))} */}
                {/* })} */}
                { (returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {/* {file.failContent.map((info, i) => { */}
                  {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error")) }
                {/* })} */}
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                 {/* <img src={file.imgContent} width="30%"/> */}
                 <CardMedia
                   component="img"
                    image={`data:image/png;base64 , ${file.imgContent}`}/>
               </Card></Grid> }
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper>: null}
          {/* {OrderedWaypointMonitor.length > 0 ? <Paper elevation={3} style={{margin:'25px', padding:20}}>
          <Typography variant="h5" component="h2">
          <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test: Drones must reach all their waypoints in  order</div>
          </Typography>
          <ul> */}
          {/* {OrderedWaypointMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>))}
                
                </React.Fragment>:null
            )
          })} */}
          {/* {OrderedWaypointMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null : <img src={file.imgContent} width="30%"/>}
              </React.Fragment>
            )
          })}
          </ul>
          </Paper> : null} */}
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
                {/* {file.infoContent.map((info, i) => {
                  return (returnContentsItem('blue', i, info, <InfoIcon/>))
                })} */}
                {/* {file.passContent.map((info, i) => {
                  return (returnContentsItem('darkgreen', i, info, <CheckIcon />))
                })}
                {file.failContent.map((info, i) => {
                  return (returnContentsItem('darkred', i, info, <ClearIcon/>))
                })} */}
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath, 'success'))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath, 'error'))}
                
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
              </React.Fragment>:null
            )
          })}
          <Grid container spacing={2} direction="row" >
          {PointDeviationMonitor.map(function(file, index) {
            return (
              <React.Fragment key={index}>
                {file.type === 'text/plain' ?  null :  <Grid item xs={4} style={{cursor:'pointer'}} onClick={() => handleOpen(file)}>
                  <Card sx={{ maxWidth: 500 }} variant="outlined">
                    {/* <img src={file.imgContent} width="30%"/> */}
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

          {/* <Paper elevation={3} style={{margin:'25px', padding:20}}> */}
          {/* <Typography variant="h5" component="h2">
          Circular Deviation Monitor
          </Typography> */}
          <ul>
          {CircularDeviationMonitor.map(function(file, index) {
            return ( file.type=== 'text/plain' ? 
              <React.Fragment key={index}>
                {/* {file.infoContent.map((info, i) => {
                  return (returnContentsItem('blue', i, info, <InfoIcon/>))
                })} */}
                {/* {file.passContent.map((info, i) => {
                  return (returnContentsItem('darkgreen', i, file.passContent, <CheckIcon />))
                })} */}
                {/* {file.failContent.map((info, i) => {
                  return (returnContentsItem('darkred', i, file.failContent, <ClearIcon/>))
                })} */}
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
                  <CardMedia
                    component="img"
                     image={`data:image/png;base64 , ${file.imgContent}`}/>
                </Card></Grid>}
              </React.Fragment>
            )
          })}</Grid>
          </ul>
          </Paper> : null }

          {/* </Paper> */}
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
          {/*<div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : Drones shall always maintain the lateral distance of {lateral != null ? lateral : 'X'} meters and separation distance of {horizontal != null ? horizontal : 'Y'} meters</div>*/}
            <div style={{fontFamily: 'sans-serif', fontWeight: 700}}>Acceptance Test : Drones shall always maintain the separation distance of {horizontal != null ? horizontal : 'Y'} meters</div>
          </Typography>
          <ul>
          {MinSepDistMonitor.map(function(file, index) {
            return (file.type=== 'text/plain' ?
              <React.Fragment key={index}>
                {/* {file.infoContent.map((info, i) => {
                  return (returnContentsItem('blue', i, info, <InfoIcon/>))
                })} */}
                {/* {file.passContent.map((info, i) => {
                  return (returnContentsItem('darkgreen', i, info, <CheckIcon />))
                })}
                {file.failContent.map((info, i) => {
                  return (returnContentsItem('darkred', i, info, <ClearIcon/>))
                })} */}
                {(returnContentsItem('darkgreen', index, file.passContent, <CheckIcon />, file.fuzzyPath,"success"))}
                {(returnContentsItem('darkred', index, file.failContent, <ClearIcon/>, file.fuzzyPath,"error"))}
                
                {/* {file.type === 'text/plain' ?  <ListItem ><AdjustIcon/><ListItemText primary={file.content} /></ListItem> : null} */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
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
                  {/* <img src={file.imgContent} width="30%"/> */}
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
                    href={`http://localhost:5000/${encodeURI(htmlFile.url)}`}
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
      {/* end of fuzzy  */}
        <div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <img src={`data:image/png;base64, ${selectedImage}`} width="100%" />
                {/* <a href={htmlLink}>Redirect to Html page</a> */}
            </Box>
        </Modal>
      </div>
    </div>
  );
}