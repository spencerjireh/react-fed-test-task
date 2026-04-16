import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import type { RawCategory } from '../../types';
import { CategoryChecklistStrip } from '../category-checklist-strip';

// Shuffled order to exercise the in-component alpha sort.
const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const DISNEY_ID = '019c8a34-35f2-70b1-b866-69a4921d15a8';
const LITERARY_ID = '019c8a34-360b-735c-88e7-5d86357a91a2';

const FAMOUS_FIXTURE: RawCategory[] = [
  { id: LITERARY_ID, name: 'Literary', description: null },
  { id: CARTOON_ID, name: 'Cartoon', description: null },
  { id: DISNEY_ID, name: 'Disney', description: null },
];

describe('CategoryChecklistStrip', () => {
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
      http.get('*/api/categories', () =>
        HttpResponse.json({ data: FAMOUS_FIXTURE }),
      ),
    );
  });

  it('renders "All Famous" plus a checkbox per raw category', async () => {
    renderApp(<CategoryChecklistStrip macro="Famous" />);

    const allFamous = await screen.findByRole('checkbox', {
      name: 'All Famous',
    });
    expect(allFamous).toBeInTheDocument();
    expect(
      await screen.findByRole('checkbox', { name: 'Cartoon' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('checkbox', { name: 'Disney' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('checkbox', { name: 'Literary' }),
    ).toBeInTheDocument();
  });

  it('lists the raws alphabetically regardless of server order', async () => {
    renderApp(<CategoryChecklistStrip macro="Famous" />);

    await screen.findByRole('checkbox', { name: 'Cartoon' });

    const labels = screen.getAllByRole('checkbox').map((input) => {
      const label = input.closest('label');
      return label?.textContent?.trim();
    });
    // First item is "All Famous"; the raws follow in A-Z order.
    expect(labels).toEqual(['All Famous', 'Cartoon', 'Disney', 'Literary']);
  });

  it('clicking "All Famous" toggles the macro in the store', async () => {
    renderApp(<CategoryChecklistStrip macro="Famous" />);

    await userEvent.click(
      await screen.findByRole('checkbox', { name: 'All Famous' }),
    );

    await waitFor(() =>
      expect(useFilterStore.getState().macroCategories.has('Famous')).toBe(
        true,
      ),
    );
  });

  it('clicking a raw checkbox toggles that raw id in the store', async () => {
    renderApp(<CategoryChecklistStrip macro="Famous" />);

    await userEvent.click(
      await screen.findByRole('checkbox', { name: 'Cartoon' }),
    );

    await waitFor(() =>
      expect(useFilterStore.getState().rawCategories.has(CARTOON_ID)).toBe(
        true,
      ),
    );
  });

  it('reflects existing store state on mount', async () => {
    useFilterStore.setState({
      rawCategories: new Set([DISNEY_ID]),
    });
    renderApp(<CategoryChecklistStrip macro="Famous" />);

    const disney = await screen.findByRole('checkbox', { name: 'Disney' });
    expect(disney).toBeChecked();
    const cartoon = await screen.findByRole('checkbox', { name: 'Cartoon' });
    expect(cartoon).not.toBeChecked();
  });

  it('toggles independently across multiple clicks (strip stays mounted)', async () => {
    renderApp(<CategoryChecklistStrip macro="Famous" />);

    await userEvent.click(
      await screen.findByRole('checkbox', { name: 'Cartoon' }),
    );
    await userEvent.click(
      await screen.findByRole('checkbox', { name: 'Disney' }),
    );

    await waitFor(() => {
      expect(useFilterStore.getState().rawCategories.has(CARTOON_ID)).toBe(
        true,
      );
      expect(useFilterStore.getState().rawCategories.has(DISNEY_ID)).toBe(true);
    });
    // The strip itself is still in the tree — parent, not strip, owns open/close.
    expect(
      screen.getByRole('group', { name: 'Famous categories' }),
    ).toBeInTheDocument();
  });
});
