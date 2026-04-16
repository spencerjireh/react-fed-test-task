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
      selectedNameTitle: null,
    });
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
  });

  it('renders nothing when no name is selected', () => {
    renderApp(<NameDetailDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens as a dialog containing the selected name description', async () => {
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });
    renderApp(<NameDetailDialog />);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      await screen.findByText(/The hero of Homer.*Iliad\./),
    ).toBeInTheDocument();
  });

  it('Escape closes the dialog, clears the selection, and restores focus', async () => {
    const stubItem = document.createElement('button');
    stubItem.setAttribute('data-name-title', 'Andromeda');
    stubItem.textContent = 'Andromeda';
    document.body.appendChild(stubItem);

    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });
    renderApp(<NameDetailDialog />);

    await screen.findByRole('dialog');
    await screen.findByText(/The hero of Homer/);

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(useFilterStore.getState().selectedNameTitle).toBeNull();
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => expect(stubItem).toHaveFocus());

    stubItem.remove();
  });

  it('unmounts the dialog when selectedNameTitle is cleared externally', async () => {
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });
    renderApp(<NameDetailDialog />);

    await screen.findByRole('dialog');

    useFilterStore.setState({ selectedNameTitle: null });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
