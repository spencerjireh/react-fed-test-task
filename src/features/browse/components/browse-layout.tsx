import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

import { FeatureErrorFallback } from '@/components/errors/feature-error-fallback';
import { Head } from '@/components/seo/head';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

import { useFilterStore } from '../stores/filter-store';
import { useFilterUrlSync } from '../stores/use-filter-url-sync';

import { CoverHero } from './cover-hero';
import { FilterBar } from './filter-bar';
import { GenderBand } from './gender-band';
import { LetterStrip } from './letter-strip';
import { NameDetail } from './name-detail';
import { NameDetailDialog } from './name-detail-dialog';
import { NameList } from './name-list';

export function BrowseLayout() {
  useFilterUrlSync();
  const selectedNameId = useFilterStore((s) => s.selectedNameId);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reduce = useReducedMotion();

  const fadeTransition = reduce ? { duration: 0 } : { duration: 0.2 };

  return (
    <div className="min-h-screen bg-cream-light">
      <Head title="Browse" />

      <nav
        aria-label="Filter pet names"
        className="flex items-center gap-3 overflow-x-auto whitespace-nowrap px-4 py-3 md:block md:gap-0 md:overflow-visible md:whitespace-normal md:p-0"
      >
        <GenderBand />
        <FilterBar />
      </nav>

      <main className="mx-auto max-w-[1440px] px-6 py-10 md:px-[48px] xl:px-[165px] xl:py-[40px]">
        <h1 className="font-heading text-[30px] leading-[36px] text-neutral-dark">
          All pets names
        </h1>

        <div className="mt-6">
          <LetterStrip />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {selectedNameId === null ? (
            <motion.div
              key="cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <CoverHero />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="mt-10 grid grid-cols-1 gap-8 md:mt-[40px] md:grid-cols-[352px_1fr] xl:gap-[100px]"
            >
              <ErrorBoundary FallbackComponent={FeatureErrorFallback}>
                <NameList />
              </ErrorBoundary>
              <ErrorBoundary FallbackComponent={FeatureErrorFallback}>
                {isDesktop ? <NameDetail /> : <NameDetailDialog />}
              </ErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
