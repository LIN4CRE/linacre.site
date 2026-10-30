import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Games from '../Games';

describe('Tabulous Games gateway', () => {
  it('renders the Tabulous Games launch link and redirect gateway', () => {
    render(<Games />);
    expect(screen.getByText('Launching Tabulous Games...')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Click here if not redirected automatically/i }),
    ).toHaveAttribute('href', '/games');
  });
});
