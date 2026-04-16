import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { useFilterStore } from '../stores/filter-store';
import type { Gender, Letter, MacroCategory } from '../types';

import { EmptyResults } from './empty-results';

const OPTIMISTIC_ID = '019c8a34-3619-7134-a023-806d72219174';

interface SeedInput {
  gender: Gender | 'Both';
  letter: Letter | null;
  macros: Set<MacroCategory>;
  raws: Set<string>;
}

function seed({ gender, letter, macros, raws }: SeedInput) {
  useFilterStore.setState({
    gender,
    letter,
    macroCategories: macros,
    rawCategories: raws,
    selectedNameTitle: null,
  });
}

const meta = {
  title: 'Browse/EmptyResults',
  component: EmptyResults,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="flex min-h-[500px] items-center justify-center bg-cream-light p-8">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    seed({
      gender: 'Both',
      letter: null,
      macros: new Set(),
      raws: new Set(),
    });
  },
} satisfies Meta<typeof EmptyResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GenderOnly: Story = {
  beforeEach: () => {
    seed({
      gender: 'F',
      letter: null,
      macros: new Set(),
      raws: new Set(),
    });
  },
};

export const LetterOnly: Story = {
  beforeEach: () => {
    seed({
      gender: 'Both',
      letter: 'Z',
      macros: new Set(),
      raws: new Set(),
    });
  },
};

export const MacrosAndRaws: Story = {
  beforeEach: () => {
    seed({
      gender: 'Both',
      letter: null,
      macros: new Set<MacroCategory>(['Famous']),
      raws: new Set([OPTIMISTIC_ID]),
    });
  },
};

export const Everything: Story = {
  beforeEach: () => {
    seed({
      gender: 'F',
      letter: 'Q',
      macros: new Set<MacroCategory>(['Famous']),
      raws: new Set([OPTIMISTIC_ID]),
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /clear filters/i }),
    );
    const state = useFilterStore.getState();
    await expect(state.gender).toBe('Both');
    await expect(state.macroCategories.size).toBe(0);
    await expect(state.rawCategories.size).toBe(0);
    await expect(state.letter).toBe('Q');
  },
};
