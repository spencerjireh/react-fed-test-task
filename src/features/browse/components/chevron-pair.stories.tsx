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
  args: { atTop: false, atBottom: false },
};

export const TopBound: Story = {
  args: { atTop: true, atBottom: false },
};

export const BottomBound: Story = {
  args: { atTop: false, atBottom: true },
};

export const NothingToPaginate: Story = {
  args: { atTop: true, atBottom: true },
};
