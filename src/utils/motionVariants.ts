/**
 * Unified Motion Design System for Lumen & Form.
 * Provides coherent cinematic animation tokens, headline reveal masks,
 * staggered section transitions, and strict prefers-reduced-motion compliance.
 */
import type { Variants, Transition } from 'motion/react';

// Core Motion Design Tokens
export const MOTION_EASINGS = {
  // Editorial cinematic deceleration (smooth settling without bounce)
  cinematic: [0.16, 1, 0.3, 1] as const,
  // Natural entry curve
  smoothOut: [0.22, 1, 0.36, 1] as const,
  // Crisp interactive feedback
  snappy: [0.25, 1, 0.5, 1] as const,
  // Clean accelerating exit curve
  exit: [0.4, 0, 1, 1] as const,
  // Dramatic anticipation
  anticipate: [0.05, 0.7, 0.1, 1.0] as const,
};

export const MOTION_DURATIONS = {
  instant: 0.01,
  micro: 0.18,
  fast: 0.28,
  base: 0.45,
  deliberate: 0.65,
  cinematic: 0.85,
} as const;

export const MOTION_STAGGERS = {
  tight: 0.04,
  cards: 0.06,
  lines: 0.08,
  sections: 0.12,
} as const;

/**
 * Generates variants tailored to the user's reduced-motion preference.
 * When reduced is true, vertical/scale transforms are eliminated and durations
 * collapse to instantaneous or gentle opacity transitions to avoid vestibular discomfort.
 */
export const getMotionVariants = (reduced: boolean = false) => {
  const cinematicEase = MOTION_EASINGS.cinematic as unknown as [number, number, number, number];
  const exitEase = MOTION_EASINGS.exit as unknown as [number, number, number, number];

  const pageContainer: Variants = {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.base,
        ease: cinematicEase,
        staggerChildren: reduced ? 0 : MOTION_STAGGERS.lines,
        delayChildren: reduced ? 0 : 0.04,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      y: reduced ? 0 : -10,
      transition: {
        duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.fast,
        ease: exitEase,
      },
    },
  };

  const gridContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : MOTION_STAGGERS.cards,
        delayChildren: reduced ? 0 : 0.02,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.deliberate,
        ease: cinematicEase,
      },
    },
  };

  const scaleUp: Variants = {
    hidden: {
      opacity: 0,
      scale: reduced ? 1 : 0.97,
      y: reduced ? 0 : 12,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.deliberate,
        ease: cinematicEase,
      },
    },
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.base,
        ease: 'easeOut',
      },
    },
  };

  // Masked headline reveal variants: text glides up from behind an overflow-hidden boundary
  const headlineMaskContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : 0.09,
        delayChildren: reduced ? 0 : 0.05,
      },
    },
  };

  const headlineMaskLine: Variants = {
    hidden: {
      opacity: reduced ? 0 : 0.1,
      y: reduced ? 0 : '105%',
    },
    visible: {
      opacity: 1,
      y: '0%',
      transition: {
        duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.cinematic,
        ease: cinematicEase,
      },
    },
  };

  // Interactive card hover settings (for whileHover)
  const cardHover = reduced
    ? {}
    : {
        y: -4,
        transition: {
          duration: MOTION_DURATIONS.fast,
          ease: MOTION_EASINGS.snappy as unknown as [number, number, number, number],
        },
      };

  return {
    pageContainer,
    gridContainer,
    fadeUp,
    scaleUp,
    fadeIn,
    headlineMaskContainer,
    headlineMaskLine,
    cardHover,
    tokens: {
      easings: MOTION_EASINGS,
      durations: MOTION_DURATIONS,
      staggers: MOTION_STAGGERS,
    },
  };
};

// Default Static Variants (retaining backwards compatibility)
const defaultSystem = getMotionVariants(false);
export const pageStaggerContainer = defaultSystem.pageContainer;
export const gridStaggerContainer = defaultSystem.gridContainer;
export const fadeUpItem = defaultSystem.fadeUp;
export const scaleUpItem = defaultSystem.scaleUp;
export const fadeInItem = defaultSystem.fadeIn;
export const headlineMaskContainer = defaultSystem.headlineMaskContainer;
export const headlineMaskLine = defaultSystem.headlineMaskLine;
