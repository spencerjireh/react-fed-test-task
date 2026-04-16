import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/**
 * Loading placeholder primitive. A pulsing neutral-light block that callers
 * shape via `className` (width/height). Default is a single-line row that
 * matches `NameListItem`'s default row metrics so a `NameList` viewport full
 * of skeletons doesn't jump on data resolve.
 *
 * `NameList` renders `PAGE_SIZE` (11) of these while `useNames()` is
 * pending, which matches the final viewport size so resolution doesn't
 * cause a layout jump.
 */
export function Skeleton({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'h-4 w-full animate-pulse rounded-md bg-neutral-light/60',
        className,
      )}
      {...rest}
    />
  );
}
