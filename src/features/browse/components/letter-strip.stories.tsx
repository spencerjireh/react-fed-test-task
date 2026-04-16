import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { useFilterStore } from '../stores/filter-store';
import type { Letter } from '../types';

import { LetterStrip } from './letter-strip';

function resetStore(letter: Letter | null) {
  useFilterStore.setState({
    gender: 'Both',
    letter,
    macroCategories: new Set(),
    rawCategories: new Set(),
    selectedNameTitle: null,
  });
}

const meta = {
  title: 'Browse/LetterStrip',
  component: LetterStrip,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="bg-cream-light p-6">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    resetStore(null);
  },
} satisfies Meta<typeof LetterStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LetterSelected: Story = {
  beforeEach: () => {
    resetStore('C');
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
};

export const ClickSelectsLetter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('tab', { name: 'Filter by letter M' }),
    );
    await expect(useFilterStore.getState().letter).toBe('M');
  },
};
