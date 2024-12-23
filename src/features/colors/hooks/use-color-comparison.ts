// src/features/colors/hooks/use-color-comparison.ts
"use client";

import { useState, useCallback } from "react";
import type { ColorDefinition } from "@/types/color-system";

export function useColorComparison() {
  const [comparedColors, setComparedColors] = useState<
    [ColorDefinition | null, ColorDefinition | null]
  >([null, null]);

  const compareColors = useCallback((color1: ColorDefinition, color2: ColorDefinition) => {
    setComparedColors([color1, color2]);
  }, []);

  return {
    comparedColors,
    compareColors,
  };
}
