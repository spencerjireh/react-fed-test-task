import { beforeEach, describe, expect, it } from 'vitest';

import { renderApp, screen } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import { ResultsPane } from '../results-pane';

describe('ResultsPane', () => {
  beforeEach(() => {
    useFilterStore.setState({
      gender: 'M',
      letter: 'A',
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
  });

  it('renders the puppy hero image with a BASE_URL-derived src', () => {
    renderApp(
      <ResultsPane>
        <div data-testid="stub-child" />
      </ResultsPane>,
    );

    const img = screen.getByTestId('results-puppy-img');
    expect(img).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}results-puppy.jpg`,
    );
  });

  it('returns to cover when the puppy button is clicked', () => {
    renderApp(
      <ResultsPane>
        <div data-testid="stub-child" />
      </ResultsPane>,
    );

    screen.getByRole('button', { name: /return to cover/i }).click();

    const state = useFilterStore.getState();
    expect(state.gender).toBe('Both');
    expect(state.letter).toBeNull();
    expect(state.macroCategories.size).toBe(0);
    expect(state.rawCategories.size).toBe(0);
    expect(state.selectedNameTitle).toBeNull();
  });

  it('renders the override child instead of the default NameList', () => {
    renderApp(
      <ResultsPane>
        <div data-testid="stub-child">override</div>
      </ResultsPane>,
    );

    expect(screen.getByTestId('stub-child')).toBeInTheDocument();
  });
});
