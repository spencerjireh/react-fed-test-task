import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

export function AppRouter() {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          lazy: () => import('./routes/browse'),
        },
      ]),
    [],
  );

  return <RouterProvider router={router} />;
}
