// src/components/animations/animated-card.tsx
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardContainer = cva("relative overflow-hidden shadow-md transition-all duration-300", {
  variants: {
    gradient: {
      light:
        "before:[background:var(--aurora-conic-light)] after:[background:var(--aurora-conic-light)]",
      dark: "before:[background:var(--aurora-conic-dark)] after:[background:var(--aurora-conic-dark)]",
      muted:
        "before:[background:var(--aurora-conic-muted)] after:[background:var(--aurora-conic-muted)]",
      bright:
        "before:[background:var(--aurora-conic-bright)] after:[background:var(--aurora-conic-bright)]",
      transparent:
        "before:[background:var(--aurora-conic-transparent)] after:[background:var(--aurora-conic-transparent)]",
      full: "before:[background:var(--aurora-conic-full)] after:[background:var(--aurora-conic-full)]",
      custom: "",
    },
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
    hover: {
      none: "",
      scale: "hover:scale-105",
      raise: "hover:-translate-y-1",
      glow: "hover:shadow-lg hover:shadow-primary/25",
      all: "hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/25",
    },
    focus: {
      none: "",
      outline: "focus:outline-none focus:ring-2 focus:ring-aurora-ring",
      scale: "focus:scale-105",
      both: "focus:outline-none focus:ring-2 focus:ring-aurora-ring focus:scale-105",
    },
    borderEffect: {
      none: "",
      conicSpin:
        "before:content-[''] before:absolute before:-inset-1/2 before:animate-fullSpin before:rounded-[inherit]",
      static: "before:content-[''] before:absolute before:-inset-1/2",
    },
  },
  defaultVariants: {
    gradient: "transparent",
    rounded: "xl",
    size: "md",
    hover: "none",
    focus: "outline",
    borderEffect: "conicSpin",
  },
});

const cardContent = cva(
  "absolute flex flex-col items-center justify-center bg-aurora-layer-100 rounded-[inherit] inset-[0.05rem]"
);

interface AnimatedGradientBorderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContainer> {
  width?: string;
  height?: string;
  thickness?: "sm" | "md" | "lg";
  borderEffect?: "conicSpin" | "none";
}

export function AnimatedGradientBorder({
  children,
  className,
  gradient,
  rounded,
  size,
  hover,
  focus,
  width,
  height,
  borderEffect,
  ...props
}: AnimatedGradientBorderProps) {
  const effectiveSize = width || height ? "custom" : size;

  return (
    <div
      className={cn(
        cardContainer({
          gradient,
          rounded,
          size: effectiveSize,
          hover,
          focus,
          borderEffect,
        }),
        width,
        height,
        className
      )}
      {...props}
    >
      <div className={cn(cardContent({}))}>{children}</div>
    </div>
  );
}
