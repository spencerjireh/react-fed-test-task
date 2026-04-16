import { ChevronButton } from '@/components/ui/chevron-button';
import { VIEWPORT_HEIGHT } from '@/config/constants';

interface ChevronPairProps {
  page: number;
  maxPage: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Vertical pair of pagination chevrons flanking the name list.
 *
 * Fixed at the list's viewport height so the two buttons anchor the top
 * and bottom of the visible window. Hidden below the `md` breakpoint —
 * on mobile the list falls back to native vertical scroll with no
 * chevron UI (a Phase 6 decision locked in the layout story).
 */
export function ChevronPair({
  page,
  maxPage,
  onPrev,
  onNext,
}: ChevronPairProps) {
  return (
    <div
      className="hidden flex-col justify-between md:flex"
      style={{ height: VIEWPORT_HEIGHT }}
    >
      <ChevronButton
        direction="up"
        disabled={page <= 0}
        onClick={onPrev}
        aria-label="Previous 11 names"
      />
      <ChevronButton
        direction="down"
        disabled={page >= maxPage}
        onClick={onNext}
        aria-label="Next 11 names"
      />
    </div>
  );
}
