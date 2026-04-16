import { useQuery } from '@tanstack/react-query';

import type { RawCategory } from '../types';

import { API_BASE } from './client';

async function fetchCategories(): Promise<RawCategory[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error(`fetch categories: ${res.status}`);
  const { data } = (await res.json()) as { data: RawCategory[] };
  return data;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
}
