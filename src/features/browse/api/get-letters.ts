import { useQuery } from '@tanstack/react-query';

import { API_BASE } from './client';

async function fetchLetters(): Promise<string[]> {
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
