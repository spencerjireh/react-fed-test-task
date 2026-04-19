import { beforeEach, describe, expect, it } from 'vitest';

import {
  renderApp,
  screen,
  UrlSyncHarness as Harness,
  userEvent,
  waitFor,
} from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import { LetterStrip } from '../letter-strip';

describe('LetterStrip', () => {
  beforeEach(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
  });

  it('renders 26 tabs (A–Z) from the API', async () => {
    renderApp(<LetterStrip />);

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(26));
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

  it('ArrowRight from N selects O', async () => {
    useFilterStore.setState({ letter: 'N' });
    renderApp(<LetterStrip />);

    const n = await screen.findByRole('tab', { name: 'Filter by letter N' });
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
