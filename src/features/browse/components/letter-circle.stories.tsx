import type { Meta, StoryObj } from '@storybook/react-vite';

import { LetterCircle } from './letter-circle';

const meta = {
  title: 'Browse/LetterCircle',
  component: LetterCircle,
  parameters: { layout: 'centered' },
  args: {
    letter: 'A',
    onSelect: (letter) => console.info('onSelect:', letter),
    isTabbable: true,
  },
  decorators: [
    (Story) => (
      <div className="rounded-pill bg-white p-4 shadow-pill">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LetterCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { isSelected: false },
};

export const Selected: Story = {
  args: { isSelected: true },
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const AllLetters: Story = {
  args: { isSelected: false },
  render: () => (
    <div className="flex flex-wrap justify-center gap-1 rounded-pill bg-white p-2 shadow-pill">
      {LETTERS.map((letter) => (
        <LetterCircle
          key={letter}
          letter={letter}
          isSelected={letter === 'G'}
          isTabbable={letter === 'G'}
          onSelect={() => {}}
        />
      ))}
    </div>
  ),
};
