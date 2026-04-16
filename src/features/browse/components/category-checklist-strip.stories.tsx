import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { useEffect } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory, RawCategory } from '../types';

import { CategoryChecklistStrip } from './category-checklist-strip';

const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const CELEBRITIES_ID = '019c8a34-35ed-737c-acff-a43af999817c';
const DISNEY_ID = '019c8a34-35f2-70b1-b866-69a4921d15a8';
const LITERARY_ID = '019c8a34-360b-735c-88e7-5d86357a91a2';
const MOST_POPULAR_ID = '019c8a34-3611-73a8-90ac-bbacd3959385';
const MUSICAL_ID = '019c8a34-3614-71a6-b955-df5540ecdfce';

const FAMOUS_RAWS: RawCategory[] = [
  { id: CARTOON_ID, name: 'Cartoon', description: null },
  { id: CELEBRITIES_ID, name: 'Celebrities', description: null },
  { id: DISNEY_ID, name: 'Disney', description: null },
  { id: LITERARY_ID, name: 'Literary', description: null },
  { id: MOST_POPULAR_ID, name: 'Most Popular', description: null },
  { id: MUSICAL_ID, name: 'Musical', description: null },
];

interface FramedProps {
  macro: MacroCategory;
  macros: Set<MacroCategory>;
  raws: Set<string>;
}

function Framed({ macro, macros, raws }: FramedProps) {
  useEffect(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: macros,
      rawCategories: raws,
      selectedNameTitle: null,
      page: 0,
    });
  }, [macros, raws]);

  return (
    <div className="min-h-[120px] bg-white">
      <CategoryChecklistStrip macro={macro} />
    </div>
  );
}

const meta = {
  title: 'Browse/CategoryChecklistStrip',
  component: Framed,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('*/api/categories', () =>
          HttpResponse.json({ data: FAMOUS_RAWS }),
        ),
      ],
    },
  },
} satisfies Meta<typeof Framed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoneChecked: Story = {
  args: {
    macro: 'Famous',
    macros: new Set(),
    raws: new Set(),
  },
};

export const WithChecks: Story = {
  args: {
    macro: 'Famous',
    macros: new Set(),
    raws: new Set([CARTOON_ID, DISNEY_ID]),
  },
};

export const AllChecked: Story = {
  args: {
    macro: 'Famous',
    macros: new Set<MacroCategory>(['Famous']),
    raws: new Set(FAMOUS_RAWS.map((r) => r.id)),
  },
};
