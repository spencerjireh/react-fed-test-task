import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

import { MACRO_CATEGORIES, type MacroCategory } from '../types';

import { CategoryChecklistStrip } from './category-checklist-strip';
import { CategoryDropdown } from './category-dropdown';

export function FilterBar() {
  const [openMacro, setOpenMacro] = useState<MacroCategory | null>(null);

  useEffect(() => {
    if (!openMacro) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMacro(null);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('[data-filter-chrome]')) return;
      setOpenMacro(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
    };
  }, [openMacro]);

  const handleToggle = (macro: MacroCategory) => {
    setOpenMacro((current) => (current === macro ? null : macro));
  };

  return (
    <section
      data-filter-chrome
      aria-label="Category filters"
      className={cn(
        'md:border-t md:border-neutral-light md:bg-white',
        !openMacro && 'md:border-b',
      )}
    >
      <nav className="mx-auto flex items-center md:h-[66px] md:max-w-[1440px] md:px-12 lg:px-[165px]">
        <p className="hidden shrink-0 pr-5 font-heading text-[16px] font-medium leading-[24px] text-neutral-dark md:block">
          Filters:
        </p>
        <div
          aria-hidden="true"
          className="hidden h-full w-px shrink-0 bg-neutral-light md:block"
        />
        <div className="flex items-center">
          {MACRO_CATEGORIES.map((macro) => (
            <CategoryDropdown
              key={macro}
              macro={macro}
              isOpen={openMacro === macro}
              onToggle={() => handleToggle(macro)}
            />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="ml-auto hidden h-full w-px shrink-0 bg-neutral-light md:block"
        />
      </nav>
      {openMacro ? <CategoryChecklistStrip macro={openMacro} /> : null}
    </section>
  );
}
