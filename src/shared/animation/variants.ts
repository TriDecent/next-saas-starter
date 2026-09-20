import type { Variant } from 'framer-motion';

export type SlideVariantKey = 'hidden' | 'visible' | 'safelyHidden';
export type ScaleVariantKey = 'hidden' | 'visible' | 'exit';
export type FadeVariantKey = 'hidden' | 'visible' | 'exit';
export type FlipVariantKey = 'hidden' | 'visible' | 'exit';
export type BounceVariantKey = 'hidden' | 'visible' | 'exit';
export type SwipeVariantKey = 'hidden' | 'visible' | 'exit';
export type ZoomRotateVariantKey = 'hidden' | 'visible' | 'exit';
export type ElasticVariantKey = 'hidden' | 'visible' | 'exit';

const slideVariant = (
  x: number,
  y: number
): Readonly<Record<SlideVariantKey, Variant>> => {
  return {
    hidden: { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0 },
    safelyHidden: {
      opacity: 0,
      x,
      y,
      transitionEnd: { display: 'none' },
    },
  };
};

const scaleVariant = (): Readonly<Record<ScaleVariantKey, Variant>> => {
  return {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: {
      scale: 0,
      opacity: 0,
      transitionEnd: { display: 'none' },
    },
  };
};

const fadeVariant = (): Readonly<Record<FadeVariantKey, Variant>> => {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: {
      opacity: 0,
      transitionEnd: { display: 'none' },
    },
  };
};

const flipVariant = (
  axis: 'x' | 'y' = 'y'
): Readonly<Record<FlipVariantKey, Variant>> => {
  if (axis === 'x') {
    return {
      hidden: { rotateX: -90, opacity: 0 },
      visible: { rotateX: 0, opacity: 1 },
      exit: {
        rotateX: 90,
        opacity: 0,
        transitionEnd: { display: 'none' },
      },
    };
  }

  return {
    hidden: { rotateY: -90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
    exit: {
      rotateY: 90,
      opacity: 0,
      transitionEnd: { display: 'none' },
    },
  };
};

const bounceVariant = (): Readonly<Record<BounceVariantKey, Variant>> => {
  return {
    hidden: { scale: 0, opacity: 0, y: -20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      y: 20,
      transitionEnd: { display: 'none' },
    },
  };
};

const swipeVariant = (
  direction: 'left' | 'right' | 'up' | 'down' = 'right'
): Readonly<Record<SwipeVariantKey, Variant>> => {
  const getOffset = () => {
    switch (direction) {
      case 'left':
        return { x: -100, y: 0 };
      case 'right':
        return { x: 100, y: 0 };
      case 'up':
        return { x: 0, y: -100 };
      case 'down':
        return { x: 0, y: 100 };
    }
  };

  const offset = getOffset();

  return {
    hidden: { ...offset, opacity: 0 },
    visible: { x: 0, y: 0, opacity: 1 },
    exit: {
      ...offset,
      opacity: 0,
      transitionEnd: { display: 'none' },
    },
  };
};

const zoomRotateVariant = (): Readonly<Record<ScaleVariantKey, Variant>> => {
  return {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { scale: 1, rotate: 0, opacity: 1 },
    exit: {
      scale: 0,
      rotate: 180,
      opacity: 0,
      transitionEnd: { display: 'none' },
    },
  };
};

const elasticVariant = (): Readonly<Record<ScaleVariantKey, Variant>> => {
  return {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 8,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transitionEnd: { display: 'none' },
    },
  };
};

const slideVariantKeys: Readonly<Record<SlideVariantKey, SlideVariantKey>> = {
  hidden: 'hidden',
  visible: 'visible',
  safelyHidden: 'safelyHidden',
};

const scaleVariantKeys: Readonly<Record<ScaleVariantKey, ScaleVariantKey>> = {
  hidden: 'hidden',
  visible: 'visible',
  exit: 'exit',
};

const fadeVariantKeys: Readonly<Record<FadeVariantKey, FadeVariantKey>> = {
  hidden: 'hidden',
  visible: 'visible',
  exit: 'exit',
};

const flipVariantKeys: Readonly<Record<FlipVariantKey, FlipVariantKey>> = {
  hidden: 'hidden',
  visible: 'visible',
  exit: 'exit',
};

const bounceVariantKeys: Readonly<Record<BounceVariantKey, BounceVariantKey>> =
  {
    hidden: 'hidden',
    visible: 'visible',
    exit: 'exit',
  };

const swipeVariantKeys: Readonly<Record<SwipeVariantKey, SwipeVariantKey>> = {
  hidden: 'hidden',
  visible: 'visible',
  exit: 'exit',
};

const zoomRotateVariantKeys: Readonly<
  Record<ScaleVariantKey, ScaleVariantKey>
> = {
  hidden: 'hidden',
  visible: 'visible',
  exit: 'exit',
};

const elasticVariantKeys: Readonly<Record<ScaleVariantKey, ScaleVariantKey>> = {
  hidden: 'hidden',
  visible: 'visible',
  exit: 'exit',
};

export const Variants = {
  slide: { key: slideVariantKeys, variant: slideVariant },
  scale: { key: scaleVariantKeys, variant: scaleVariant },
  fade: { key: fadeVariantKeys, variant: fadeVariant },
  flip: { key: flipVariantKeys, variant: flipVariant },
  bounce: { key: bounceVariantKeys, variant: bounceVariant },
  swipe: { key: swipeVariantKeys, variant: swipeVariant },
  zoomRotate: { key: zoomRotateVariantKeys, variant: zoomRotateVariant },
  elastic: { key: elasticVariantKeys, variant: elasticVariant },
} as const;
