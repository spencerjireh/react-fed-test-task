import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import type { RawName } from '../../types';
import { NameDetailDialog } from '../name-detail-dialog';

const FIXTURE: RawName[] = [
  {
    id: 'andromeda-id',
    title: 'Andromeda',
    definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
    gender: ['F'],
    categories: ['shared'],
  },
  {
    id: 'achilles-id',
    title: 'Achilles',
    definition: '<p>Greek warrior.</p>',
    gender: ['M'],
    categories: ['shared'],
  },
];

describe('NameDetailDialog', () => {
  beforeEach(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameId: null,
      page: 0,
    });
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
  });

  it('renders nothing when no name is selected', () => {
    renderApp(<NameDetailDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens as a dialog containing the selected name heading', async () => {
    useFilterStore.setState({ selectedNameId: 'andromeda-id' });
    renderApp(<NameDetailDialog />);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Andromeda', level: 2 }),
    ).toBeInTheDocument();
  });

  it('Escape closes the dialog, clears the selection, and restores focus', async () => {
    // Stub list-item the focus-restore handler will seek out by data-name-id.
    const stubItem = document.createElement('button');
    stubItem.setAttribute('data-name-id', 'andromeda-id');
    stubItem.textContent = 'Andromeda';
    document.body.appendChild(stubItem);

    useFilterStore.setState({ selectedNameId: 'andromeda-id' });
    renderApp(<NameDetailDialog />);

    await screen.findByRole('dialog');
    await screen.findByRole('heading', { name: 'Andromeda' });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(useFilterStore.getState().selectedNameId).toBeNull();
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => expect(stubItem).toHaveFocus());

    stubItem.remove();
  });

  it('unmounts the dialog when selectedNameId is cleared externally', async () => {
    useFilterStore.setState({ selectedNameId: 'andromeda-id' });
    renderApp(<NameDetailDialog />);

    await screen.findByRole('dialog');

    useFilterStore.setState({ selectedNameId: null });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
