import { useCategories } from '../api/get-categories';
import { useFilterStore } from '../stores/filter-store';
import { describeFilters } from '../utils/describe-filters';

export function EmptyResults() {
  const gender = useFilterStore((s) => s.gender);
  const letter = useFilterStore((s) => s.letter);
  const rawCategories = useFilterStore((s) => s.rawCategories);
  const clearFilters = useFilterStore((s) => s.clearFilters);

  const { data: categories } = useCategories();

  const subline = describeFilters(gender, letter, rawCategories, categories);

  return (
    <div
      role="status"
      className="flex size-full flex-col items-center justify-center px-4 text-center"
      style={{ containerType: 'inline-size' }}
    >
      <h2
        aria-label="No luck"
        className="font-heading font-bold leading-[0.82] text-red-main"
        style={{
          fontSize: 'clamp(40px, 18cqw, 96px)',
          textShadow:
            '0px 2px 12px rgba(58,53,51,0.1), 0px 0px 2px rgba(58,53,51,0.2)',
        }}
      >
        <span aria-hidden="true" className="block">
          NO
        </span>
        <span aria-hidden="true" className="block">
          LUCK.
        </span>
      </h2>
      <p className="mt-4 max-w-[28ch] text-[14px] leading-[20px] text-neutral-mid">
        {subline}
      </p>
      <button
        type="button"
        onClick={clearFilters}
        className="mt-6 rounded-[4px] px-4 py-[10px] font-heading text-[16px] font-medium text-red-main hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main"
      >
        Clear filters
      </button>
    </div>
  );
}
