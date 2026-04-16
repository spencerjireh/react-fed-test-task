import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: 'h-4 w-64' },
};

/**
 * Matches the NameListItem default row metrics — 11 of these fill the
 * list viewport during load.
 */
export const NameListRow: Story = {
  args: { className: 'h-[45px] w-full max-w-[320px]' },
};

export const ListOfRows: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-3">
      {Array.from({ length: 11 }).map((_, i) => (
        <Skeleton key={i} className="h-[45px] w-full" />
      ))}
    </div>
  ),
};
