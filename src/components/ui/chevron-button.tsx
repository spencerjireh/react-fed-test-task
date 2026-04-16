import { cn } from '@/lib/cn';

interface ChevronButtonProps {
  direction: 'up' | 'down';
  disabled: boolean;
  onClick: () => void;
  'aria-label': string;
  className?: string;
}

/**
 * 48×48 chevron-in-a-circle button used for paginating lists.
 *
 * SVG path is inlined so `stroke="currentColor"` can be driven by the
 * Tailwind colour classes on the button (red-main when enabled,
 * neutral-light when disabled). The source SVGs under `src/assets/icons/`
 * have a hard-coded neutral stroke and can't be re-coloured via CSS on
 * their own — inlining is the simplest fix without a separate SVGR
 * pipeline.
 */
export function ChevronButton({
  direction,
  disabled,
  onClick,
  'aria-label': ariaLabel,
  className,
}: ChevronButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'flex h-12 w-12 items-center justify-center transition-transform',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light',
        disabled
          ? 'cursor-not-allowed text-neutral-light'
          : 'text-red-main hover:scale-[1.05] active:scale-100',
        className,
      )}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={direction === 'up' ? 'M12 30L24 18L36 30' : 'M12 18L24 30L36 18'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
