/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders DroneWorld header text', () => {
  render(<App />);
  const header = screen.getByText(/Drone World/i);
  expect(header).toBeInTheDocument();
});

test('About Us link exists and routes to /aboutus', () => {
  render(<App />);
  const aboutUsLink = screen.getByRole('link', { name: /about us/i });
  expect(aboutUsLink).toBeInTheDocument();
  expect(aboutUsLink).toHaveAttribute('href', '/aboutus');
});