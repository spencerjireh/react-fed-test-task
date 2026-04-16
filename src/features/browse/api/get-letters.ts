import { useQuery } from '@tanstack/react-query';

import { API_BASE } from './client';

/**
 * Fetch the A–Z (+ Ñ) letter set.
 *
 * The handler returns `{ data: string[] }` — already a plain string array,
 * no model wrapper. Unused by the current UI; `LETTERS` from
 * `@/config/constants` is the build-time source for the letter strip.
 * This hook exists for future parity (e.g. if the data set ever expands
 * beyond A–Z and we want it server-driven).
 */
export async function fetchLetters(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/letters`);
  if (!res.ok) throw new Error(`fetch letters: ${res.status}`);
  const { data } = (await res.json()) as { data: string[] };
  return data;
}

export function useLetters() {
  return useQuery({
    queryKey: ['letters'],
    queryFn: fetchLetters,
    staleTime: Infinity,
  });
}
