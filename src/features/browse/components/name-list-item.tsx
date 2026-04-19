import { cva } from 'class-variance-authority';
import { memo } from 'react';

import type { Name } from '../types';

const item = cva(
  [
    'block w-full font-heading leading-tight transition-all duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main',
  ].join(' '),
  {
    variants: {
      variant: {
        results: 'text-center',
        detail: 'text-left',
      },
      tone: {
        focal: 'font-normal text-red-main',
        muted: 'font-light text-neutral-dark/80 hover:text-neutral-dark',
      },
    },
    compoundVariants: [
      {
        variant: 'results',
        tone: 'focal',
        class: 'text-[30px] md:text-[52px]',
      },
      {
        variant: 'detail',
        tone: 'focal',
        class: 'text-[28px] md:text-[45px]',
      },
      {
        variant: 'results',
        tone: 'muted',
        class: 'text-[22px] md:text-[40px]',
      },
      {
        variant: 'detail',
        tone: 'muted',
        class: 'text-[20px] md:text-[35px]',
      },
    ],
  },
);

interface NameListItemProps {
  name: Name;
  isSelected: boolean;
  onSelect: (title: string) => void;
  isCentered?: boolean;
  variant?: 'detail' | 'results';
}

export const NameListItem = memo(function NameListItem({
  name,
  isSelected,
  onSelect,
  isCentered = false,
  variant = 'detail',
}: NameListItemProps) {
  const tone = isSelected || isCentered ? 'focal' : 'muted';

  return (
    <button
      type="button"
      data-name-title={name.title}
      onClick={() => onSelect(name.title)}
      className={item({ variant, tone })}
    >
      {name.title}
    </button>
  );
});
