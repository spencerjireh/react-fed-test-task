import { useEffect, useRef, useState } from 'react';

import type { MacroCategory } from '../types';

import { CategoryChecklistStrip } from './category-checklist-strip';
import { CategoryDropdown } from './category-dropdown';

const MACROS: readonly MacroCategory[] = [
  'Famous',
  "Pet's size",
  'Joyful',
  'Funny',
  'Food and drinks',
  'International',
  'Others',
];

interface FilterBarProps {
  // Storybook uses this to render an initially-open strip without a click.
  initialOpenMacro?: MacroCategory | null;
}

export function FilterBar({ initialOpenMacro = null }: FilterBarProps = {}) {
  const [openMacro, setOpenMacro] = useState<MacroCategory | null>(
    initialOpenMacro,
  );
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!openMacro) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMacro(null);
    };
    const onPointerDown = (event: MouseEvent) => {
      const root = sectionRef.current;
      if (!root) return;
      if (!root.contains(event.target as Node)) setOpenMacro(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [openMacro]);

  const handleToggle = (macro: MacroCategory) => {
    setOpenMacro((current) => (current === macro ? null : macro));
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Category filters"
      className="md:border-y md:border-neutral-light md:bg-white"
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
          {MACROS.map((macro) => (
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
