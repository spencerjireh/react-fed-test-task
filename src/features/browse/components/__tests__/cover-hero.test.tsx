import { describe, expect, it } from 'vitest';

import { renderApp, screen } from '@/testing/test-utils';

import { CoverHero } from '../cover-hero';

describe('CoverHero', () => {
  it('renders the headline and a hero image sourced from BASE_URL', () => {
    renderApp(<CoverHero />);

    expect(screen.getByText(/I NEED\s+A NAME/)).toBeInTheDocument();

    const img = screen.getByTestId('cover-hero-img');
    expect(img).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}cover-hero.jpg`,
    );
  });
});
