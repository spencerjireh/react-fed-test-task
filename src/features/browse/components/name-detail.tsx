import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

import { useRelatedNames } from '../hooks/use-related-names';
import { useSelectedName } from '../hooks/use-selected-name';

import { GenderMacroRow } from './gender-macro-row';
import { ShareActions } from './share-actions';

export function NameDetail() {
  const current = useSelectedName();
  const related = useRelatedNames(3);
  const reduce = useReducedMotion();

  if (!current) return null;

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.18, ease: 'easeOut' as const };

  return (
    <section
      aria-live="polite"
      aria-label="Selected name details"
      className="flex min-h-0 flex-col font-body text-neutral-dark md:h-full md:overflow-y-auto"
    >
      {/* Blank titleTemplate drops the outer "| Pet Name Finder" suffix. */}
      <Helmet titleTemplate="%s" title={`${current.title} - Pet Names`} />

      <motion.div
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="flex flex-col gap-6 md:my-auto"
      >
        <GenderMacroRow name={current} />

        <hr className="border-neutral-light" />

        <p className="text-[18px] font-light leading-[28px] lg:text-[26px] lg:leading-[44px]">
          {current.definitionText}
        </p>

        <hr className="border-neutral-light" />

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] text-neutral-dark">Related name</p>
            <p className="text-[16px] font-light text-neutral-mid">
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
