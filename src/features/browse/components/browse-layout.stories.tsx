import type { Meta, StoryObj } from '@storybook/react-vite';

import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory } from '../types';

import { BrowseLayout } from './browse-layout';

const DEFAULTS = {
  gender: 'Both' as const,
  letter: null,
  macroCategories: new Set<MacroCategory>(),
  rawCategories: new Set<string>(),
  selectedNameTitle: null,
};

const meta = {
  title: 'Browse/BrowseLayout',
  component: BrowseLayout,
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    useFilterStore.setState({ ...DEFAULTS });
  },
} satisfies Meta<typeof BrowseLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CoverState: Story = {};

export const SelectedName: Story = {
  beforeEach: () => {
    useFilterStore.setState({ ...DEFAULTS, selectedNameTitle: 'Aaron' });
  },
};
