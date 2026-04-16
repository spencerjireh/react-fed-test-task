import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
} from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

import { ChevronButton } from '../chevron-button';

type MotionProps = {
  whileHover?: unknown;
  whileTap?: unknown;
} & Record<string, unknown>;

const MOTION_ONLY_KEYS = [
  'initial',
  'animate',
  'exit',
  'transition',
  'variants',
  'layoutId',
] as const;

function dropMotionProps(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const copy = { ...props };
  for (const key of MOTION_ONLY_KEYS) delete copy[key];
  return copy;
}

// Replace framer-motion's `motion` proxy with plain tags that surface
// `whileHover` / `whileTap` on the DOM as `data-*` attributes so tests
// can assert what the component hands to the motion element.
vi.mock('framer-motion', async () => {
  const actual =
    await vi.importActual<typeof import('framer-motion')>('framer-motion');
  const stub = (tag: string) => {
    const MotionStub = forwardRef<HTMLElement, MotionProps>((props, ref) => {
      const { whileHover, whileTap, ...rest } = props;
      return createElement(tag, {
        ref,
        ...(dropMotionProps(rest) as ComponentPropsWithoutRef<'div'>),
        'data-while-hover':
          whileHover !== undefined ? JSON.stringify(whileHover) : undefined,
        'data-while-tap':
          whileTap !== undefined ? JSON.stringify(whileTap) : undefined,
      });
    });
    MotionStub.displayName = `motion.${tag}`;
    return MotionStub;
  };
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_target, tag: string) => stub(tag),
      },
    ),
  };
});

// Framer Motion caches its own reduced-motion read module-level, so flipping
// matchMedia between tests doesn't propagate. Mocking our re-exporting hook
// gives per-test control and keeps the test focused on the component's
// reaction to the hook, not Framer Motion's matchMedia plumbing.
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

const mockedUseReducedMotion = vi.mocked(useReducedMotion);

describe('ChevronButton', () => {
  beforeEach(() => {
    mockedUseReducedMotion.mockReturnValue(false);
  });

  it('renders a button with the given aria-label', () => {
    render(
      <ChevronButton
        direction="up"
        disabled={false}
        onClick={() => {}}
        aria-label="Previous 11 names"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Previous 11 names' }),
    ).toBeInTheDocument();
  });

  it('click fires onClick when enabled', async () => {
    const onClick = vi.fn();
    render(
      <ChevronButton
        direction="down"
        disabled={false}
        onClick={onClick}
        aria-label="Next 11 names"
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Next 11 names' }),
    );
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('honors the disabled prop', () => {
    render(
      <ChevronButton
        direction="up"
        disabled
        onClick={() => {}}
        aria-label="Previous 11 names"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Previous 11 names' }),
    ).toBeDisabled();
  });

  it('applies a 1.05 hover scale when reduced motion is not requested', () => {
    mockedUseReducedMotion.mockReturnValue(false);
    render(
      <ChevronButton
        direction="up"
        disabled={false}
        onClick={() => {}}
        aria-label="Previous 11 names"
      />,
    );
    const btn = screen.getByRole('button', { name: 'Previous 11 names' });
    expect(btn).toHaveAttribute(
      'data-while-hover',
      JSON.stringify({ scale: 1.05 }),
    );
    expect(btn).toHaveAttribute('data-while-tap', JSON.stringify({ scale: 1 }));
  });

  it('flattens hover scale to 1 when reduced motion is requested', () => {
    mockedUseReducedMotion.mockReturnValue(true);
    render(
      <ChevronButton
        direction="up"
        disabled={false}
        onClick={() => {}}
        aria-label="Previous 11 names"
      />,
    );
    const btn = screen.getByRole('button', { name: 'Previous 11 names' });
    expect(btn).toHaveAttribute(
      'data-while-hover',
      JSON.stringify({ scale: 1 }),
    );
  });

  it('flattens hover scale to 1 when disabled, regardless of motion preference', () => {
    mockedUseReducedMotion.mockReturnValue(false);
    render(
      <ChevronButton
        direction="down"
        disabled
        onClick={() => {}}
        aria-label="Next 11 names"
      />,
    );
    const btn = screen.getByRole('button', { name: 'Next 11 names' });
    expect(btn).toHaveAttribute(
      'data-while-hover',
      JSON.stringify({ scale: 1 }),
    );
  });
});
