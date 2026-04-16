import type { Meta, StoryObj } from '@storybook/react-vite';

import type { GenderValue } from './gender-pill';
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

export const Default: Story = {
  args: { isSelected: false },
};

const values: { value: GenderValue; label: string }[] = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'Both', label: 'Both' },
];

export const AllVariants: Story = {
  args: { isSelected: false },
  render: () => (
    <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-3 bg-cream-light p-6">
      {values.flatMap(({ value, label }) =>
        [false, true].map((isSelected) => (
          <GenderPill
            key={`${value}-${String(isSelected)}`}
            value={value}
            label={label}
            isSelected={isSelected}
            onSelect={() => {}}
          />
        )),
      )}
    </div>
  ),
};
