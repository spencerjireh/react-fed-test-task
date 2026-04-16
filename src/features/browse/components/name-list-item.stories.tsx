import type { Meta, StoryObj } from '@storybook/react-vite';

import type { Name } from '../types';

import { NameListItem } from './name-list-item';

const fixture: Name = {
  id: 'andromeda-id',
  title: 'Andromeda',
  definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
  definitionText: 'The hero of Homer\u2019s Iliad.',
  gender: ['F'],
  categories: [],
  initial: 'A',
  macroCategories: ['Famous'],
};

const meta = {
  title: 'Browse/NameListItem',
  component: NameListItem,
  parameters: { layout: 'padded' },
  args: {
    name: fixture,
    onSelect: (id) => console.info('onSelect:', id),
  },
} satisfies Meta<typeof NameListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { isSelected: false },
};

export const Selected: Story = {
  args: { isSelected: true },
};
