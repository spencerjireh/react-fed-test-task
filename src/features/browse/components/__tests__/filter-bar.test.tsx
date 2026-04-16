import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import type { RawCategory } from '../../types';
import { FilterBar } from '../filter-bar';

const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const OPTIMISTIC_ID = '019c8a34-3619-7134-a023-806d72219174';

const CATEGORIES_FIXTURE: RawCategory[] = [
  { id: CARTOON_ID, name: 'Cartoon', description: null },
  { id: OPTIMISTIC_ID, name: 'Optimistic', description: null },
];

describe('FilterBar', () => {
  beforeEach(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
    server.use(
      http.get('*/api/categories', () =>
        HttpResponse.json({ data: CATEGORIES_FIXTURE }),
      ),
    );
  });

  it('renders seven triggers with no strip initially', () => {
    renderApp(<FilterBar />);

    expect(
      screen.getByRole('button', { name: 'Filter by Famous' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: "Filter by Pet's size" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Filter by Joyful' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(7);
    expect(
      screen.queryByRole('group', { name: /categories$/ }),
    ).not.toBeInTheDocument();
  });

  it('clicking a trigger opens the checklist strip', async () => {
    renderApp(<FilterBar />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Filter by Famous' }),
    );

    expect(
      await screen.findByRole('group', { name: 'Famous categories' }),
    ).toBeInTheDocument();
  });

  it('clicking another trigger swaps the strip contents', async () => {
    renderApp(<FilterBar />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Filter by Famous' }),
    );
    await screen.findByRole('group', { name: 'Famous categories' });

    await userEvent.click(
      screen.getByRole('button', { name: 'Filter by Joyful' }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('group', { name: 'Famous categories' }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('group', { name: 'Joyful categories' }),
    ).toBeInTheDocument();
  });

  it('clicking the same trigger again closes the strip', async () => {
    renderApp(<FilterBar />);

    const trigger = screen.getByRole('button', { name: 'Filter by Famous' });
    await userEvent.click(trigger);
    await screen.findByRole('group', { name: 'Famous categories' });

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(
        screen.queryByRole('group', { name: 'Famous categories' }),
      ).not.toBeInTheDocument();
    });
  });

  it('Escape closes the strip', async () => {
    renderApp(<FilterBar />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Filter by Famous' }),
    );
    await screen.findByRole('group', { name: 'Famous categories' });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(
        screen.queryByRole('group', { name: 'Famous categories' }),
      ).not.toBeInTheDocument();
    });
  });

  it('clicking outside the section closes the strip', async () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);

    renderApp(<FilterBar />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Filter by Famous' }),
    );
    await screen.findByRole('group', { name: 'Famous categories' });

    await userEvent.click(outside);

    await waitFor(() => {
      expect(
        screen.queryByRole('group', { name: 'Famous categories' }),
      ).not.toBeInTheDocument();
    });

    outside.remove();
  });
});
