"use client";

import type { ColorDefinition } from "@/types/color-system";
import { ColorSwatch } from "@/features/colors/components/shared/color-swatch";
import { cn } from "@/lib/utils/utils";
import { useThemedColor } from "../../hooks/use-themed-color";

interface ColorCardProps {
  color: ColorDefinition;
  showInfo?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "rounded" | "circle" | "rounded-top";
  className?: string;
}

export function ColorCard({
  color,
  showInfo = true,
  size = "md",
  variant = "rounded-top",
  className,
}: ColorCardProps) {
  const displayedColor = useThemedColor(color);
  const { backgroundColor, name, basedOn, variable, description } = displayedColor;

  return (
    <div className={cn("group overflow-hidden rounded-lg border", className)}>
      <ColorSwatch
        color={displayedColor}
        size={size}
        variant={variant}
        className={backgroundColor}
        showCopyButton
      />
      {showInfo && (
        <div className="space-y-1.5 p-3">
          <p className="text-sm font-medium">{name}</p>
          {basedOn && (
            <p className="text-xs text-muted-foreground">
              Based on: <span className="font-mono">{basedOn}</span>
            </p>
          )}
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>HSL: {displayedColor.hsl}</p>
            <p>HEX: {displayedColor.hex}</p>
            <p className="font-mono">{variable}</p>
          </div>
          {description && <p className="pt-1.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  );
}
