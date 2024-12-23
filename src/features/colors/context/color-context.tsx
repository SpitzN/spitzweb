// src/context/color-context.tsx
"use client";
import * as React from "react";
import { useCopyColor } from "@/features/colors/hooks/useCopyColor";
import type { ColorDefinition } from "@/lib/config/colors";

type CopyableColor = Pick<ColorDefinition, "variable" | "hsl" | "hex">;

interface ColorContextType {
  copiedColor: string | null;
  copyColor: (color: CopyableColor) => Promise<void>;
}

export const ColorContext = React.createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const { copiedColor, copyColor } = useCopyColor();

  return (
    <ColorContext.Provider value={{ copiedColor, copyColor }}>{children}</ColorContext.Provider>
  );
}

export function useColorContext() {
  const context = React.useContext(ColorContext);
  if (context === undefined) {
    throw new Error("useColorContext must be used within a ColorProvider");
  }
  return context;
}
