import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import { useCategories } from '../api/get-categories';
import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory } from '../types';
import { getRawsForMacro } from '../utils/macro-category-map';

interface CategoryDropdownProps {
  macro: MacroCategory;
  isOpen: boolean;
  onToggle: () => void;
}

const trigger = cva(
  [
    'flex items-center gap-2 whitespace-nowrap px-5 py-[21px]',
    'font-body text-[16px] font-light leading-[24px]',
    'border-x border-t border-transparent',
    'text-neutral-dark transition-colors hover:text-neutral-mid',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  ].join(' '),
  {
    variants: {
      open: {
        true: 'relative z-10 border-red-main',
        false: '',
      },
      active: {
        true: 'font-medium text-red-main hover:text-red-main',
        false: '',
      },
    },
  },
);

export function CategoryDropdown({
  macro,
  isOpen,
  onToggle,
}: CategoryDropdownProps) {
  const macroCategories = useFilterStore((s) => s.macroCategories);
  const rawCategories = useFilterStore((s) => s.rawCategories);

  const { data: categories } = useCategories();
  const raws = useMemo(
    () => getRawsForMacro(macro, categories ?? []),
    [macro, categories],
  );

  const hasSelection =
    macroCategories.has(macro) || raws.some((r) => rawCategories.has(r.id));

  return (
    <button
      type="button"
      aria-label={`Filter by ${macro}`}
      aria-expanded={isOpen}
      aria-controls="category-checklist-strip"
      data-active={hasSelection || undefined}
      onClick={onToggle}
      className={cn(trigger({ open: isOpen, active: hasSelection }))}
    >
      <span>{macro}</span>
      <Icon
        icon={ChevronDown}
        size={24}
        className={cn(
          'text-red-main transition-transform duration-150',
          isOpen && 'rotate-180',
        )}
      />
      {isOpen && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-px -bottom-px h-[2px] bg-white"
        />
      )}
    </button>
  );
}
