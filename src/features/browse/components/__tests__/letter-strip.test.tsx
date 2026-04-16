import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import { useFilterUrlSync } from '../../stores/use-filter-url-sync';
import type { RawName } from '../../types';
import { LetterStrip } from '../letter-strip';

// Cover A-Z so only Ñ is disabled.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const FIXTURE: RawName[] = ALPHABET.split('').map((ch) => ({
  id: `${ch.toLowerCase()}-id`,
  title: `${ch}name`,
  definition: `<p>${ch}name</p>`,
  gender: ['F'],
  categories: [],
}));

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">{location.pathname + location.search}</div>
  );
}

function Harness({ children }: { children: ReactNode }) {
  useFilterUrlSync();
  return (
    <>
      <LocationProbe />
      {children}
    </>
  );
}

describe('LetterStrip', () => {
  beforeEach(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
      page: 0,
    });
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
  });

  it('renders 27 tabs (A–Z plus Ñ)', async () => {
    renderApp(<LetterStrip />);

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(27));
  });

  it('marks Ñ as aria-disabled once data resolves', async () => {
    renderApp(<LetterStrip />);

    const n = await screen.findByRole('tab', { name: 'Filter by letter Ñ' });
    await waitFor(() => expect(n).toHaveAttribute('aria-disabled', 'true'));
  });

  it('clicking C sets letter to C and updates the URL', async () => {
    renderApp(
      <Harness>
        <LetterStrip />
      </Harness>,
    );

    const c = await screen.findByRole('tab', { name: 'Filter by letter C' });
    await userEvent.click(c);

    expect(useFilterStore.getState().letter).toBe('C');
    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('l=C');
    });
  });

  it('clicking the selected letter toggles the filter off', async () => {
    useFilterStore.setState({ letter: 'C' });
    renderApp(
      <Harness>
        <LetterStrip />
      </Harness>,
    );

    const c = await screen.findByRole('tab', { name: 'Filter by letter C' });
    await userEvent.click(c);

    expect(useFilterStore.getState().letter).toBeNull();
    await waitFor(() => {
      expect(screen.getByTestId('location')).not.toHaveTextContent('l=');
    });
  });

  it('clicking Ñ does nothing', async () => {
    renderApp(<LetterStrip />);

    const n = await screen.findByRole('tab', { name: 'Filter by letter Ñ' });
    await waitFor(() => expect(n).toHaveAttribute('aria-disabled', 'true'));
    await userEvent.click(n);

    expect(useFilterStore.getState().letter).toBeNull();
  });

  it('ArrowRight from N skips disabled Ñ and selects O', async () => {
    useFilterStore.setState({ letter: 'N' });
    renderApp(<LetterStrip />);

    const n = await screen.findByRole('tab', { name: 'Filter by letter N' });
    await waitFor(() =>
      expect(
        screen.getByRole('tab', { name: 'Filter by letter Ñ' }),
      ).toHaveAttribute('aria-disabled', 'true'),
    );
    n.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(useFilterStore.getState().letter).toBe('O');
  });

  it('only one tab is in the tab order at a time (roving tabindex)', async () => {
    useFilterStore.setState({ letter: 'D' });
    renderApp(<LetterStrip />);

    await screen.findByRole('tab', { name: 'Filter by letter D' });

    const tabbable = screen
      .getAllByRole('tab')
      .filter((el) => el.getAttribute('tabindex') === '0');
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveAccessibleName('Filter by letter D');
  });
});
