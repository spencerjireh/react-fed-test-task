import { render, screen } from '@testing-library/react';

import { App } from '../app';

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    expect(await screen.findByText('All pets names')).toBeInTheDocument();
  });
});
