import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Preview } from '@storybook/react-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';

import { handlers } from '../src/testing/mocks/handlers';

import '../src/styles/index.css';

initialize({ onUnhandledRequest: 'bypass' });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: { handlers },
  },
  loaders: [mswLoader],
  decorators: [
    // MemoryRouter is load-bearing: `useFilterUrlSync` (mounted by
    // `BrowseLayout` and anything that renders it) calls `useNavigate`,
    // which throws without a router ancestor. Keeping the router global
    // means every story Just Works without per-story boilerplate.
    (Story) => (
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <div className="min-h-screen bg-cream-light font-body text-neutral-dark">
              <Story />
            </div>
          </MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    ),
  ],
};

export default preview;
