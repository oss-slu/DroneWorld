import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders DroneWorld header text', () => {
  render(<App />);
  const header = screen.getByText(/DroneWorld/i);
  expect(header).toBeInTheDocument();
});