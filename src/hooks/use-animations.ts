import { Variants } from "motion/react";

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const useAnimationPresets = () => {
  const getTransition = (delay = 0) => ({
    delay,
    duration: 0.2,
  });

  return {
    fadeInUp,
    scaleUp,
    getTransition,
  };
};
