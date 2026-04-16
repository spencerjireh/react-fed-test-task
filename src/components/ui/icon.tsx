import type { LucideIcon } from 'lucide-react';

import { cn } from '@/utils/cn';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  'aria-label'?: string;
}

export function Icon({
  icon: IconComponent,
  size = 16,
  className,
  'aria-label': ariaLabel,
}: IconProps) {
  return (
    <IconComponent
      size={size}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      className={cn('shrink-0', className)}
    />
  );
}
