/**
 * Base URL for all feature API calls.
 *
 * Derived from Vite's `import.meta.env.BASE_URL`. On root deploys this
 * resolves to `/api`; on subpath deploys (GitHub Pages at
 * `/dog-name-generator/`) it resolves to `/dog-name-generator/api`. Both
 * land inside the MSW Service Worker's registered scope, which is also
 * `BASE_URL`-derived — keeping the two in lockstep is why neither value
 * may be hardcoded.
 */
export const API_BASE = `${import.meta.env.BASE_URL}api`;
