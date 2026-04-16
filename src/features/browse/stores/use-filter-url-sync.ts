import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { serializeFilterStateToUrl, useFilterStore } from './filter-store';

/**
 * Mirror the filter store into the URL. Subscribe to every store mutation
 * and push the serialized query string with `replace: true` so the
 * back-button history stays clean (every filter click would otherwise
 * create a back-stack entry).
 *
 * Call this once from the top of BrowseLayout. The hook is safe to be
 * absent — the store works fine without URL mirroring; shared URLs just
 * won't update.
 *
 * localStorage mirroring already happens inside store actions (see
 * filter-store.ts::persist), so this hook is purely about the URL.
 */
export function useFilterUrlSync(): void {
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, reconcile the URL to the *current* store state so a stale
    // path doesn't linger. If hydration picked up URL params, encoding the
    // current state yields the same query string — replaceState becomes a
    // no-op. If hydration came from localStorage (URL was empty), we now
    // broadcast the restored state so the user can copy the URL and share.
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
