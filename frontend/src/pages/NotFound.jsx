import React from 'react';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  height: 90vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const RemoveMarginPadding = {
  margin: 0,
  padding: 0,
};

function NotFound() {
  return (
    <NotFoundContainer>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '3em', ...RemoveMarginPadding }}>404 NOT FOUND</h2>
        <p style={{ fontSize: '1.5em', ...RemoveMarginPadding }}>
          The page you are looking for might be removed or is temporarily unavailable
        </p>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <Button
            variant='contained'
            sx={{
              color: 'white',
              padding: '15px 30px',
              borderRadius: '10px',
              marginTop: '1rem',
            }}
          >
            Back to Homepage
          </Button>
        </Link>
      </div>
    </NotFoundContainer>
  );
}

export default NotFound;
