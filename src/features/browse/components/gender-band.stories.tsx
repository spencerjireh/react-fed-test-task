import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { Gender } from '../types';

import { GenderBand } from './gender-band';

function Framed({ initialGender }: { initialGender: Gender | 'Both' }) {
  useEffect(() => {
    useFilterStore.setState({
      gender: initialGender,
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
  }, [initialGender]);
  return <GenderBand />;
}

const meta = {
  title: 'Browse/GenderBand',
  component: Framed,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Framed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothSelected: Story = {
  args: { initialGender: 'Both' },
};

export const MaleSelected: Story = {
  args: { initialGender: 'M' },
};

export const FemaleSelected: Story = {
  args: { initialGender: 'F' },
};
