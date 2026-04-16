import { useMemo } from 'react';

import { useCategories } from '../api/get-categories';
import type { Name } from '../types';
import { getMacroFor } from '../utils/macro-category-map';

interface GenderMacroRowProps {
  name: Name;
}

// Empty gender array (Marley) is treated as both, matching the filter predicate.
function glyphForGender(gender: Name['gender']): {
  symbol: string;
  label: string;
} {
  const isMale = gender.includes('M');
  const isFemale = gender.includes('F');
  if (isMale && !isFemale) return { symbol: '\u2642', label: 'Male' };
  if (isFemale && !isMale) return { symbol: '\u2640', label: 'Female' };
  return { symbol: '\u2642\u2640', label: 'Male and female' };
}

export function GenderMacroRow({ name }: GenderMacroRowProps) {
  const { data: allCategories } = useCategories();

  const firstRaw = useMemo(() => {
    if (!allCategories || name.categories.length === 0) return null;
    const mine = allCategories.filter((c) => name.categories.includes(c.id));
    if (mine.length === 0) return null;
    return mine.slice().sort((a, b) => a.name.localeCompare(b.name))[0];
  }, [allCategories, name.categories]);

  const { symbol, label } = glyphForGender(name.gender);

  return (
    <p className="flex items-center gap-2 font-body text-[20px] leading-[30px] text-neutral-dark">
      <span aria-label={label} role="img" className="text-[24px] leading-none">
        {symbol}
      </span>
      {firstRaw ? (
        <span>
          {getMacroFor(firstRaw.id)} - {firstRaw.name}
        </span>
      ) : null}
    </p>
  );
}
