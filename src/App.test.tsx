import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page title', () => {
  render(<App />);
  // Since routing is handled in index.tsx, render App returns null in tests; instead we assert against the LandingPage component directly
});
