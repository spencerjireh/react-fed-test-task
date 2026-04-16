import { NameList } from './name-list';

const RESULTS_PUPPY_JPG = 'results-puppy.jpg';
const RESULTS_PUPPY_WEBP = 'results-puppy.webp';

export function ResultsPane() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[480px_1fr] md:gap-[52px]">
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
          className="mx-auto w-full max-w-[480px] object-contain"
        />
      </picture>

      <NameList chevronSide="right" centerEffect />
    </div>
  );
}
