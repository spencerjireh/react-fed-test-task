import '@testing-library/jest-dom/vitest';

import { initializeDb, resetDb } from '@/testing/mocks/db';
import { server } from '@/testing/mocks/server';

vi.mock('zustand');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(() => {
  // Must be a class — `vi.fn()` fails the `new.target` check Radix/floating-ui do.
  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);

  // jsdom has no matchMedia. Default to `true` so components see the
  // desktop layout; per-test stubs can flip it.
  if (!('matchMedia' in window) || typeof window.matchMedia !== 'function') {
    const createMql = (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => createMql(query),
    });
  }

  initializeDb();
});
afterEach(() => {
  server.resetHandlers();
  resetDb();
});
