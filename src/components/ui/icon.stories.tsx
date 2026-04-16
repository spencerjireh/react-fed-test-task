import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, Link2 } from 'lucide-react';

import { Icon } from './icon';

const meta = {
  title: 'UI/Icon',
  component: Icon,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { icon: ChevronDown },
};

export const Colored: Story = {
  args: { icon: ChevronDown, className: 'text-red-main', size: 24 },
};

export const Labeled: Story = {
  args: { icon: Link2, 'aria-label': 'Copy link', size: 20 },
};
