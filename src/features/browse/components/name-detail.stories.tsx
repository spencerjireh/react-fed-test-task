import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import { useFilterStore } from '../stores/filter-store';
import type { RawName } from '../types';

import { NameDetail } from './name-detail';

const FIXTURE: RawName[] = [
  {
    id: 'andromeda-id',
    title: 'Andromeda',
    definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
    gender: ['F'],
    categories: ['shared'],
  },
  {
    id: 'athena-id',
    title: 'Athena',
    definition: '<p>Goddess of wisdom.</p>',
    gender: ['F'],
    categories: ['shared'],
  },
  {
    id: 'abu-id',
    title: 'Abu',
    definition: '<p>Aladdin&rsquo;s monkey.</p>',
    gender: ['M'],
    categories: ['shared'],
  },
];

const meta = {
  title: 'Browse/NameDetail',
  component: NameDetail,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-screen-sm bg-cream-light p-6">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });
  },
} satisfies Meta<typeof NameDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};

export const NoSelection: Story = {
  beforeEach: () => {
    useFilterStore.setState({ selectedNameTitle: null });
  },
};
