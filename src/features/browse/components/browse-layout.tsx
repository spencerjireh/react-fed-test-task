import { Head } from '@/components/seo/head';

import { useFilterUrlSync } from '../stores/use-filter-url-sync';

import { FilterBar } from './filter-bar';
import { GenderBand } from './gender-band';
import { LetterStrip } from './letter-strip';
import { NameDetail } from './name-detail';
import { NameList } from './name-list';

export function BrowseLayout() {
  useFilterUrlSync();

  return (
    <div className="min-h-screen bg-cream-light">
      <Head title="Browse" />

      <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap px-4 py-3 md:block md:gap-0 md:overflow-visible md:whitespace-normal md:p-0">
        <GenderBand />
        <FilterBar />
      </div>

      <main className="mx-auto max-w-[1440px] px-6 py-10 md:px-12 lg:px-[165px] lg:py-[40px]">
        <h1 className="font-heading text-[30px] leading-[36px] text-neutral-dark">
          All pets names
        </h1>

        <div className="mt-6">
          <LetterStrip />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-[40px] lg:grid-cols-[352px_1fr] lg:gap-[100px]">
          <NameList />
          <NameDetail />
        </div>
      </main>
    </div>
  );
}
