import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode, Ref } from 'react';
import { useImperativeHandle } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFilterStore } from '@/features/browse/stores/filter-store';

import { App } from '../app';

// Virtuoso measures its viewport; in jsdom that yields zero height and no rows.
// Stub it to render every row inline so queries resolve without scrolling.
interface StubVirtuosoProps<T> {
  ref?: Ref<{
    scrollToIndex: (...args: unknown[]) => void;
    scrollIntoView: (...args: unknown[]) => void;
  }>;
  data: T[];
  itemContent: (index: number, item: T) => ReactNode;
}

vi.mock('react-virtuoso', () => ({
  Virtuoso: <T,>({ ref, data, itemContent }: StubVirtuosoProps<T>) => {
    useImperativeHandle(
      ref,
      () => ({ scrollToIndex: vi.fn(), scrollIntoView: vi.fn() }),
      [],
    );
    return (
      <div data-testid="virtuoso">
        {data.map((item, i) => (
          <div key={i}>{itemContent(i, item)}</div>
        ))}
      </div>
    );
  },
}));

describe('App', () => {
  beforeEach(() => {
    // computeInitialState reads window.location.search once on module load;
    // reset it so tests don't leak URL params into each other.
    window.history.replaceState({}, '', '/');
  });

  it('renders without crashing', async () => {
    render(<App />);
    expect(await screen.findByText('All pets names')).toBeInTheDocument();
  });

  it('runs the full gender → letter → select → detail pipeline', async () => {
    // The cover hero hides the name list until something is selected. Seed
    // the store instead of the URL — useFilterUrlSync writes store → URL on
    // mount, which would wipe any replaceState we did here.
    const achillesId = '019c8a34-3f3a-7005-b2be-2b9d662a9294';
    useFilterStore.setState({ selectedNameId: achillesId });

    render(<App />);

    await screen.findByRole('button', { name: 'Andromeda' });
    expect(
      screen.getByRole('button', { name: 'Achilles' }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: 'Male' }));
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Andromeda' }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', { name: 'Achilles' }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('tab', { name: /Filter by letter A/i }),
    );
    await waitFor(() => {
      expect(window.location.search).toMatch(/g=M.*l=A|l=A.*g=M/);
    });

    await userEvent.click(screen.getByRole('button', { name: 'Aaron' }));

    expect(
      await screen.findByRole('heading', { name: 'Aaron', level: 2 }),
    ).toBeInTheDocument();
    expect(window.location.search).toMatch(/n=[^&]+/);
  });
});
