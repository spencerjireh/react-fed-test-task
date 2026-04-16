import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChevronButton } from './chevron-button';

const meta = {
  title: 'UI/ChevronButton',
  component: ChevronButton,
  parameters: { layout: 'centered' },
  args: {
    onClick: () => console.info('chevron click'),
  },
  decorators: [
    (Story) => (
      <div className="bg-cream-light p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChevronButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Up: Story = {
  args: { direction: 'up', disabled: false, 'aria-label': 'Previous 11 names' },
};

export const Down: Story = {
  args: { direction: 'down', disabled: false, 'aria-label': 'Next 11 names' },
};

export const Disabled: Story = {
  args: {
    direction: 'down',
    disabled: true,
    'aria-label': 'Next 11 names',
  },
};
