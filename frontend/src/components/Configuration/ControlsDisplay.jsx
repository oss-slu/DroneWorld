import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const mapControlDisplay = ({ mapControl }) => {
  if (!mapControl) {
    return null;
  }
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography
          sx={{
            backgroundColor: '#d88100',
            p: 0.5,
            paddingLeft: 2,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          {mapControl.header}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ p: 2, bgcolor: 'black' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {mapControl.body.map((control, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', marginRight: 5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 1 }}>
                {control.icon.map((iconUrl, idx) => (
                  <img key={idx} src={iconUrl} alt='Icon' style={{ width: 30, marginRight: 1 }} />
                ))}
              </Box>
              <Typography sx={{ color: 'orange', marginRight: 0.8, fontSize: 14 }}>
                {control.command}
              </Typography>
              <Typography sx={{ color: 'white', fontSize: 14 }}>{control.info}</Typography>
            </Box>
          ))}
        </Box>
      </Grid>
    </React.Fragment>
  );
};

mapControlDisplay.propTypes = {
  mapControl: PropTypes.object,
};
export default mapControlDisplay;