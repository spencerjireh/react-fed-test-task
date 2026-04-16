import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

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
