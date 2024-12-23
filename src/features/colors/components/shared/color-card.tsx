// src/features/colors/components/shared/color-card.tsx
"use client";

import type { ColorDefinition } from "@/types/color-system";
import { ColorSwatch } from "@/features/colors/components/shared/color-swatch";
import { cn } from "@/lib/utils/utils";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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
  // Initial state should match server render (light mode)
  const [displayedColor, setDisplayedColor] = useState({
    hsl: color.hsl,
    hex: color.hex,
    basedOn: color.basedOn || null,
  });

  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const activeTheme = theme === "system" ? systemTheme : theme;
    const isDarkMode = activeTheme === "dark";

    if (isDarkMode && color.darkMode) {
      setDisplayedColor({
        hsl: color.darkMode.hsl,
        hex: color.darkMode.hex,
        basedOn: color.darkMode.basedOn || color.basedOn || null,
      });
    } else {
      setDisplayedColor({
        hsl: color.hsl,
        hex: color.hex,
        basedOn: color.basedOn || null,
      });
    }
  }, [theme, systemTheme, color]);

  return (
    <div className={cn("group overflow-hidden rounded-lg border", className)}>
      <ColorSwatch
        color={{
          variable: color.variable,
          hsl: displayedColor.hsl,
          hex: displayedColor.hex,
        }}
        size={size}
        variant={variant}
        className={color.backgroundColor}
        showCopyButton
      />
      {showInfo && (
        <div className="space-y-1.5 p-3">
          <p className="text-sm font-medium">{color.name}</p>
          {displayedColor.basedOn && (
            <p className="text-xs text-muted-foreground">
              Based on: <span className="font-mono">{displayedColor.basedOn}</span>
            </p>
          )}
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>HSL: {displayedColor.hsl}</p>
            <p>HEX: {displayedColor.hex}</p>
            <p className="font-mono">{color.variable}</p>
          </div>
          {color.description && (
            <p className="pt-1.5 text-xs text-muted-foreground">{color.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
