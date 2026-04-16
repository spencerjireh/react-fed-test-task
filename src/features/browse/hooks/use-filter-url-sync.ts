import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import {
  serializeFilterStateToUrl,
  useFilterStore,
} from '../stores/filter-store';

export function useFilterUrlSync(): void {
  const navigate = useNavigate();

  useEffect(() => {
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
