import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { useEffect } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { Letter, RawName } from '../types';

import { LetterStrip } from './letter-strip';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Cover A-Z so only Ñ renders disabled.
const FIXTURE: RawName[] = ALPHABET.split('').map((ch) => ({
  id: `${ch.toLowerCase()}-id`,
  title: `${ch}name`,
  definition: `<p>${ch}name</p>`,
  gender: ['F'],
  categories: [],
}));

function Framed({ initialLetter }: { initialLetter: Letter | null }) {
  useEffect(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: initialLetter,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
      page: 0,
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
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
      ],
    },
  },
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
