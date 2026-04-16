import { useMemo } from 'react';

import { cn } from '@/lib/cn';

import { useCategories } from '../api/get-categories';
import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory } from '../types';
import { getRawsForMacro } from '../utils/macro-category-map';

interface CategoryChecklistStripProps {
  macro: MacroCategory;
}

export function CategoryChecklistStrip({ macro }: CategoryChecklistStripProps) {
  const macroCategories = useFilterStore((s) => s.macroCategories);
  const rawCategories = useFilterStore((s) => s.rawCategories);
  const toggleMacro = useFilterStore((s) => s.toggleMacro);
  const toggleRaw = useFilterStore((s) => s.toggleRaw);

  const { data: categories } = useCategories();
  const raws = useMemo(
    () => getRawsForMacro(macro, categories ?? []),
    [macro, categories],
  );

  const macroChecked = macroCategories.has(macro);

  return (
    <div
      id="category-checklist-strip"
      role="group"
      aria-label={`${macro} categories`}
      className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4 md:px-12 lg:px-[165px]"
    >
      <ChecklistItem
        label={`All ${macro}`}
        checked={macroChecked}
        onChange={() => toggleMacro(macro)}
      />
      {raws.map((raw) => (
        <ChecklistItem
          key={raw.id}
          label={raw.name}
          checked={rawCategories.has(raw.id)}
          onChange={() => toggleRaw(raw.id)}
        />
      ))}
    </div>
  );
}

interface ChecklistItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function ChecklistItem({ label, checked, onChange }: ChecklistItemProps) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 whitespace-nowrap',
        'font-body text-[16px] font-light leading-[24px]',
        'transition-colors',
        checked ? 'text-red-main' : 'text-neutral-dark hover:text-neutral-mid',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 cursor-pointer accent-red-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2"
      />
      <span>{label}</span>
    </label>
  );
}
