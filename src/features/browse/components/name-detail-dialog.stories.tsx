import type { Meta, StoryObj } from '@storybook/react-vite';

import { useFilterStore } from '../stores/filter-store';

import { NameDetailDialog } from './name-detail-dialog';

const meta = {
  title: 'Browse/NameDetailDialog',
  component: NameDetailDialog,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="min-h-[600px] w-full bg-cream-light p-6">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useFilterStore.setState({ selectedNameTitle: 'Aaron' });
  },
} satisfies Meta<typeof NameDetailDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Closed: Story = {
  beforeEach: () => {
    useFilterStore.setState({ selectedNameTitle: null });
  },
};
