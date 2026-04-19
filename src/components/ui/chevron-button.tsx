import { motion } from 'framer-motion';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/utils/cn';

interface ChevronButtonProps {
  direction: 'up' | 'down';
  disabled: boolean;
  onClick: () => void;
  'aria-label': string;
}

// SVG inlined so stroke="currentColor" picks up text-* classes.
export function ChevronButton({
  direction,
  disabled,
  onClick,
  'aria-label': ariaLabel,
}: ChevronButtonProps) {
  const reduce = useReducedMotion();
  const hoverScale = reduce || disabled ? 1 : 1.05;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 1 }}
      className={cn(
        'flex h-12 w-12 items-center justify-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light',
        disabled ? 'cursor-not-allowed text-neutral-light' : 'text-red-main',
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
    </motion.button>
  );
}
