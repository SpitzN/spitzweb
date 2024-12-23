// src/features/colors/components/color-grid.tsx
"use client";

import { ColorDefinition } from "@/lib/config/colors";
import { cn } from "@/lib/utils/utils";
import { ColorCard } from "./color-card";
import { motion } from "motion/react";

interface ColorGridProps {
  colors: ColorDefinition[];
  showInfo?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Container variants for the entire grid
const gridVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      // When the grid animates in, children will animate in sequence
      staggerChildren: 0.05,
    },
  },
};

export function ColorGrid({ colors, showInfo, size, className }: ColorGridProps) {
  return (
    <motion.div
      className={cn(
        "grid gap-4",
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
        className
      )}
      variants={gridVariants}
      initial="initial"
      animate="animate"
      layout
    >
      {colors.map((color) => (
        <ColorCard key={color.variable} color={color} showInfo={showInfo} size={size} />
      ))}
    </motion.div>
  );
}
