import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderApp, screen } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import { CoverHero } from '../cover-hero';

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(),
}));
vi.mock('@/hooks/use-pointer-fine', () => ({
  usePointerFine: vi.fn(),
}));

const { useReducedMotion } = await import('@/hooks/use-reduced-motion');
const { usePointerFine } = await import('@/hooks/use-pointer-fine');

function setHooks({ reduce = false, fine = true } = {}) {
  vi.mocked(useReducedMotion).mockReturnValue(reduce);
  vi.mocked(usePointerFine).mockReturnValue(fine);
}

describe('CoverHero', () => {
  beforeEach(() => {
    setHooks();
  });

  it('splits the headline into two whitespace-nowrap spans', () => {
    renderApp(<CoverHero />);

    const needed = screen.getByText('I NEED');
    const aName = screen.getByText('A NAME');
    expect(needed.tagName).toBe('SPAN');
    expect(aName.tagName).toBe('SPAN');
    expect(needed).toHaveClass('whitespace-nowrap');
    expect(aName).toHaveClass('whitespace-nowrap');
  });

  it('renders a hero image sourced from BASE_URL', () => {
    renderApp(<CoverHero />);

    const img = screen.getByTestId('cover-hero-img');
    expect(img).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}cover-hero.jpg`,
    );
  });

  it('layers the dog in front of the text via z-index', () => {
    renderApp(<CoverHero />);

    const img = screen.getByTestId('cover-hero-img');
    expect(img.closest('.z-10')).not.toBeNull();

    const needed = screen.getByText('I NEED');
    expect(needed.closest('.z-0')).not.toBeNull();
  });

  it('fires goToResults when the hero is clicked', () => {
    renderApp(<CoverHero />);

    screen.getByRole('button', { name: /start browsing names/i }).click();

    const state = useFilterStore.getState();
    expect(state.gender).toBe('M');
    expect(state.letter).toBe('A');
  });

  it('attaches a mousemove listener when parallax is enabled', () => {
    setHooks({ reduce: false, fine: true });
    const addSpy = vi.spyOn(window, 'addEventListener');

    renderApp(<CoverHero />);

    const mousemoveCalls = addSpy.mock.calls.filter(
      ([type]) => type === 'mousemove',
    );
    expect(mousemoveCalls.length).toBeGreaterThan(0);

    addSpy.mockRestore();
  });

  it('skips the mousemove listener under prefers-reduced-motion', () => {
    setHooks({ reduce: true, fine: true });
    const addSpy = vi.spyOn(window, 'addEventListener');

    renderApp(<CoverHero />);

    const mousemoveCalls = addSpy.mock.calls.filter(
      ([type]) => type === 'mousemove',
    );
    expect(mousemoveCalls).toHaveLength(0);

    addSpy.mockRestore();
  });

  it('skips the mousemove listener on coarse-pointer devices', () => {
    setHooks({ reduce: false, fine: false });
    const addSpy = vi.spyOn(window, 'addEventListener');

    renderApp(<CoverHero />);

    const mousemoveCalls = addSpy.mock.calls.filter(
      ([type]) => type === 'mousemove',
    );
    expect(mousemoveCalls).toHaveLength(0);

    addSpy.mockRestore();
  });
});
