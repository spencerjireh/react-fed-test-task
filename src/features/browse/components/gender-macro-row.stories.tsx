import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import type { Name, RawCategory } from '../types';

import { GenderMacroRow } from './gender-macro-row';

const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const CELEBRITIES_ID = '019c8a34-35ed-737c-acff-a43af999817c';
const DRINKS_ID = '019c8a34-35f6-70a9-bda7-5f0eaf8a07d5';

const CATEGORIES: RawCategory[] = [
  { id: CARTOON_ID, name: 'Cartoon', description: null },
  { id: CELEBRITIES_ID, name: 'Celebrities', description: null },
  { id: DRINKS_ID, name: 'Drinks', description: null },
];

function buildName(partial: Partial<Name>): Name {
  return {
    id: 'story-id',
    title: 'Storybook',
    definition: '<p>storybook</p>',
    definitionText: 'storybook',
    initial: 'S',
    gender: ['M'],
    categories: [CARTOON_ID],
    macroCategories: ['Famous'],
    ...partial,
  };
}

const meta = {
  title: 'Browse/GenderMacroRow',
  component: GenderMacroRow,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get('*/api/categories', () =>
          HttpResponse.json({ data: CATEGORIES }),
        ),
      ],
    },
  },
} satisfies Meta<typeof GenderMacroRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Male: Story = {
  args: { name: buildName({ gender: ['M'], categories: [CARTOON_ID] }) },
};

export const Female: Story = {
  args: { name: buildName({ gender: ['F'], categories: [CELEBRITIES_ID] }) },
};

export const Both: Story = {
  args: {
    name: buildName({ gender: ['M', 'F'], categories: [DRINKS_ID] }),
  },
};

export const EmptyGender: Story = {
  args: { name: buildName({ gender: [], categories: [CARTOON_ID] }) },
};

export const NoCategories: Story = {
  args: { name: buildName({ gender: ['M'], categories: [] }) },
};
