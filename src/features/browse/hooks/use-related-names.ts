import { useMemo } from 'react';

import { useNames } from '../api/get-names';
import type { Name } from '../types';
import { relatedNames } from '../utils/related';

import { useSelectedName } from './use-selected-name';

export function useRelatedNames(limit = 3): Name[] {
  const { data: names } = useNames();
  const current = useSelectedName();

  return useMemo(() => {
    if (!current || !names) return [];
    return relatedNames(names, current.id, limit);
  }, [names, current, limit]);
}
