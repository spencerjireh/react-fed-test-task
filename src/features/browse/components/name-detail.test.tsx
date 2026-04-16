import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../stores/filter-store';
import type { RawName } from '../types';

import { NameDetail } from './name-detail';

const FIXTURE: RawName[] = [
  {
    id: 'andromeda-id',
    title: 'Andromeda',
    definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
    gender: ['F'],
    categories: ['shared'],
  },
  {
    id: 'athena-id',
    title: 'Athena',
    definition: '<p>Goddess of wisdom.</p>',
    gender: ['F'],
    categories: ['shared'],
  },
];

describe('NameDetail', () => {
  it('renders nothing when no name is selected', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );

    renderApp(<NameDetail />);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('renders the title and stripped description when a name is selected', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
    useFilterStore.setState({ selectedNameId: 'andromeda-id' });

    renderApp(<NameDetail />);

    expect(
      await screen.findByRole('heading', { name: 'Andromeda', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/The hero of Homer.*Iliad\./)).toBeInTheDocument();
  });

  it('renders a dash-joined related-name list', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
    useFilterStore.setState({ selectedNameId: 'andromeda-id' });

    renderApp(<NameDetail />);

    await screen.findByRole('heading', { name: 'Andromeda' });
    await waitFor(() => {
      expect(screen.getByText(/Athena/)).toBeInTheDocument();
    });
    expect(screen.getByText('Related name')).toBeInTheDocument();
  });
});
