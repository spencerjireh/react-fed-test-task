import type { Meta, StoryObj } from '@storybook/react-vite';

import type { Name } from '../types';

import { NameListItem } from './name-list-item';

const fixture: Name = {
  id: 'andromeda-id',
  title: 'Andromeda',
  definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
  definitionText: 'The hero of Homer\u2019s Iliad.',
  gender: ['F'],
  categories: [],
  initial: 'A',
  macroCategories: ['Famous'],
};

const meta = {
  title: 'Browse/NameListItem',
  component: NameListItem,
  parameters: { layout: 'padded' },
  args: {
    name: fixture,
    onSelect: (id) => console.info('onSelect:', id),
  },
} satisfies Meta<typeof NameListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { isSelected: false },
};

const stateRows = [
  { label: 'neither', isSelected: false, isCentered: false },
  { label: 'centered', isSelected: false, isCentered: true },
  { label: 'selected', isSelected: true, isCentered: false },
] as const;

const variantCols = ['detail', 'results'] as const;

export const AllVariants: Story = {
  args: { isSelected: false },
  render: () => (
    <div className="inline-grid grid-cols-[auto_1fr_1fr] items-center gap-x-8 gap-y-3 bg-cream-light p-6">
      <span />
      {variantCols.map((variant) => (
        <span
          key={variant}
          className="text-xs font-medium uppercase text-neutral-mid"
        >
          {variant}
        </span>
      ))}
      {stateRows.flatMap(({ label, isSelected, isCentered }) => [
        <span key={`${label}-label`} className="text-xs text-neutral-mid">
          {label}
        </span>,
        ...variantCols.map((variant) => (
          <NameListItem
            key={`${label}-${variant}`}
            name={fixture}
            isSelected={isSelected}
            isCentered={isCentered}
            variant={variant}
            onSelect={() => {}}
          />
        )),
      ])}
    </div>
  ),
};
