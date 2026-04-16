import { useFilterStore } from '../stores/filter-store';

import { NameList } from './name-list';

const RESULTS_PUPPY_JPG = 'results-puppy.jpg';
const RESULTS_PUPPY_WEBP = 'results-puppy.webp';

export function ResultsPane() {
  const base = import.meta.env.BASE_URL;
  const goToCover = useFilterStore((s) => s.goToCover);

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[480px_1fr] md:gap-[52px]">
      <button
        type="button"
        onClick={goToCover}
        aria-label="Return to cover"
        className="mx-auto block w-full max-w-[480px] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main"
      >
        <picture>
          <source srcSet={`${base}${RESULTS_PUPPY_WEBP}`} type="image/webp" />
          <img
            src={`${base}${RESULTS_PUPPY_JPG}`}
            width={480}
            height={606}
            alt=""
            loading="eager"
            fetchPriority="high"
            data-testid="results-puppy-img"
            className="w-full object-contain"
          />
        </picture>
      </button>

      <NameList chevronSide="right" variant="results" />
    </div>
  );
}
