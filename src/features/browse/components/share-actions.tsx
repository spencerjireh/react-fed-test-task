import type { ButtonHTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/cn';

import { ShareLinkIcon } from './icons/share-link';
import { ShareMessengerIcon } from './icons/share-messenger';
import { ShareTwitterIcon } from './icons/share-twitter';

const TOAST_DURATION_MS = 1800;

interface ShareActionsProps {
  title: string;
}

export function ShareActions({ title }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const href = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(href);
    } catch {
      return;
    }
    setCopied(true);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, TOAST_DURATION_MS);
  };

  const handleTweet = () => {
    const tweetText = `I found the perfect pet name: ${title}`;
    const url = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleMessenger = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative flex items-center gap-3 text-neutral-dark">
      <ShareButton aria-label="Copy link" onClick={handleCopyLink}>
        <ShareLinkIcon size={24} />
      </ShareButton>
      <ShareButton aria-label="Share on Twitter" onClick={handleTweet}>
        <ShareTwitterIcon size={24} />
      </ShareButton>
      <ShareButton aria-label="Share on Facebook" onClick={handleMessenger}>
        <ShareMessengerIcon size={24} />
      </ShareButton>

      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          'pointer-events-none absolute -top-7 right-0 rounded bg-neutral-dark px-2 py-0.5 text-xs text-white transition-opacity duration-150',
          copied ? 'opacity-100' : 'opacity-0',
        )}
      >
        {copied ? 'Copied' : null}
      </span>
    </div>
  );
}

type ShareButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string;
};

function ShareButton({ children, className, ...props }: ShareButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-full transition-colors hover:text-red-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
