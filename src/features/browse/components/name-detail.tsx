import { motion } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

import { useRelatedNames } from '../hooks/use-related-names';
import { useSelectedName } from '../hooks/use-selected-name';
import { useFilterStore } from '../stores/filter-store';

import { ShareActions } from './share-actions';

function restoreFocusToListItem(title: string) {
  queueMicrotask(() => {
    const selector = `[data-name-title="${CSS.escape(title)}"]`;
    const target = document.querySelector(selector);
    (target as HTMLElement | null)?.focus();
  });
}

export function NameDetail() {
  const current = useSelectedName();
  const setSelectedNameTitle = useFilterStore((s) => s.setSelectedNameTitle);
  const related = useRelatedNames(3);
  const reduce = useReducedMotion();

  // Callback ref: a useEffect keyed on title would fire before the names query
  // resolves, when the h2 isn't yet in the tree.
  const focusHeadingOnMount = useCallback((node: HTMLHeadingElement | null) => {
    if (node) node.focus();
  }, []);

  const currentTitle = current?.title ?? null;

  useEffect(() => {
    if (!currentTitle) return;
    const previousTitle = currentTitle;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setSelectedNameTitle(null);
      restoreFocusToListItem(previousTitle);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [currentTitle, setSelectedNameTitle]);

  if (!current) return null;

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.18, ease: 'easeOut' as const };

  return (
    <section
      aria-live="polite"
      aria-label="Selected name details"
      className="flex flex-col gap-4 font-body text-neutral-dark"
    >
      {/* Blank titleTemplate drops the outer "| Pet Name Finder" suffix. */}
      <Helmet titleTemplate="%s" title={`${current.title} - Pet Names`} />

      <motion.div
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="flex flex-col gap-4"
      >
        <header>
          <h2
            ref={focusHeadingOnMount}
            tabIndex={-1}
            className="text-[30px] leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light"
          >
            {current.title}
          </h2>
        </header>

        <hr className="border-neutral-light" />

        <p className="text-[20px] font-light leading-[30px] lg:text-[30px] lg:leading-[55px]">
          {current.definitionText}
        </p>

        <hr className="border-neutral-light" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[20px] text-neutral-dark">Related name</p>
            <p className="text-[20px] font-light text-neutral-mid">
              {related.length
                ? related.map((r) => r.title).join(' - ')
                : '\u2014'}
            </p>
          </div>
          <ShareActions title={current.title} />
        </div>
      </motion.div>
    </section>
  );
}
