import { useMediaQuery } from './use-media-query';

// True only for devices with a precise pointer (mouse, trackpad). Touch +
// coarse pointers read false — parallax effects that "park" on the last
// touch position feel broken, so callers should short-circuit on !true.
export const usePointerFine = () => useMediaQuery('(pointer: fine)');
