import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

export const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#87CEEB',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#87CEEB',
    color: 'black',
  },
}));

export const CloserTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    fontSize: '12px',
    color: '#87CEEB',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#87CEEB',
    color: 'black',
    inset: '-10px auto auto 0px',
  },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#71665E',
  color: 'white',
  '&:hover': {
    backgroundColor: '#8d7c70',
  },
}));

export const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d88100',
  color: 'white',
  '&:hover': {
    backgroundColor: '#ffa726',
  },
  '&.Mui-disabled': {
    backgroundColor: '#a35d00',
    color: '#ccc',
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: '#71665E',
  '& .MuiOutlinedInput-root': {
    '& .MuiInputBase-input': {
      padding: '6px 8px',
      fontSize: '1.2rem',
    },
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#8b4513',
  width: '200px',
  '&:hover': {
    backgroundColor: '#a0522d',
  },
}));

export const SignInButton = styled(Button)(({ theme }) => ({
  marginTop: '30px',
  marginBottom: '10px',
  backgroundColor: '#2a3b51',
  '&:hover': {
    backgroundColor: '#2a2b71',
  },
}));
