import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

import { usePointerFine } from '@/hooks/use-pointer-fine';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

import { useFilterStore } from '../stores/filter-store';

const COVER_HERO_JPG = 'cover-hero.jpg';
const COVER_HERO_WEBP = 'cover-hero.webp';

// Pure container-width percentage — text scales in lockstep with the hero box,
// same way the dog is a % of container height. No px floor/ceiling so the
// composition stays proportional at every viewport.
const HEADLINE_FONT_SIZE = '26cqw';
const SPRING_CONFIG = { stiffness: 100, damping: 20 };

// Dog drifts more than text so the layers visibly separate.
const DOG_AMPLITUDE = 12;
const TEXT_AMPLITUDE = 4;

export function CoverHero() {
  const base = import.meta.env.BASE_URL;
  const goToResults = useFilterStore((s) => s.goToResults);

  const reduce = useReducedMotion();
  const pointerFine = usePointerFine();
  const parallaxEnabled = !reduce && pointerFine;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING_CONFIG);
  const springY = useSpring(rawY, SPRING_CONFIG);

  const dogX = useTransform(springX, [-1, 1], [-DOG_AMPLITUDE, DOG_AMPLITUDE]);
  const dogY = useTransform(springY, [-1, 1], [-DOG_AMPLITUDE, DOG_AMPLITUDE]);
  const textX = useTransform(
    springX,
    [-1, 1],
    [TEXT_AMPLITUDE, -TEXT_AMPLITUDE],
  );
  const textY = useTransform(
    springY,
    [-1, 1],
    [TEXT_AMPLITUDE, -TEXT_AMPLITUDE],
  );

  useEffect(() => {
    if (!parallaxEnabled) return;
    // Listen on window, not the button — the cursor spends most of its time
    // over the filter chrome above the hero.
    const onMove = (event: MouseEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [parallaxEnabled, rawX, rawY]);

  return (
    <button
      type="button"
      aria-label="Start browsing names"
      onClick={goToResults}
      className="relative mx-auto mt-2 block aspect-[4/3] w-full max-w-[min(1110px,calc((100svh-400px)*4/3))] cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-main md:mt-[8px]"
      style={{ containerType: 'inline-size' }}
    >
      {/* Outer wrapper owns the static offset; inner motion.div owns x/y.
          Framer rewrites `transform` wholesale, so combining them on one
          element would clobber the offset. */}
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-start pt-[4%]">
        <motion.div
          className="flex flex-col items-center font-heading font-bold leading-[0.82] text-red-main"
          style={{
            fontSize: HEADLINE_FONT_SIZE,
            x: parallaxEnabled ? textX : 0,
            y: parallaxEnabled ? textY : 0,
            textShadow:
              '0px 2px 12px rgba(58,53,51,0.1), 0px 0px 2px rgba(58,53,51,0.2)',
          }}
        >
          <span className="whitespace-nowrap">I NEED</span>
          <span className="whitespace-nowrap">A NAME</span>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center"
        style={{ transform: 'translateY(4%)' }}
      >
        <picture className="block h-[85%]">
          <source srcSet={`${base}${COVER_HERO_WEBP}`} type="image/webp" />
          <motion.img
            src={`${base}${COVER_HERO_JPG}`}
            width={417}
            height={671}
            alt=""
            loading="eager"
            fetchPriority="high"
            data-testid="cover-hero-img"
            className="h-full w-auto object-contain"
            style={{
              x: parallaxEnabled ? dogX : 0,
              y: parallaxEnabled ? dogY : 0,
            }}
          />
        </picture>
      </div>
    </button>
  );
}
