import { Link } from 'react-router-dom';

const commonButtonStyle = {
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  backgroundColor: 'white',
  color: '#8c8c8c',
  fontWeight: 300,
  fontSize: '14px',
};

const disabledButtonStyle = {
  ...commonButtonStyle,
  border: 'none',
  cursor: 'not-allowed',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: 'white',
  color: '#8c8c8c',
  fontWeight: 300,
  fontSize: '14px',
};

function Footer() {
  return (
    <>
      <div
        style={{
          ...containerStyle,
          gap: '12px',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <a
          href='https://oss-slu.github.io/projects/droneworld/about/'
          target='_blank'
          rel='noopener noreferrer'
          style={commonButtonStyle}
        >
          Documentation
        </a>

        <a
          href='https://github.com/oss-slu/DroneWorld/'
          target='_blank'
          rel='noopener noreferrer'
          style={commonButtonStyle}
        >
          GitHub
        </a>

        <button disabled aria-disabled='true' style={disabledButtonStyle}>
          Support
        </button>
      </div>

      <div style={containerStyle}>© 2024 DroneWorld. Built by OSS-SLU. All rights reserved.</div>
    </>
  );
}

export default Footer;
