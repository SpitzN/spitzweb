// src/features/colors/context/color-context.tsx
"use client";
import * as React from "react";
import { useCopyColor } from "@/features/colors/hooks/use-copy-color";
import type { ColorDefinition, CopyableColor } from "@/types/color-system";
import { useColorComparison } from "@/features/colors/hooks/use-color-comparison";

interface ColorContextType {
  copiedColor: string | null;
  copyColor: (color: CopyableColor) => Promise<void>;
  comparedColors: [ColorDefinition | null, ColorDefinition | null];
  compareColors: (color1: ColorDefinition, color2: ColorDefinition) => void;
}

export const ColorContext = React.createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const { copiedColor, copyColor } = useCopyColor();
  const { comparedColors, compareColors } = useColorComparison();

  return (
    <ColorContext.Provider value={{ copiedColor, copyColor, comparedColors, compareColors }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColorContext() {
  const context = React.useContext(ColorContext);
  if (context === undefined) {
    throw new Error("useColorContext must be used within a ColorProvider");
  }
  return context;
}
