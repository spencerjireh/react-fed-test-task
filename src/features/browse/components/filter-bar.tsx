import type { MacroCategory } from '../types';

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

export function FilterBar() {
  return (
    <section
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
            <CategoryDropdown key={macro} macro={macro} />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="ml-auto hidden h-full w-px shrink-0 bg-neutral-light md:block"
        />
      </nav>
    </section>
  );
}
