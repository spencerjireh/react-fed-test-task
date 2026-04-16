import type { KeyboardEvent } from 'react';
import { useRef } from 'react';

import { useFilterStore } from '../stores/filter-store';

import { GenderPill, type GenderValue } from './gender-pill';

interface GenderOption {
  value: GenderValue;
  label: string;
}

const OPTIONS: readonly GenderOption[] = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'Both', label: 'Both' },
];

export function GenderBand() {
  const gender = useFilterStore((s) => s.gender);
  const setGender = useFilterStore((s) => s.setGender);

  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = OPTIONS.findIndex((o) => o.value === gender);
    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (current + 1) % OPTIONS.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (current - 1 + OPTIONS.length) % OPTIONS.length;
    } else {
      return;
    }
    event.preventDefault();
    setGender(OPTIONS[next].value);
    pillRefs.current[next]?.focus();
  };

  return (
    <section className="bg-cream-light">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-12 lg:px-[165px] lg:py-[40px]">
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-heading text-[25px] leading-[35px] text-neutral-dark">
            Choose your pet&rsquo;s gender
          </h2>
          <div
            role="radiogroup"
            aria-label="Choose your pet's gender"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            className="flex flex-wrap justify-center gap-4"
          >
            {OPTIONS.map((o, i) => (
              <GenderPill
                key={o.value}
                ref={(el) => {
                  pillRefs.current[i] = el;
                }}
                value={o.value}
                label={o.label}
                isSelected={o.value === gender}
                onSelect={setGender}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
