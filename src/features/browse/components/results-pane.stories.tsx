import type { Meta, StoryObj } from '@storybook/react-vite';

import { useFilterStore } from '../stores/filter-store';

import { EmptyResults } from './empty-results';
import { ResultsPane } from './results-pane';

const meta = {
  title: 'Browse/ResultsPane',
  component: ResultsPane,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-[700px] w-full bg-cream-light p-8">
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    useFilterStore.setState({
      gender: 'M',
      letter: 'A',
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
  },
} satisfies Meta<typeof ResultsPane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEmptyOverride: Story = {
  args: {
    children: <EmptyResults />,
  },
};
