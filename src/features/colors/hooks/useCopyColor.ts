// src/hooks/useCopyColor.ts
"use client";
import { useState } from "react";
import type { ColorDefinition } from "@/lib/config/colors";

type CopyableColor = Pick<ColorDefinition, "variable" | "hsl" | "hex">;

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
