"use client";

import { cn } from "@/lib/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { HTMLMotionProps, motion } from "motion/react";

const cardContainer = cva("relative flex flex-col items-center justify-center", {
  variants: {
    rounded: {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      full: "rounded-full",
    },
    size: {
      sm: "w-32 h-20",
      md: "w-40 h-24",
      lg: "w-48 h-32",
      xl: "w-64 h-40",
      custom: "",
    },
    effect: {
      none: "",
      conicSpin: "overflow-hidden",
      glow: "",
    },
  },
  defaultVariants: {
    rounded: "lg",
    size: "lg",
    effect: "glow",
  },
});

const cardBorder = cva("absolute transition-all duration-300 rounded-[inherit]", {
  variants: {
    gradient: {
      adaptive: "",
      light: "[background:var(--aurora-conic-light)]",
      dark: "[background:var(--aurora-conic-dark)]",
      muted: "[background:var(--aurora-conic-muted)]",
      bright: "[background:var(--aurora-conic-bright)]",
      transparent: "[background:var(--aurora-conic-transparent)]",
      full: "[background:var(--aurora-conic-full)]",
      custom: "",
    },
    thickness: {
      sm: "-inset-[0.05rem]",
      md: "-inset-[0.1rem]",
      lg: "-inset-[0.15rem]",
    },
    effect: {
      none: "",
      conicSpin: "animate-fullSpin duration-4000 linear h-[150%] w-[150%] top-[-25%] left-[-25%]",
      glow: " blur animate-pulse duration-9000 ease-in-out backdrop-filter backdrop-blur-[0.5rem]",
    },
  },
  defaultVariants: {
    gradient: "light",
    thickness: "sm",
    effect: "glow",
  },
});

const cardContent = cva(
  "flex flex-col items-center justify-center relative z-10 rounded-[inherit]",
  {
    variants: {
      effect: {
        none: "",
        conicSpin: "h-[calc(100%-0.2rem)] w-[calc(100%-0.2rem)]",
        glow: "h-full w-full",
      },

      background: {
        layer1: "bg-aurora-layer-100",
        layer2: "bg-aurora-layer-200",
        layer3: "bg-aurora-layer-300",
      },
    },
    defaultVariants: {
      effect: "glow",
      background: "layer1",
    },
  }
);

interface CustomCardProps
  extends Omit<HTMLMotionProps<"div">, keyof VariantProps<typeof cardContainer>>,
    VariantProps<typeof cardContainer>,
    VariantProps<typeof cardBorder>,
    VariantProps<typeof cardContent> {}

export function CustomCard({
  children,
  className,
  rounded,
  size,
  effect,
  gradient,
  thickness,
  background,
  ...props
}: CustomCardProps) {
  const { theme, systemTheme } = useTheme();
  const activeTheme = useMemo(
    () => (theme === "system" ? systemTheme : theme),
    [theme, systemTheme]
  );
  const isDarkMode = activeTheme === "dark";
  const effectiveGradient = gradient === "adaptive" ? (isDarkMode ? "bright" : "light") : gradient;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
      className={cn(cardContainer({ rounded, effect, size }), className)}
      {...props}
    >
      <motion.div
        whileHover={{ filter: "blur(0.75rem)" }}
        className={cn(cardBorder({ effect, gradient: effectiveGradient, thickness }))}
      />
      <motion.div whileHover={{ scale: 1.01 }} className={cn(cardContent({ effect, background }))}>
        {children}
      </motion.div>
    </motion.div>
  );
}
