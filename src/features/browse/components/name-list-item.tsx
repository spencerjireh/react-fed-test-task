import { cn } from '@/lib/cn';

import type { Name } from '../types';

interface NameListItemProps {
  name: Name;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * A single row in the name list.
 *
 * Props-driven rather than store-reading: the parent (`NameList`)
 * subscribes to `selectedNameId` + `setSelectedNameId` once and threads
 * them down. That makes Storybook isolation automatic (no per-story store
 * setup) and keeps the click unit test focused on the local contract
 * — the "selection → URL" chain is `NameList`'s integration concern.
 *
 * Type scale (Figma):
 *   - default: 35px Roboto Slab Light, 80% opacity on neutral-dark
 *   - selected: 45px Roboto Slab Regular in red-main
 */
export function NameListItem({
  name,
  isSelected,
  onSelect,
}: NameListItemProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(name.id)}
      className={cn(
        'block w-full text-left font-heading transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main',
        isSelected
          ? 'text-[45px] font-normal leading-tight text-red-main'
          : 'text-[35px] font-light leading-tight text-neutral-dark/80 hover:text-neutral-dark',
      )}
    >
      {name.title}
    </button>
  );
}
