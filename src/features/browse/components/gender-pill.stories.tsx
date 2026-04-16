import type { Meta, StoryObj } from '@storybook/react-vite';

import { GenderPill } from './gender-pill';

const meta = {
  title: 'Browse/GenderPill',
  component: GenderPill,
  parameters: { layout: 'centered' },
  args: {
    value: 'M',
    label: 'Male',
    onSelect: (value) => console.info('onSelect:', value),
  },
  decorators: [
    (Story) => (
      <div className="bg-cream-light p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GenderPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: { isSelected: false },
};

export const Selected: Story = {
  args: { isSelected: true },
};

export const BothValue: Story = {
  args: { value: 'Both', label: 'Both', isSelected: false },
};
