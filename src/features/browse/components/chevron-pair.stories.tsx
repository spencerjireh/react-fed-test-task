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
      <div className="flex h-[600px] bg-cream-light p-6">
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

const boundaries = [
  { label: 'Middle', atTop: false, atBottom: false },
  { label: 'At top', atTop: true, atBottom: false },
  { label: 'At bottom', atTop: false, atBottom: true },
  { label: 'Single page', atTop: true, atBottom: true },
] as const;

export const AllStates: Story = {
  args: { atTop: false, atBottom: false },
  render: () => (
    <div className="grid grid-cols-4 gap-10 bg-cream-light p-6">
      {boundaries.map(({ label, atTop, atBottom }) => (
        <div key={label} className="flex h-[600px] flex-col items-center gap-3">
          <span className="text-xs font-medium uppercase text-neutral-mid">
            {label}
          </span>
          <ChevronPair
            atTop={atTop}
            atBottom={atBottom}
            onPrev={() => {}}
            onNext={() => {}}
          />
        </div>
      ))}
    </div>
  ),
};
