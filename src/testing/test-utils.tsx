import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, useLocation } from 'react-router';

import { useFilterUrlSync } from '@/features/browse/hooks/use-filter-url-sync';

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

export function renderApp(
  ui: ReactElement,
  { url = '/', ...renderOptions }: AppRenderOptions = {},
) {
  const queryClient = createTestQueryClient();

  const view = render(ui, {
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

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">{location.pathname + location.search}</div>
  );
}

export function UrlSyncHarness({ children }: { children: ReactNode }) {
  useFilterUrlSync();
  return (
    <>
      <LocationProbe />
      {children}
    </>
  );
}

export * from '@testing-library/react';
export { userEvent };
