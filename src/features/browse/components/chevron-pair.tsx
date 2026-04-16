import { ChevronButton } from '@/components/ui/chevron-button';
import { VIEWPORT_HEIGHT } from '@/config/constants';

interface ChevronPairProps {
  page: number;
  maxPage: number;
  onPrev: () => void;
  onNext: () => void;
}

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
