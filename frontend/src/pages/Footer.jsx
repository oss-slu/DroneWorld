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
          backgroundColor: '#f0f0f0',
          fontSize: '42px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 400,
          padding: '20px 0 20px 0',
        }}
      >
        <p style={{ color: 'black', marginLeft: '20px', margin: '0 0 0 20px' }}>
          Ready to start simulating?
        </p>
        <p style={{ color: 'blue', marginLeft: '20px', margin: '0 0 0 20px' }}>
          Create your first test scenario today.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginLeft: '20px',
            marginTop: '16px',
          }}
        >
          <Link to='/home'>
            <button
              id='get-started-button'
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Get Started
            </button>
          </Link>
          <Link to='https://oss-slu.github.io/projects/droneworld/about/'>
            <button
              id='view-documentation-button'
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                border: '1px solid white',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              View Documentation
            </button>
          </Link>
        </div>
      </div>
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
