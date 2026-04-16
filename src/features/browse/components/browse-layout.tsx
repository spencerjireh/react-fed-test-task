import { Head } from '@/components/seo/head';

import { useFilterUrlSync } from '../stores/use-filter-url-sync';

import { NameDetail } from './name-detail';
import { NameList } from './name-list';

/**
 * Top-level feature shell. Responsible for:
 *
 *   - Mounting `useFilterUrlSync` exactly once so every store mutation
 *     mirrors to the URL (the other half of the URL ↔ store sync; the
 *     store writes localStorage from its own actions).
 *   - Reserving layout regions for future slots (gender band, filter
 *     bar, letter strip, cover hero) without rendering empty placeholder
 *     divs. The commented lines mark where those components will land.
 *   - Composing the master (list) / detail grid.
 *
 * When a Cover hero treatment is added, it will branch on
 * `selectedNameId === null` and render in place of the list/detail
 * grid; until then the grid is always mounted and `NameDetail` returns
 * null when no name is selected.
 */
export function BrowseLayout() {
  useFilterUrlSync();

  return (
    <div className="min-h-screen bg-cream-light">
      <Head title="Browse" />

      {/* TODO: <GenderBand /> */}
      {/* TODO: <FilterBar /> */}

      <main className="mx-auto max-w-[1440px] px-6 py-10 md:px-12 lg:px-[165px] lg:py-[40px]">
        <h1 className="font-heading text-[30px] leading-[36px] text-neutral-dark">
          All pets names
        </h1>

        {/* TODO: <LetterStrip /> */}

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-[40px] lg:grid-cols-[352px_1fr] lg:gap-[100px]">
          <NameList />
          <NameDetail />
        </div>
      </main>
    </div>
  );
}
