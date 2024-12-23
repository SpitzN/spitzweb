// src/features/colors/components/shared/color-preview.tsx
"use client";

import type { ColorDefinition } from "@/types/color-system";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ColorSwatch } from "./color-swatch";
import { cn } from "@/lib/utils/utils";

interface ColorPreviewProps {
  color: ColorDefinition;
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
  variant?: "rounded" | "circle";
  className?: string;
}

export function ColorPreview({
  color,
  size = "sm",
  variant = "rounded",
  className,
}: ColorPreviewProps) {
  const { name, description, variable, hex, hsl, backgroundColor } = color;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className}>
            <ColorSwatch
              color={{ variable, hex, hsl }}
              size={size} // Use the size variant from ColorSwatch
              variant={variant} // or "circle" if you want a circular preview
              showCopyButton
              className={cn(backgroundColor)}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{name}</p>
            {color.description && <p className="text-muted-foreground">{description}</p>}
            {/* <p className="text-muted-foreground">HSL: {color.hsl}</p>
            <p className="text-muted-foreground">HEX: {color.hex}</p>
            <p className="text-muted-foreground font-mono">{color.variable}</p> */}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
