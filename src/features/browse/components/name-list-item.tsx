import type { CSSProperties, Ref } from 'react';

import { cn } from '@/lib/cn';

import type { Name } from '../types';

interface NameListItemProps {
  name: Name;
  isSelected: boolean;
  onSelect: (title: string) => void;
  ref?: Ref<HTMLButtonElement>;
  // null disables the fade; isSelected alone drives focal styling.
  centerDistance?: number | null;
}

const FADE_CAP = 5;

export function NameListItem({
  ref,
  name,
  isSelected,
  onSelect,
  centerDistance = null,
}: NameListItemProps) {
  const isCenter = centerDistance === 0;
  const isNeighbor = centerDistance !== null && centerDistance > 0;
  const renderAsFocal = isSelected || isCenter;

  const neighborStyle: CSSProperties | undefined = isNeighbor
    ? {
        transform: `scale(${1 - Math.min(centerDistance, FADE_CAP) * 0.12})`,
        opacity: 1 - Math.min(centerDistance, FADE_CAP) * 0.15,
      }
    : undefined;

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isSelected}
      data-name-title={name.title}
      onClick={() => onSelect(name.title)}
      style={neighborStyle}
      className={cn(
        'block w-full text-left font-heading transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main',
        renderAsFocal
          ? 'text-[28px] font-normal leading-tight text-red-main md:text-[45px]'
          : 'text-[20px] font-light leading-tight text-neutral-dark/80 hover:text-neutral-dark md:text-[35px]',
      )}
    >
      {name.title}
    </button>
  );
}
