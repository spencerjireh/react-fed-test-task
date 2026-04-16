import { type LucideIcon, Mars, Venus, VenusAndMars } from 'lucide-react';
import { useMemo } from 'react';

import { Icon } from '@/components/ui/icon';

import { useCategories } from '../api/get-categories';
import type { Name } from '../types';
import { getMacrosFor } from '../utils/macro-category-map';

interface GenderMacroRowProps {
  name: Name;
}

// Empty gender array (Marley) is treated as both, matching the filter predicate.
function iconForGender(gender: Name['gender']): {
  icon: LucideIcon;
  label: string;
} {
  const isMale = gender.includes('M');
  const isFemale = gender.includes('F');
  if (isMale && !isFemale) return { icon: Mars, label: 'Male' };
  if (isFemale && !isMale) return { icon: Venus, label: 'Female' };
  return { icon: VenusAndMars, label: 'Male and female' };
}

export function GenderMacroRow({ name }: GenderMacroRowProps) {
  const { data: allCategories } = useCategories();

  const firstRaw = useMemo(() => {
    if (!allCategories || name.categories.length === 0) return null;
    const mine = allCategories.filter((c) => name.categories.includes(c.id));
    if (mine.length === 0) return null;
    return mine.sort((a, b) => a.name.localeCompare(b.name))[0];
  }, [allCategories, name.categories]);

  const { icon, label } = iconForGender(name.gender);

  return (
    <p className="flex items-center gap-3 font-body text-[26px] leading-[34px] text-neutral-dark">
      <Icon icon={icon} size={48} aria-label={label} />
      {firstRaw ? (
        <span>
          {getMacrosFor(firstRaw.id).join(', ')} - {firstRaw.name}
        </span>
      ) : null}
    </p>
  );
}
