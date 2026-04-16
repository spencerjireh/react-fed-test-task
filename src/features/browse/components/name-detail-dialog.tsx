import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

import { useFilterStore } from '../stores/filter-store';

import { NameDetail } from './name-detail';

function restoreFocusToListItem(id: string) {
  queueMicrotask(() => {
    const selector = `[data-name-id="${CSS.escape(id)}"]`;
    const target = document.querySelector(selector);
    (target as HTMLElement | null)?.focus();
  });
}

export function NameDetailDialog() {
  const selectedNameId = useFilterStore((s) => s.selectedNameId);
  const setSelectedNameId = useFilterStore((s) => s.setSelectedNameId);
  const reduce = useReducedMotion();

  const open = selectedNameId !== null;

  const handleOpenChange = (next: boolean) => {
    if (next) return;
    const previousId = selectedNameId;
    setSelectedNameId(null);
    if (previousId) restoreFocusToListItem(previousId);
  };

  const sheetTransition = reduce
    ? { duration: 0 }
    : { duration: 0.22, ease: 'easeOut' as const };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.18 }}
                className="fixed inset-0 z-40 bg-neutral-dark/40"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild aria-describedby={undefined}>
              <motion.div
                initial={reduce ? { y: 0 } : { y: '100%' }}
                animate={{ y: 0 }}
                exit={reduce ? { y: 0 } : { y: '100%' }}
                transition={sheetTransition}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[16px] bg-cream-light p-6 shadow-pill"
              >
                <Dialog.Title className="sr-only">
                  Selected name details
                </Dialog.Title>
                <NameDetail />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
