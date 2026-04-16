import { Helmet } from 'react-helmet-async';

import { useNames } from '../api/get-names';
import { useRelatedNames } from '../hooks/use-related-names';
import { useFilterStore } from '../stores/filter-store';

import { ShareActions } from './share-actions';

export function NameDetail() {
  const selectedNameId = useFilterStore((s) => s.selectedNameId);
  const { data: names } = useNames();
  const related = useRelatedNames(names ?? [], 3);

  if (!selectedNameId) return null;

  const current = names?.find((n) => n.id === selectedNameId);
  if (!current) return null;

  return (
    <section
      aria-live="polite"
      aria-label="Selected name details"
      className="flex flex-col gap-4 font-body text-neutral-dark"
    >
      {/* Nested Helmet with a blank titleTemplate wins over the outer Head
          and strips the "| Pet Name Finder" suffix for selected-name pages. */}
      <Helmet titleTemplate="%s" title={`${current.title} - Pet Names`} />

      <header>
        <h2 className="text-[30px] leading-tight">{current.title}</h2>
      </header>

      <hr className="border-neutral-light" />

      <p className="text-[20px] font-light leading-[30px] lg:text-[30px] lg:leading-[55px]">
        {current.definitionText}
      </p>

      <hr className="border-neutral-light" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[20px] text-neutral-dark">Related name</p>
          <p className="text-[20px] font-light text-neutral-mid">
            {related.length
              ? related.map((r) => r.title).join(' - ')
              : '\u2014'}
          </p>
        </div>
        <ShareActions title={current.title} />
      </div>
    </section>
  );
}
