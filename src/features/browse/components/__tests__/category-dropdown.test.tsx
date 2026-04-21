import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import type { RawCategory } from '../../types';
import { CategoryDropdown } from '../category-dropdown';

const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const DISNEY_ID = '019c8a34-35f2-70b1-b866-69a4921d15a8';
const LITERARY_ID = '019c8a34-360b-735c-88e7-5d86357a91a2';

const FAMOUS_FIXTURE: RawCategory[] = [
  { id: CARTOON_ID, name: 'Cartoon' },
  { id: DISNEY_ID, name: 'Disney' },
  { id: LITERARY_ID, name: 'Literary' },
];

describe('CategoryDropdown', () => {
  beforeEach(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
    server.use(
      http.get('*/api/categories', () =>
        HttpResponse.json({ data: FAMOUS_FIXTURE }),
      ),
    );
  });

  it('renders a trigger labeled "Filter by Famous" with aria-expanded=false when closed', () => {
    renderApp(
      <CategoryDropdown macro="Famous" isOpen={false} onToggle={() => {}} />,
    );

    const trigger = screen.getByRole('button', { name: /Filter by Famous/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('flips aria-expanded and rotates the chevron when isOpen=true', () => {
    renderApp(
      <CategoryDropdown macro="Famous" isOpen={true} onToggle={() => {}} />,
    );

    const trigger = screen.getByRole('button', { name: /Filter by Famous/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // Chevron rotation is a child SVG wrapper with .rotate-180.
    expect(trigger.querySelector('.rotate-180')).not.toBeNull();
  });

  it('calls onToggle when the trigger is clicked', async () => {
    const onToggle = vi.fn();
    renderApp(
      <CategoryDropdown macro="Famous" isOpen={false} onToggle={onToggle} />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Filter by Famous/i }),
    );

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('marks the trigger as active when any raw in the macro is selected', async () => {
    useFilterStore.setState({
      rawCategories: new Set([CARTOON_ID]),
    });
    renderApp(
      <CategoryDropdown macro="Famous" isOpen={false} onToggle={() => {}} />,
    );

    await waitFor(() => {
      const trigger = screen.getByRole('button', { name: /Filter by Famous/i });
      expect(trigger).toHaveAttribute('data-active', 'true');
    });
  });

  it('does not mark the trigger as active when no selection in that macro', async () => {
    renderApp(
      <CategoryDropdown macro="Famous" isOpen={false} onToggle={() => {}} />,
    );

    await waitFor(() => {
      const trigger = screen.getByRole('button', { name: /Filter by Famous/i });
      expect(trigger).not.toHaveAttribute('data-active');
    });
  });
});
