import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory, RawCategory } from '../types';

import { CategoryDropdown } from './category-dropdown';

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
  title: 'Browse/CategoryDropdown',
  component: CategoryDropdown,
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
  args: { macro: 'Famous', isOpen: false, onToggle: () => {} },
  decorators: [
    (Story) => (
      <div className="flex min-h-[80px] items-start bg-white p-6">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    resetStore(new Set(), new Set());
  },
} satisfies Meta<typeof CategoryDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = {
  args: { isOpen: true },
};

export const OpenWithSelections: Story = {
  args: { isOpen: true },
  beforeEach: () => {
    resetStore(new Set(), new Set([CARTOON_ID, DISNEY_ID]));
  },
};

export const ClosedWithSelections: Story = {
  beforeEach: () => {
    resetStore(
      new Set<MacroCategory>(['Famous']),
      new Set(FAMOUS_RAWS.map((r) => r.id)),
    );
  },
};
