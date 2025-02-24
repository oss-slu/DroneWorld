import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Select from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Accordion from '@mui/material/Accordion';
import InputLabel from '@mui/material/InputLabel';

export const simulationMainBoxstyle = {
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7), rgba(128, 128, 128, 0.5)), url("/images/google-earth-3D.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed', /* Keeps the background fixed during scrolling */
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
};


export const StyledButton = styled(Button)`
  font-size: 18px;
  font-weight: bolder;
  color: white;
  background-color: #8B4513;
  width: 200px;
  &:hover {
    background-color: #A0522D;
  }
`;

export const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#F5F5DC',
  '& .MuiInputBase-input': {
    padding: '6px 8px',
    height: '1em',
  }
}));

export const StyledTab = styled(Tab)({
  textTransform: 'none',
  fontSize: 16,
  fontWeight: 'bold',
  marginRight: 8,
  // to-do: use global variables for tab colors
  color: '#8B4513', // Shade of brown
  backgroundColor: '#F5F5DC', // Beige background
  transition: 'background-color 0.3s, color 0.3s',
  '&:hover': {
    backgroundColor: '#DEB887', // Light brown when hovered
    color: '#FFFFFF',
  },
  '&.Mui-selected': {
    backgroundColor: '#A0522D', // Darker brown when selected
    color: '#FFFFFF',
    borderBottom: '5px solid #FFB500',
  },
});

export const StyledTabs = styled(Tabs)({
  minHeight: '48px',
  '.MuiTabs-indicator': {
    display: 'none',
  },
});


export const AccordionStyled = styled(Accordion)({
  width: '100%',
  padding: '5px',
  backgroundColor: 'transparent !important'
})


export const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  marginRight: 2,
  marginLeft: 20,
  flexShrink: 0,
  color: '#F5F5DC',
  width: '200px',
  fontSize: '1.2rem', fontFamily: 'Roboto, sans-serif',
}));