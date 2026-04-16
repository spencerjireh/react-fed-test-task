import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

export function AppRouter() {
  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            path: '/',
            lazy: () => import('./routes/browse'),
          },
        ],
        { basename: import.meta.env.BASE_URL },
      ),
    [],
  );

  return <RouterProvider router={router} />;
}
