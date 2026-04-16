import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory } from '../types';

import { FilterBar } from './filter-bar';

const DRINKS_ID = '019c8a34-35f6-70a9-bda7-5f0eaf8a07d5';

function resetStore(macros: Set<MacroCategory>, raws: Set<string>) {
  useFilterStore.setState({
    gender: 'Both',
    letter: null,
    macroCategories: macros,
    rawCategories: raws,
    selectedNameTitle: null,
  });
}

const meta = {
  title: 'Browse/FilterBar',
  component: FilterBar,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-cream-light pb-20 pt-6">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    resetStore(new Set(), new Set());
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActive: Story = {
  beforeEach: () => {
    resetStore(new Set<MacroCategory>(['Famous']), new Set([DRINKS_ID]));
  },
};

export const StripOpen: Story = {
  beforeEach: () => {
    resetStore(new Set(), new Set([DRINKS_ID]));
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /Filter by Food and drinks/i }),
    );
    await expect(
      await canvas.findByRole('checkbox', { name: /^Drinks$/ }),
    ).toBeChecked();
  },
};
