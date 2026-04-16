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

export const Default: Story = {
  args: { direction: 'up', disabled: false, 'aria-label': 'Previous 11 names' },
};

const variants = [
  { direction: 'up', disabled: false, label: 'Up · enabled' },
  { direction: 'up', disabled: true, label: 'Up · disabled' },
  { direction: 'down', disabled: false, label: 'Down · enabled' },
  { direction: 'down', disabled: true, label: 'Down · disabled' },
] as const;

export const AllVariants: Story = {
  args: { direction: 'up', disabled: false, 'aria-label': 'All variants' },
  render: () => (
    <div className="grid grid-cols-2 gap-6 bg-cream-light p-6">
      {variants.map(({ direction, disabled, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <ChevronButton
            direction={direction}
            disabled={disabled}
            onClick={() => {}}
            aria-label={label}
          />
          <span className="text-xs text-neutral-mid">{label}</span>
        </div>
      ))}
    </div>
  ),
};
