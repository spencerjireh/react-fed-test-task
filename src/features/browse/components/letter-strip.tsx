import type { KeyboardEvent } from 'react';
import { useMemo, useRef } from 'react';

import { LETTERS } from '@/config/constants';

import { useNames } from '../api/get-names';
import { useFilterStore } from '../stores/filter-store';
import type { Letter } from '../types';

import { LetterCircle } from './letter-circle';

function useAvailableInitials(): ReadonlySet<string> | null {
  const { data } = useNames();
  return useMemo(() => {
    if (!data || data.length === 0) return null;
    return new Set(data.map((n) => n.initial));
  }, [data]);
}

export function LetterStrip() {
  const letter = useFilterStore((s) => s.letter);
  const setLetter = useFilterStore((s) => s.setLetter);

  const available = useAvailableInitials();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isDisabled = (l: Letter): boolean =>
    available !== null && !available.has(l);

  // Keep one enabled letter in the tab order.
  const tabbableIndex = useMemo(() => {
    if (letter) {
      const idx = LETTERS.indexOf(letter as (typeof LETTERS)[number]);
      if (idx !== -1 && !isDisabled(letter)) return idx;
    }
    const firstEnabled = LETTERS.findIndex((l) => !isDisabled(l));
    return firstEnabled === -1 ? 0 : firstEnabled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter, available]);

  const focusAndSelect = (index: number) => {
    const target = LETTERS[index];
    buttonRefs.current[index]?.focus();
    setLetter(target);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = LETTERS.length;
    const currentTarget = event.target as HTMLElement;
    const currentLetter = currentTarget.getAttribute('data-letter');
    const currentIndex = currentLetter
      ? LETTERS.indexOf(currentLetter as (typeof LETTERS)[number])
      : tabbableIndex;

    const step = (direction: 1 | -1) => {
      let next = currentIndex;
      for (let i = 0; i < count; i += 1) {
        next = (next + direction + count) % count;
        if (!isDisabled(LETTERS[next])) return next;
      }
      return currentIndex;
    };

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = step(1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = step(-1);
    } else if (event.key === 'Home') {
      nextIndex = LETTERS.findIndex((l) => !isDisabled(l));
    } else if (event.key === 'End') {
      for (let i = count - 1; i >= 0; i -= 1) {
        if (!isDisabled(LETTERS[i])) {
          nextIndex = i;
          break;
        }
      }
    } else {
      return;
    }
    if (nextIndex === null || nextIndex === currentIndex) return;
    event.preventDefault();
    focusAndSelect(nextIndex);
  };

  const handleSelect = (l: Letter) => {
    if (l === letter) {
      setLetter(null);
    } else {
      setLetter(l);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Filter by letter"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="flex flex-wrap items-center justify-center gap-[3px] rounded-pill bg-white p-3 shadow-pill md:p-4"
    >
      {LETTERS.map((l, i) => (
        <LetterCircle
          key={l}
          ref={(el) => {
            buttonRefs.current[i] = el;
          }}
          letter={l}
          isSelected={l === letter}
          isDisabled={isDisabled(l)}
          onSelect={handleSelect}
          isTabbable={i === tabbableIndex}
        />
      ))}
    </div>
  );
}
