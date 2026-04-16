import type { Meta, StoryObj } from '@storybook/react-vite';

import { BrowseLayout } from './browse-layout';

const meta = {
  title: 'Browse/BrowseLayout',
  component: BrowseLayout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BrowseLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Full walking-skeleton shell, MSW-seeded. Uses the global `handlers`
 * array from `.storybook/preview.tsx` — 679 names resolve through the
 * Service Worker and `NameList` hydrates them via TanStack Query.
 */
export const Default: Story = {};
