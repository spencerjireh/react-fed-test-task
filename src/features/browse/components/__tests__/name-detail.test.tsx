import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import type { RawCategory, RawName } from '../../types';
import { NameDetail } from '../name-detail';

const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const CELEBRITIES_ID = '019c8a34-35ed-737c-acff-a43af999817c';
const DISNEY_ID = '019c8a34-35f2-70b1-b866-69a4921d15a8';

// Overlap fixture: Andromeda (selected) shares two categories with Apollo,
// one each with Ares and Atlas, none with Boris. Top-3 should sort by
// overlap DESC, then title ASC: Apollo, Ares, Atlas.
const FIXTURE: RawName[] = [
  {
    id: 'andromeda-id',
    title: 'Andromeda',
    definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
    gender: ['F'],
    categories: [CARTOON_ID, DISNEY_ID],
  },
  {
    id: 'apollo-id',
    title: 'Apollo',
    definition: '<p>Greek god of the sun.</p>',
    gender: ['M'],
    categories: [CARTOON_ID, DISNEY_ID],
  },
  {
    id: 'atlas-id',
    title: 'Atlas',
    definition: '<p>Titan who holds the sky.</p>',
    gender: ['M'],
    categories: [CARTOON_ID],
  },
  {
    id: 'ares-id',
    title: 'Ares',
    definition: '<p>Greek god of war.</p>',
    gender: ['M'],
    categories: [DISNEY_ID],
  },
  {
    id: 'boris-id',
    title: 'Boris',
    definition: '<p>Unrelated.</p>',
    gender: ['M'],
    categories: [CELEBRITIES_ID],
  },
];

const CATEGORIES_FIXTURE: RawCategory[] = [
  { id: CARTOON_ID, name: 'Cartoon' },
  { id: CELEBRITIES_ID, name: 'Celebrities' },
  { id: DISNEY_ID, name: 'Disney' },
];

function seedHandlers(names: RawName[] = FIXTURE) {
  server.use(
    http.get('*/api/names', () => HttpResponse.json({ data: names })),
    http.get('*/api/categories', () =>
      HttpResponse.json({ data: CATEGORIES_FIXTURE }),
    ),
  );
}

describe('NameDetail', () => {
  it('renders nothing when no name is selected', async () => {
    seedHandlers();

    renderApp(<NameDetail />);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('renders the stripped description when a name is selected', async () => {
    seedHandlers();
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<NameDetail />);

    expect(
      await screen.findByText(/The hero of Homer.*Iliad\./),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Andromeda', level: 2 }),
    ).not.toBeInTheDocument();
  });

  it('shows the top-3 related names dash-joined in overlap-then-alpha order', async () => {
    seedHandlers();
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<NameDetail />);

    await waitFor(() => {
      expect(screen.getByText('Apollo - Ares - Atlas')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Boris/)).not.toBeInTheDocument();
  });

  it('updates document.title to "{name} - Pet Names" when selected', async () => {
    seedHandlers();
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<NameDetail />);

    await screen.findByText(/The hero of Homer/);
    await waitFor(() => {
      expect(document.title).toBe('Andromeda - Pet Names');
    });
  });

  it('renders the gender glyph + macro - raw row as the first detail row', async () => {
    // Andromeda has gender ['F'] and categories [Cartoon, Disney]; Cartoon
    // wins the alpha tiebreak.
    seedHandlers();
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<NameDetail />);

    await screen.findByRole('img', { name: 'Female' });
    await waitFor(() => {
      expect(screen.getByText('Famous, Funny - Cartoon')).toBeInTheDocument();
    });
  });

  it('renders the both-genders icon when gender is empty (Marley) and still resolves macro + raw', async () => {
    const MARLEY_FIXTURE: RawName[] = [
      {
        id: 'marley-id',
        title: 'Marley',
        definition: '<p>No gender set.</p>',
        gender: [],
        categories: [CELEBRITIES_ID],
      },
    ];
    seedHandlers(MARLEY_FIXTURE);
    useFilterStore.setState({ selectedNameTitle: 'Marley' });

    renderApp(<NameDetail />);

    await screen.findByRole('img', { name: 'Male and female' });
    await waitFor(() => {
      expect(screen.getByText('Famous - Celebrities')).toBeInTheDocument();
    });
  });
});
