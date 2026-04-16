import type { KeyboardEvent } from 'react';
import { useMemo, useRef } from 'react';

import { useLetters } from '../api/get-letters';
import { useFilterStore } from '../stores/filter-store';
import type { Letter } from '../types';

import { LetterCircle } from './letter-circle';

export function LetterStrip() {
  const letter = useFilterStore((s) => s.letter);
  const setLetter = useFilterStore((s) => s.setLetter);

  const { data: letters } = useLetters();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabbableIndex = useMemo(() => {
    if (!letters) return 0;
    if (letter) {
      const idx = letters.indexOf(letter);
      if (idx !== -1) return idx;
    }
    return 0;
  }, [letter, letters]);

  if (!letters) return null;

  const focusAndSelect = (index: number) => {
    buttonRefs.current[index]?.focus();
    setLetter(letters[index]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = letters.length;
    const currentTarget = event.target as HTMLElement;
    const currentLetter = currentTarget.getAttribute('data-letter');
    const currentIndex = currentLetter
      ? letters.indexOf(currentLetter)
      : tabbableIndex;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % count;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + count) % count;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = count - 1;
    } else {
      return;
    }
    if (nextIndex === currentIndex) return;
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
      className="mx-auto flex w-fit flex-wrap items-center justify-center gap-1 rounded-pill bg-white p-1.5 shadow-pill md:flex-nowrap md:p-2"
    >
      {letters.map((l, i) => (
        <LetterCircle
          key={l}
          ref={(el) => {
            buttonRefs.current[i] = el;
          }}
          letter={l}
          isSelected={l === letter}
          onSelect={handleSelect}
          isTabbable={i === tabbableIndex}
        />
      ))}
    </div>
  );
}
