// Must track the MSW worker's BASE_URL-derived scope so subpath deploys work.
export const API_BASE = `${import.meta.env.BASE_URL}api`;
