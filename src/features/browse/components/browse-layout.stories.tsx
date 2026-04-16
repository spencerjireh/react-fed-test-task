import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

import { useFilterStore } from '../stores/filter-store';

import { BrowseLayout } from './browse-layout';

function Framed({ selectedId }: { selectedId: string | null }) {
  useEffect(() => {
    useFilterStore.setState({ selectedNameTitle: selectedId });
  }, [selectedId]);
  return <BrowseLayout />;
}

const meta = {
  title: 'Browse/BrowseLayout',
  component: Framed,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Framed>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cover state. Uses the global MSW handlers from `.storybook/preview.tsx`
 * (679 names). With `selectedNameTitle === null`, the hero replaces the
 * master-detail grid.
 */
export const CoverState: Story = {
  args: { selectedId: null },
};

/**
 * Master-detail state. `selectedNameTitle` is set so the list and detail
 * pane render in place of the hero.
 */
export const SelectedName: Story = {
  args: { selectedId: '019c8a34-3f34-70c8-8f5e-3657bb9b328b' },
};
