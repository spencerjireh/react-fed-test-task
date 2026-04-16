import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory } from '../types';

import { FilterBar } from './filter-bar';

const DRINKS_ID = '019c8a34-35f6-70a9-bda7-5f0eaf8a07d5';

interface FramedProps {
  macros: Set<MacroCategory>;
  raws: Set<string>;
  initialOpenMacro?: MacroCategory | null;
}

function Framed({ macros, raws, initialOpenMacro = null }: FramedProps) {
  useEffect(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: macros,
      rawCategories: raws,
      selectedNameTitle: null,
    });
  }, [macros, raws]);

  return (
    <div className="min-h-[200px] bg-cream-light pb-20 pt-6">
      <FilterBar initialOpenMacro={initialOpenMacro} />
    </div>
  );
}

const meta = {
  title: 'Browse/FilterBar',
  component: Framed,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Framed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    macros: new Set(),
    raws: new Set(),
  },
};

export const WithActive: Story = {
  args: {
    macros: new Set<MacroCategory>(['Famous']),
    raws: new Set([DRINKS_ID]),
  },
};

export const StripOpen: Story = {
  args: {
    macros: new Set(),
    raws: new Set([DRINKS_ID]),
    initialOpenMacro: 'Food and drinks',
  },
};
