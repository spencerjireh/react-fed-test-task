import { useQuery } from '@tanstack/react-query';

import type { Name, RawName } from '../types';
import { decorateNames } from '../utils/decorate-name';

import { API_BASE } from './client';

async function fetchNames(): Promise<Name[]> {
  const res = await fetch(`${API_BASE}/names`);
  if (!res.ok) throw new Error(`fetch names: ${res.status}`);
  const { data } = (await res.json()) as { data: RawName[] };

  return decorateNames(data);
}

export function useNames() {
  return useQuery({
    queryKey: ['names'],
    queryFn: fetchNames,
    staleTime: Infinity,
  });
}
