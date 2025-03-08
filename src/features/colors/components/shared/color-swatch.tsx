"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";
import { useColorContext } from "@/features/colors/context/color-context";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import type { ColorDefinition } from "@/types/color-system";

const swatchVariants = cva("relative group overflow-hidden transition-colors", {
  variants: {
    variant: {
      "rounded-top": "rounded-t-lg",
      rounded: "rounded-lg",
      circle: "rounded-full aspect-square",
    },
    // Optionally define size variants if needed
    size: {
      xxs: "h-8",
      xs: "h-12",
      sm: "h-16",
      md: "h-24",
      lg: "h-32",
    },
  },
  defaultVariants: {
    variant: "rounded-top",
    size: "md",
  },
});

interface ColorSwatchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof swatchVariants> {
  color: ColorDefinition;
  showCopyButton?: boolean;
}

export function ColorSwatch({
  color,
  showCopyButton = true,
  variant,
  size,
  className,
  ...props
}: ColorSwatchProps) {
  const { copiedColor, copyColor } = useColorContext();

  const buttonClasses = cn(
    "opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80 hover:text-aurora-primary bg-background/50",
    {
      "absolute top-2 right-2": variant !== "circle",
      "absolute rounded-full w-full h-full": variant === "circle",
    }
  );

  const { variable, hsl, hex } = color;

  return (
    <div className={cn(swatchVariants({ variant, size, className }))} {...props}>
      {showCopyButton && (
        <Button
          variant="ghost"
          size="icon"
          className={buttonClasses}
          onClick={() => copyColor({ variable, hsl, hex })}
        >
          {copiedColor === variable ? <Check /> : <Copy />}
        </Button>
      )}
    </div>
  );
}
