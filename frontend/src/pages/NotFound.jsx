import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import NotFoundImage from '../Assets/Images/NotFound.svg';

const NotFoundContainer = styled.div`
  height: calc(100vh - 5.3em);
  width: 100vw;
  align-items: center;
  justify-content: space-between;
  display: block;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: row-reverse;
  }
`;

const NotFoundImgContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5px;

  @media (min-width: 768px) {
    width: 50%;
    padding: 50px;
    height: 100%;
  }

  @media (min-width: 600px) and (max-width: 1024px) {
    padding: 10px;
  }
`;

const NotFoundMessage = styled.div`
  width: 100%;
  padding: 0;

  @media (min-width: 768px) {
    width: 50%;
    padding: 50px;
  }

  @media (min-width: 600px) and (max-width: 1024px) {
    padding: 10px;
  }
`;

const NotFoundChild = styled.div`
  width: 90%;
  margin: auto;

  @media (min-width: 768px) {
    width: 70%;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    width: 80%;
  }
`;

const RemoveMarginPadding = {
  margin: '0 0 20px 0',
  padding: 0,
};

function NotFound() {
  return (
    <NotFoundContainer>
      <NotFoundImgContainer>
        <img src={NotFoundImage} alt='' />
      </NotFoundImgContainer>
      <NotFoundMessage>
        <NotFoundChild>
          <h2 style={{ fontSize: '2em', ...RemoveMarginPadding }}>Something is not right...</h2>
          <p style={{ fontSize: '16px' }}>
            The page you are trying to open does not exist. You may have mistyped the address, or
            the page may have been moved to a different URL. If you believe this is an error, please
            contact support.
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
        </NotFoundChild>
      </NotFoundMessage>
    </NotFoundContainer>
  );
}

export default NotFound;
