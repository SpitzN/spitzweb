"use client";

import { motion } from "motion/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAnimationPresets } from "@/hooks/use-animations";

export function FloatingThemeToggle() {
  const { fadeInUp, getTransition } = useAnimationPresets();

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={getTransition(1)}
    >
      <ThemeToggle />
    </motion.div>
  );
}
