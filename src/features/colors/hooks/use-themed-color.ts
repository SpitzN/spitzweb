import { useMemo } from "react";
import { useTheme } from "next-themes";
import type { ColorDefinition } from "@/types/color-system";

export function useThemedColor(color: ColorDefinition) {
  const { theme, systemTheme } = useTheme();

  // Determine the active theme (in case the theme is set to "system")
  const activeTheme = useMemo(
    () => (theme === "system" ? systemTheme : theme),
    [theme, systemTheme]
  );

  // Decide if we are in dark mode
  const isDarkMode = activeTheme === "dark";

  // Return the correct color object based on dark/light mode
  const displayedColor = useMemo(() => {
    if (isDarkMode && color.darkMode) {
      return {
        ...color,
        hsl: color.darkMode.hsl,
        hex: color.darkMode.hex,
        basedOn: color.darkMode.basedOn,
      };
    }

    return {
      ...color,
    };
  }, [isDarkMode, color]);

  return displayedColor;
}
