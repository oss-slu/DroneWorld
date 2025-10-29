import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BackendHealthTitle = ({ classes }) => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackendHealth = async () => {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      
      try {
        const response = await fetch(`${backendUrl}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setIsHealthy(true);
        } else {
          setIsHealthy(false);
        }
      } catch (error) {
        console.error('Backend health check failed:', error);
        setIsHealthy(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately on mount
    checkBackendHealth();

    // Optional: Check periodically (every 30 seconds)
    const interval = setInterval(checkBackendHealth, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const titleStyle = {
    color: isHealthy ? 'inherit' : 'red',
    transition: 'color 0.3s ease',
  };

  return (
    <Link 
      to="/" 
      className={classes.siteTitle}
      style={titleStyle}
      title={isChecking ? 'Checking backend...' : (isHealthy ? 'Backend connected' : 'Backend disconnected')}
    >
      Drone World
    </Link>
  );
};

BackendHealthTitle.propTypes = {
  classes: PropTypes.shape({
    siteTitle: PropTypes.string.isRequired,
  }).isRequired,
};

export default BackendHealthTitle;