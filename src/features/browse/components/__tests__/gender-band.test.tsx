import { beforeEach, describe, expect, it } from 'vitest';

import {
  renderApp,
  screen,
  UrlSyncHarness as Harness,
  userEvent,
  waitFor,
} from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import { GenderBand } from '../gender-band';

describe('GenderBand', () => {
  beforeEach(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
  });

  it('renders three radios with the current gender checked', () => {
    renderApp(<GenderBand />);

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Both' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Male' })).not.toBeChecked();
  });

  it('clicking Male updates the store and URL', async () => {
    renderApp(
      <Harness>
        <GenderBand />
      </Harness>,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Male' }));

    expect(useFilterStore.getState().gender).toBe('M');
    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('g=M');
    });
  });

  it('clicking Both leaves the URL without a g= param (default elides)', async () => {
    useFilterStore.setState({ gender: 'F' });
    renderApp(
      <Harness>
        <GenderBand />
      </Harness>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('g=F');
    });

    await userEvent.click(screen.getByRole('radio', { name: 'Both' }));

    expect(useFilterStore.getState().gender).toBe('Both');
    await waitFor(() => {
      expect(screen.getByTestId('location')).not.toHaveTextContent('g=');
    });
  });

  it('ArrowRight from Male advances selection to Female', async () => {
    useFilterStore.setState({ gender: 'M' });
    renderApp(<GenderBand />);

    const male = screen.getByRole('radio', { name: 'Male' });
    male.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(useFilterStore.getState().gender).toBe('F');
    expect(screen.getByRole('radio', { name: 'Female' })).toBeChecked();
  });

  it('ArrowLeft wraps from Male to Both', async () => {
    useFilterStore.setState({ gender: 'M' });
    renderApp(<GenderBand />);

    screen.getByRole('radio', { name: 'Male' }).focus();
    await userEvent.keyboard('{ArrowLeft}');

    expect(useFilterStore.getState().gender).toBe('Both');
  });

  it('only the selected pill is tabbable (roving tabindex)', () => {
    useFilterStore.setState({ gender: 'F' });
    renderApp(<GenderBand />);

    expect(screen.getByRole('radio', { name: 'Female' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('radio', { name: 'Male' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
    expect(screen.getByRole('radio', { name: 'Both' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });
});
