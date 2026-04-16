import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cva } from 'class-variance-authority';
import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/cn';

import { useCategories } from '../api/get-categories';
import { useFilterStore } from '../stores/filter-store';
import type { MacroCategory } from '../types';
import { getRawsForMacro } from '../utils/macro-category-map';

interface CategoryDropdownProps {
  macro: MacroCategory;
  /** Render the panel open on mount — for Storybook snapshots. */
  defaultOpen?: boolean;
}

const trigger = cva(
  [
    'flex items-center gap-2 whitespace-nowrap px-5 py-[21px]',
    'font-body text-[16px] font-light leading-[24px]',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    'data-[state=open]:bg-cream-light',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'text-red-main',
        false: 'text-neutral-dark hover:text-neutral-mid',
      },
    },
  },
);

const itemClass = [
  'flex cursor-pointer items-center justify-between gap-4',
  'rounded-[4px] px-4 py-2',
  'font-body text-[16px] font-light leading-[24px] text-neutral-dark',
  'outline-none data-[highlighted]:bg-cream-light',
  'data-[state=checked]:text-red-main',
].join(' ');

export function CategoryDropdown({
  macro,
  defaultOpen = false,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(defaultOpen);

  const macroCategories = useFilterStore((s) => s.macroCategories);
  const rawCategories = useFilterStore((s) => s.rawCategories);
  const toggleMacro = useFilterStore((s) => s.toggleMacro);
  const toggleRaw = useFilterStore((s) => s.toggleRaw);

  const { data: categories } = useCategories();
  const raws = useMemo(
    () => getRawsForMacro(macro, categories ?? []),
    [macro, categories],
  );

  const isMacroChecked = macroCategories.has(macro);
  const anyRawChecked = raws.some((r) => rawCategories.has(r.id));
  const isActive = isMacroChecked || anyRawChecked;

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger
        className={cn(trigger({ active: isActive }))}
        aria-label={`Filter by ${macro}`}
      >
        <span>{macro}</span>
        <Icon
          icon={ChevronDown}
          size={24}
          className={cn(
            'transition-transform duration-150',
            open && 'rotate-180',
          )}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className={cn(
            'z-50 min-w-[240px]',
            'rounded-[4px] border border-neutral-light bg-white p-2 shadow-pill',
            'focus-visible:outline-none',
          )}
        >
          <DropdownMenu.CheckboxItem
            className={itemClass}
            checked={isMacroChecked}
            onCheckedChange={() => toggleMacro(macro)}
            onSelect={(e) => e.preventDefault()}
          >
            <span>All {macro}</span>
            <DropdownMenu.ItemIndicator>
              <Icon icon={Check} size={16} className="text-red-main" />
            </DropdownMenu.ItemIndicator>
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className="my-1 h-px bg-neutral-light" />

          {raws.map((raw) => (
            <DropdownMenu.CheckboxItem
              key={raw.id}
              className={itemClass}
              checked={rawCategories.has(raw.id)}
              onCheckedChange={() => toggleRaw(raw.id)}
              onSelect={(e) => e.preventDefault()}
            >
              <span>{raw.name}</span>
              <DropdownMenu.ItemIndicator>
                <Icon icon={Check} size={16} className="text-red-main" />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
