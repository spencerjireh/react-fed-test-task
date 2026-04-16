import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { serializeFilterStateToUrl, useFilterStore } from './filter-store';

/** Keeps the URL in sync with the filter store. */
export function useFilterUrlSync(): void {
  const navigate = useNavigate();

  useEffect(() => {
    // Sync the current store state on mount in case it came from localStorage.
    const initialQuery = serializeFilterStateToUrl(useFilterStore.getState());
    navigate(
      { search: initialQuery ? `?${initialQuery}` : '' },
      { replace: true },
    );

    const unsubscribe = useFilterStore.subscribe((state) => {
      const query = serializeFilterStateToUrl(state);
      navigate({ search: query ? `?${query}` : '' }, { replace: true });
    });
    return unsubscribe;
  }, [navigate]);
}
