import { cva, type VariantProps } from 'class-variance-authority';
import type { Ref } from 'react';

import { cn } from '@/utils/cn';

import type { Letter } from '../types';

const circle = cva(
  [
    'flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full',
    'font-heading text-[22px] leading-none',
    'transition-colors duration-[120ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  ].join(' '),
  {
    variants: {
      state: {
        default: 'bg-transparent text-neutral-dark hover:bg-neutral-light/40',
        selected: 'bg-red-main text-white',
      },
    },
  },
);

type CircleState = NonNullable<VariantProps<typeof circle>['state']>;

interface LetterCircleProps {
  letter: Letter;
  isSelected: boolean;
  onSelect: (letter: Letter) => void;
  isTabbable: boolean;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

function resolveState(isSelected: boolean): CircleState {
  return isSelected ? 'selected' : 'default';
}

export function LetterCircle({
  ref,
  letter,
  isSelected,
  onSelect,
  isTabbable,
  className,
}: LetterCircleProps) {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-label={`Filter by letter ${letter}`}
      tabIndex={isTabbable ? 0 : -1}
      data-letter={letter}
      onClick={() => onSelect(letter)}
      className={cn(circle({ state: resolveState(isSelected) }), className)}
    >
      {letter}
    </button>
  );
}
