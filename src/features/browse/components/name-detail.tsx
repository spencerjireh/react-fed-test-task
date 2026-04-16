import { Bird, Link2, MessageCircle } from 'lucide-react';

import { useNames } from '../api/get-names';
import { useRelatedNames } from '../hooks/use-related-names';
import { useFilterStore } from '../stores/filter-store';

/**
 * Master-detail right pane.
 *
 * Renders the selected name's title, stripped description, related names
 * (top 3, dash-joined), and three stub share icons. When no name is
 * selected, this component returns `null` — the planned Cover hero
 * treatment lives in `BrowseLayout` (branching on `selectedNameId ===
 * null`), not inside this pane, so a placeholder here would be
 * thrown-away code.
 *
 * Related-name derivation uses `useRelatedNames`. Share icons are
 * visible lucide stubs with no `onClick`; handlers will be added later
 * without changing the markup.
 */
export function NameDetail() {
  const selectedNameId = useFilterStore((s) => s.selectedNameId);
  const { data: names } = useNames();
  const related = useRelatedNames(names ?? [], 3);

  // No selection → render nothing. The planned Cover hero will render in
  // BrowseLayout when `selectedNameId === null`, so a placeholder here
  // would be thrown-away code. This explicit guard signals the intent
  // even though the `find`-based check below also covers it.
  if (!selectedNameId) return null;

  // Names may still be loading, or the URL may point at an id that isn't
  // in the current data set. Render nothing until the lookup resolves.
  const current = names?.find((n) => n.id === selectedNameId);
  if (!current) return null;

  return (
    <section
      aria-live="polite"
      aria-label="Selected name details"
      className="flex flex-col gap-4 font-body text-neutral-dark"
    >
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
        <div
          className="flex items-center gap-3 text-neutral-mid"
          aria-label="Share actions"
        >
          <Link2 size={20} aria-label="Copy link" />
          <Bird size={20} aria-label="Share on Twitter" />
          <MessageCircle size={20} aria-label="Share on Messenger" />
        </div>
      </div>
    </section>
  );
}
