import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render as rtlRender,
  type RenderOptions,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
    },
  });
}

type AppRenderOptions = RenderOptions & {
  url?: string;
};

/**
 * Test render with the full provider chain: HelmetProvider →
 * QueryClientProvider → MemoryRouter. `useNavigate`, `useLocation`, etc.
 * work from within any rendered component.
 *
 * The `url` option seeds the MemoryRouter's initial entry so tests that care
 * about URL state (e.g. `useFilterUrlSync` write-through) can assert on
 * location changes via `window.location`-style helpers. MemoryRouter keeps
 * its own in-memory history — assertions should go through the hook under
 * test (read store state) rather than `window.location`.
 */
export function renderApp(
  ui: ReactElement,
  { url = '/', ...renderOptions }: AppRenderOptions = {},
) {
  const queryClient = createTestQueryClient();

  const view = rtlRender(ui, {
    wrapper: ({ children }) => (
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    ),
    ...renderOptions,
  });

  return { ...view, queryClient };
}

export * from '@testing-library/react';
export { userEvent, rtlRender };
