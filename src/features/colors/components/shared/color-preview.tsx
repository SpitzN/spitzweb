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
  const { name, description, backgroundColor } = color;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className}>
            <ColorSwatch
              color={color}
              size={size}
              variant={variant}
              showCopyButton
              className={cn(backgroundColor)}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{name}</p>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
