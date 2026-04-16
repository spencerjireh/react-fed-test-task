import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { Letter } from '../types';

import { LetterStrip } from './letter-strip';

function Framed({ initialLetter }: { initialLetter: Letter | null }) {
  useEffect(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: initialLetter,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
  }, [initialLetter]);
  return (
    <div className="bg-cream-light p-6">
      <LetterStrip />
    </div>
  );
}

const meta = {
  title: 'Browse/LetterStrip',
  component: Framed,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Framed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initialLetter: null },
};

export const LetterSelected: Story = {
  args: { initialLetter: 'C' },
};

export const Mobile: Story = {
  args: { initialLetter: null },
  globals: { viewport: { value: 'mobile1' } },
};
