import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { useEffect } from 'react';

import { useFilterStore } from '../stores/filter-store';

import { NameList } from './name-list';

/**
 * Wrap the list in a column-sized container so Virtuoso measures correctly
 * in the Storybook canvas (target: 352px wide).
 */
function Framed() {
  // Reset filter state per story render so a story that tweaks the store
  // doesn't leak state across navigations.
  useEffect(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameId: null,
      page: 0,
    });
  }, []);

  return (
    <div className="w-[352px] bg-cream-light p-6">
      <NameList />
    </div>
  );
}

const meta = {
  title: 'Browse/NameList',
  component: Framed,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Framed>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default loaded state — uses the global MSW handlers (679 real names).
 */
export const Loaded: Story = {};

/**
 * Empty state — handler override returns zero names. Self-documenting
 * via the MSW layer rather than via store-state tricks.
 */
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/names', () => HttpResponse.json({ data: [] })),
      ],
    },
  },
};

/**
 * Loading state — handler never resolves, so the query stays pending and
 * the 11-row skeleton is visible.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/names', () => new Promise(() => {}))],
    },
  },
};
