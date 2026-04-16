import { cva, type VariantProps } from 'class-variance-authority';
import type { Ref } from 'react';

import { cn } from '@/lib/cn';

import type { Letter } from '../types';

const circle = cva(
  [
    'flex h-[37px] w-[37px] shrink-0 items-center justify-center rounded-full',
    'font-heading text-[25px] leading-[35px]',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  ].join(' '),
  {
    variants: {
      state: {
        default: 'bg-transparent text-neutral-dark hover:bg-neutral-light/40',
        selected: 'bg-red-main text-white',
        disabled: 'cursor-not-allowed bg-transparent text-neutral-light',
      },
    },
  },
);

type CircleState = NonNullable<VariantProps<typeof circle>['state']>;

interface LetterCircleProps {
  letter: Letter;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (letter: Letter) => void;
  isTabbable: boolean;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

function resolveState(isDisabled: boolean, isSelected: boolean): CircleState {
  if (isDisabled) return 'disabled';
  if (isSelected) return 'selected';
  return 'default';
}

export function LetterCircle({
  ref,
  letter,
  isSelected,
  isDisabled,
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
      aria-disabled={isDisabled}
      aria-label={`Filter by letter ${letter}`}
      tabIndex={isTabbable ? 0 : -1}
      data-letter={letter}
      onClick={() => {
        if (isDisabled) return;
        onSelect(letter);
      }}
      className={cn(
        circle({ state: resolveState(isDisabled, isSelected) }),
        className,
      )}
    >
      {letter}
    </button>
  );
}
