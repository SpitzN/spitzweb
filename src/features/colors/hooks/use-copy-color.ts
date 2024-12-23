// src/features/colors/hooks/use-copy-color.ts
"use client";
import { useState } from "react";
import type { CopyableColor } from "@/types/color-system";

export function useCopyColor() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyColor = async (color: CopyableColor) => {
    try {
      // Prioritize copying CSS variable, fallback to HSL, then hex
      const copyText = `var(${color.variable}) | ${color.hsl} | ${color.hex}`;
      await navigator.clipboard.writeText(copyText);
      setCopiedColor(color.variable);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error("Failed to copy color:", err);
    }
  };

  return {
    copiedColor,
    copyColor,
  };
}
