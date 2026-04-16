import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { useFilterStore } from '../stores/filter-store';
import type { Gender } from '../types';

import { GenderBand } from './gender-band';

function resetStore(gender: Gender | 'Both') {
  useFilterStore.setState({
    gender,
    letter: null,
    macroCategories: new Set(),
    rawCategories: new Set(),
    selectedNameTitle: null,
  });
}

const meta = {
  title: 'Browse/GenderBand',
  component: GenderBand,
  parameters: { layout: 'fullscreen' },
  beforeEach: () => {
    resetStore('Both');
  },
} satisfies Meta<typeof GenderBand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothSelected: Story = {};

export const MaleSelected: Story = {
  beforeEach: () => {
    resetStore('M');
  },
};

export const FemaleSelected: Story = {
  beforeEach: () => {
    resetStore('F');
  },
};

export const ClickSelectsFemale: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Female' }));
    await expect(useFilterStore.getState().gender).toBe('F');
  },
};
