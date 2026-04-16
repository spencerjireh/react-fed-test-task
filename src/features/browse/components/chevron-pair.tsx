import { ChevronButton } from '@/components/ui/chevron-button';
import { VIEWPORT_HEIGHT } from '@/config/constants';

interface ChevronPairProps {
  atTop: boolean;
  atBottom: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function ChevronPair({
  atTop,
  atBottom,
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
        disabled={atTop}
        onClick={onPrev}
        aria-label="Previous 11 names"
      />
      <ChevronButton
        direction="down"
        disabled={atBottom}
        onClick={onNext}
        aria-label="Next 11 names"
      />
    </div>
  );
}
