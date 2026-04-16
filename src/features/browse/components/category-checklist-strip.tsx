import { Check, Minus } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import { cn } from '@/utils/cn';

import { useCategories } from '../api/get-categories';
import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory } from '../types';
import { getRawsForMacro } from '../utils/macro-category-map';

interface CategoryChecklistStripProps {
  macro: MacroCategory;
}

export function CategoryChecklistStrip({ macro }: CategoryChecklistStripProps) {
  const rawCategories = useFilterStore((s) => s.rawCategories);
  const toggleMacro = useFilterStore((s) => s.toggleMacro);
  const toggleRaw = useFilterStore((s) => s.toggleRaw);

  const { data: categories } = useCategories();
  const raws = useMemo(
    () => getRawsForMacro(macro, categories ?? []),
    [macro, categories],
  );

  const checkedCount = raws.filter((r) => rawCategories.has(r.id)).length;
  const fullyChecked = raws.length > 0 && checkedCount === raws.length;
  const partiallyChecked = checkedCount > 0 && !fullyChecked;

  return (
    <div className="border-t border-neutral-light">
      <div
        id="category-checklist-strip"
        role="group"
        aria-label={`${macro} categories`}
        className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4 md:px-12 lg:px-[165px]"
      >
        <ChecklistItem
          label={`All ${macro}`}
          checked={fullyChecked}
          indeterminate={partiallyChecked}
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
    </div>
  );
}

interface ChecklistItemProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

function ChecklistItem({
  label,
  checked,
  indeterminate = false,
  onChange,
}: ChecklistItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 whitespace-nowrap',
        'font-body text-[16px] font-light leading-[24px]',
        'text-neutral-dark transition-colors hover:text-neutral-mid',
      )}
    >
      <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={cn(
            'absolute inset-0 m-0 cursor-pointer appearance-none rounded-[2px] border border-red-main bg-white transition-colors',
            'checked:bg-red-main',
            indeterminate && 'bg-red-main',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2',
          )}
        />
        {indeterminate ? (
          <Minus
            aria-hidden
            size={12}
            strokeWidth={3}
            className="pointer-events-none relative shrink-0 text-white"
          />
        ) : checked ? (
          <Check
            aria-hidden
            size={12}
            strokeWidth={3}
            className="pointer-events-none relative shrink-0 text-white"
          />
        ) : null}
      </span>
      <span>{label}</span>
    </label>
  );
}
