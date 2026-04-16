import type { ReactNode } from 'react';

import { useFilterStore } from '../stores/filter-store';

import { NameList } from './name-list';

const RESULTS_PUPPY_JPG = 'results-puppy.jpg';
const RESULTS_PUPPY_WEBP = 'results-puppy.webp';

interface ResultsPaneProps {
  children?: ReactNode;
}

export function ResultsPane({ children }: ResultsPaneProps = {}) {
  const base = import.meta.env.BASE_URL;
  const goToCover = useFilterStore((s) => s.goToCover);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)] items-stretch gap-8 md:grid-cols-[480px_1fr] md:gap-[52px]">
      <button
        type="button"
        onClick={goToCover}
        aria-label="Return to cover"
        className="mx-auto flex size-full max-w-[480px] items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main"
      >
        <picture className="flex size-full items-center justify-center">
          <source srcSet={`${base}${RESULTS_PUPPY_WEBP}`} type="image/webp" />
          <img
            src={`${base}${RESULTS_PUPPY_JPG}`}
            width={480}
            height={606}
            alt=""
            loading="eager"
            fetchPriority="high"
            data-testid="results-puppy-img"
            className="max-h-full max-w-full object-contain"
          />
        </picture>
      </button>

      {children ?? <NameList chevronSide="right" variant="results" />}
    </div>
  );
}
