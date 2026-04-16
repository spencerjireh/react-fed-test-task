import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChevronPair } from './chevron-pair';

const meta = {
  title: 'Browse/ChevronPair',
  component: ChevronPair,
  parameters: { layout: 'centered' },
  args: {
    onPrev: () => console.info('prev'),
    onNext: () => console.info('next'),
  },
  decorators: [
    (Story) => (
      <div className="bg-cream-light p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChevronPair>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Middle: Story = {
  args: { page: 5, maxPage: 10 },
};

export const TopBound: Story = {
  args: { page: 0, maxPage: 10 },
};

export const BottomBound: Story = {
  args: { page: 10, maxPage: 10 },
};

export const NothingToPaginate: Story = {
  args: { page: 0, maxPage: 0 },
};
