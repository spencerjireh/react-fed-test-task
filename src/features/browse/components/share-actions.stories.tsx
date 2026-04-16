import type { Meta, StoryObj } from '@storybook/react-vite';

import { ShareActions } from './share-actions';

const meta = {
  title: 'Browse/ShareActions',
  component: ShareActions,
  parameters: { layout: 'centered' },
  args: { title: 'Aaron' },
  decorators: [
    (Story) => (
      <div className="rounded-pill bg-white p-6 shadow-pill">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShareActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
