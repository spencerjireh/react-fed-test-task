import { ChevronButton } from '@/components/ui/chevron-button';

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
    <div className="hidden h-full flex-col justify-between md:flex">
      <ChevronButton
        direction="up"
        disabled={atTop}
        onClick={onPrev}
        aria-label="Previous page"
      />
      <ChevronButton
        direction="down"
        disabled={atBottom}
        onClick={onNext}
        aria-label="Next page"
      />
    </div>
  );
}
