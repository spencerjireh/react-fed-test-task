import type { Meta, StoryObj } from '@storybook/react-vite';

import { CoverHero } from './cover-hero';

const meta = {
  title: 'Browse/CoverHero',
  component: CoverHero,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-cream-light px-6 md:px-12 lg:px-[165px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CoverHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Tablet: Story = {
  globals: { viewport: { value: 'tablet' } },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
};
