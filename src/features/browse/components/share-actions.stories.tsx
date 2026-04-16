import type { Meta, StoryObj } from '@storybook/react-vite';

import { ShareActions } from './share-actions';

const meta = {
  title: 'Browse/ShareActions',
  component: ShareActions,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="bg-cream-light px-6 pb-6 pt-10">
        <Story />
      </div>
    ),
  ],
  args: { title: 'Andromeda' },
} satisfies Meta<typeof ShareActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
