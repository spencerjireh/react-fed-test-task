import { env } from '@/config/env';

export const enableMocking = async () => {
  if (!env.ENABLE_API_MOCKING) return;

  const { worker } = await import('./browser');
  const { initializeDb } = await import('./db');
  await initializeDb();
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
};
