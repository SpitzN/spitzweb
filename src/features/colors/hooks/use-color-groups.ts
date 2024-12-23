// src/features/colors/hooks/use-color-groups.ts
import { useMemo } from "react";
import type { ColorDefinition } from "@/types/color-system";
import { calculateGroupColors } from "@/lib/utils/color-utils";

export const useColorGroups = (colors: ColorDefinition[]) => {
  const groupedColors = useMemo(() => calculateGroupColors(colors), [colors]);

  return {
    ...groupedColors,
    totalColors: colors.length,
    warmCount: groupedColors.warmGroupColors.length,
    transitionCount: groupedColors.transitionGroupColors.length,
    coolCount: groupedColors.coolGroupColors.length,
  };
};
