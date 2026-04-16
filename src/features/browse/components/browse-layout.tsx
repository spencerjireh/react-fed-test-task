import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FeatureErrorFallback } from '@/components/errors/feature-error-fallback';
import { Head } from '@/components/seo/head';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

import { type BrowseState, useBrowseState } from '../hooks/use-browse-state';
import { useReconcileSelection } from '../hooks/use-reconcile-selection';
import { useFilterStore } from '../stores/filter-store';
import { useFilterUrlSync } from '../stores/use-filter-url-sync';
import { focusNameItem } from '../utils/focus-name-item';

import { CoverHero } from './cover-hero';
import { EmptyResults } from './empty-results';
import { FilterBar } from './filter-bar';
import { GenderBand } from './gender-band';
import { LetterStrip } from './letter-strip';
import { NameDetail } from './name-detail';
import { NameDetailDialog } from './name-detail-dialog';
import { NameList } from './name-list';
import { ResultsPane } from './results-pane';

export function BrowseLayout() {
  useFilterUrlSync();
  useReconcileSelection();
  const state = useBrowseState();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reduce = useReducedMotion();

  const selectedNameTitle = useFilterStore((s) => s.selectedNameTitle);
  const setSelectedNameTitle = useFilterStore((s) => s.setSelectedNameTitle);

  useEffect(() => {
    if (!isDesktop || !selectedNameTitle) return;
    const previousTitle = selectedNameTitle;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setSelectedNameTitle(null);
      queueMicrotask(() => focusNameItem(previousTitle));
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isDesktop, selectedNameTitle, setSelectedNameTitle]);

  const fadeTransition = reduce ? { duration: 0 } : { duration: 0.2 };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-cream-light">
      <Head title="Browse" />

      <nav
        aria-label="Filter pet names"
        className="flex items-center gap-3 overflow-x-auto whitespace-nowrap px-4 py-3 md:block md:gap-0 md:overflow-visible md:whitespace-normal md:p-0"
      >
        <GenderBand />
        <FilterBar />
      </nav>

      <main
        data-browse-state={state}
        className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-6 py-10 md:px-[48px] xl:px-[165px] xl:py-[40px]"
      >
        <h1 className="font-heading text-[22px] leading-[28px] text-neutral-dark">
          All pets names
        </h1>

        <div className="mt-6">
          <LetterStrip />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {renderPane(state, isDesktop, fadeTransition)}
        </AnimatePresence>
      </main>
    </div>
  );
}

function renderPane(
  state: BrowseState,
  isDesktop: boolean,
  fadeTransition: { duration: number },
): ReactNode {
  const motionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: fadeTransition,
  };

  switch (state) {
    case 'cover':
      return (
        <motion.div
          key="cover"
          {...motionProps}
          className="flex min-h-0 flex-1 flex-col"
        >
          <CoverHero />
        </motion.div>
      );
    case 'results':
      return (
        <motion.div
          key="results"
          {...motionProps}
          className="mt-10 flex min-h-0 flex-1 flex-col md:mt-[40px]"
        >
          <ErrorBoundary FallbackComponent={FeatureErrorFallback}>
            <ResultsPane />
          </ErrorBoundary>
        </motion.div>
      );
    case 'empty-results':
      return (
        <motion.div
          key="empty-results"
          {...motionProps}
          className="mt-10 flex min-h-0 flex-1 flex-col md:mt-[40px]"
        >
          <ErrorBoundary FallbackComponent={FeatureErrorFallback}>
            <ResultsPane>
              <EmptyResults />
            </ResultsPane>
          </ErrorBoundary>
        </motion.div>
      );
    case 'detail':
      return (
        <motion.div
          key="detail"
          {...motionProps}
          className="mt-10 flex min-h-0 flex-1 flex-col gap-8 md:mt-[40px] md:grid md:grid-cols-[352px_1fr] md:grid-rows-[minmax(0,1fr)] xl:gap-[100px]"
        >
          <ErrorBoundary FallbackComponent={FeatureErrorFallback}>
            <NameList />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={FeatureErrorFallback}>
            {isDesktop ? <NameDetail /> : <NameDetailDialog />}
          </ErrorBoundary>
        </motion.div>
      );
    default:
      return assertNever(state);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled browse state: ${String(value)}`);
}
