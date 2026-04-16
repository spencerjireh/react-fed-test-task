import '@testing-library/jest-dom/vitest';

import { initializeDb, resetDb } from '@/testing/mocks/db';
import { server } from '@/testing/mocks/server';

vi.mock('zustand');

// Vitest 4's built-in localStorage stub doesn't implement enough of the API.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const sharedLocalStorage = new MemoryStorage();
vi.stubGlobal('localStorage', sharedLocalStorage);
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  writable: true,
  value: sharedLocalStorage,
});

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
  sharedLocalStorage.clear();
  initializeDb();
});
afterEach(() => {
  server.resetHandlers();
  resetDb();
});
