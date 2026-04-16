import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../stores/filter-store';
import type { RawCategory } from '../types';

import { CategoryDropdown } from './category-dropdown';

const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const DISNEY_ID = '019c8a34-35f2-70b1-b866-69a4921d15a8';
const LITERARY_ID = '019c8a34-360b-735c-88e7-5d86357a91a2';

const FAMOUS_FIXTURE: RawCategory[] = [
  { id: CARTOON_ID, name: 'Cartoon', description: null },
  { id: DISNEY_ID, name: 'Disney', description: null },
  { id: LITERARY_ID, name: 'Literary', description: null },
];

// jsdom doesn't implement the pointer-capture / scrollIntoView APIs Radix uses.
function stubJsdomGaps() {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => undefined;
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => undefined;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => undefined;
  }
}

describe('CategoryDropdown', () => {
  beforeEach(() => {
    stubJsdomGaps();
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameId: null,
      page: 0,
    });
    server.use(
      http.get('*/api/categories', () =>
        HttpResponse.json({ data: FAMOUS_FIXTURE }),
      ),
    );
  });

  it('renders a trigger labeled "Filter by Famous" that starts closed', () => {
    renderApp(<CategoryDropdown macro="Famous" />);

    const trigger = screen.getByRole('button', { name: /Filter by Famous/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the menu and shows All + the 3 raws when the trigger is clicked', async () => {
    renderApp(<CategoryDropdown macro="Famous" />);

    await waitFor(() =>
      expect(useFilterStore.getState().macroCategories.size).toBe(0),
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Filter by Famous/i }),
    );

    await screen.findByRole('menu');

    const items = screen.getAllByRole('menuitemcheckbox');
    expect(items).toHaveLength(4);
    expect(
      screen.getByRole('menuitemcheckbox', { name: /All Famous/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Cartoon' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Disney' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Literary' }),
    ).toBeInTheDocument();
  });

  it('clicking "All Famous" toggles the macro in the store', async () => {
    renderApp(<CategoryDropdown macro="Famous" />);

    await userEvent.click(
      screen.getByRole('button', { name: /Filter by Famous/i }),
    );

    const allFamous = await screen.findByRole('menuitemcheckbox', {
      name: /All Famous/i,
    });
    expect(allFamous).not.toBeChecked();

    await userEvent.click(allFamous);

    await waitFor(() =>
      expect(useFilterStore.getState().macroCategories.has('Famous')).toBe(
        true,
      ),
    );
  });

  it('clicking a raw category toggles that raw id in the store', async () => {
    renderApp(<CategoryDropdown macro="Famous" />);

    await userEvent.click(
      screen.getByRole('button', { name: /Filter by Famous/i }),
    );

    const cartoon = await screen.findByRole('menuitemcheckbox', {
      name: 'Cartoon',
    });
    await userEvent.click(cartoon);

    await waitFor(() =>
      expect(useFilterStore.getState().rawCategories.has(CARTOON_ID)).toBe(
        true,
      ),
    );
  });

  it('keeps the menu open after toggling an item (supports multi-select)', async () => {
    renderApp(<CategoryDropdown macro="Famous" />);

    await userEvent.click(
      screen.getByRole('button', { name: /Filter by Famous/i }),
    );
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Cartoon' }),
    );
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Disney' }),
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(useFilterStore.getState().rawCategories.has(CARTOON_ID)).toBe(true);
    expect(useFilterStore.getState().rawCategories.has(DISNEY_ID)).toBe(true);
  });

  it('Escape closes the menu', async () => {
    renderApp(<CategoryDropdown macro="Famous" />);

    await userEvent.click(
      screen.getByRole('button', { name: /Filter by Famous/i }),
    );
    await screen.findByRole('menu');

    await userEvent.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });

  it('trigger styles as active when any raw in the macro is selected', async () => {
    useFilterStore.setState({
      rawCategories: new Set([CARTOON_ID]),
    });
    renderApp(<CategoryDropdown macro="Famous" />);

    await waitFor(() => {
      const trigger = screen.getByRole('button', { name: /Filter by Famous/i });
      expect(trigger).toHaveClass('text-red-main');
    });
  });
});
