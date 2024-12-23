// src/utils/color-utils.ts
import type { ColorDefinition } from "@/types/color-system";
import type { ColorGroups } from "@/types/color-system";

// Convert HEX to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return { r, g, b };
}

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16).padStart(2, "0");
    return hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert HSL to RGB
// HSL values are [0..360, 0..100%, 0..100%]
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

// Convert HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// Convert HEX to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);

  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  } else {
    h = 0;
    s = 0;
  }

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

// Calculate relative luminance
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map((v) => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Get contrast ratio according to WCAG formula
export function getContrastRatio(hex1: string, hex2: string): number {
  const L1 = getLuminance(hex1);
  const L2 = getLuminance(hex2);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

// Check if contrast meets accessibility guidelines
export function isAccessibleContrast(
  hexBackground: string,
  hexForeground: string,
  level: "AA" | "AAA" = "AA"
): boolean {
  const ratio = getContrastRatio(hexBackground, hexForeground);
  const threshold = level === "AAA" ? 7 : 4.5;
  return ratio >= threshold;
}

// Utility to filter colors by hue range
export function filterColorsByHue(
  colors: ColorDefinition[],
  minHue: number,
  maxHue: number
): ColorDefinition[] {
  return colors.filter((color) => {
    const { h } = hexToHsl(color.hex);
    return h >= minHue && h <= maxHue;
  });
}

// Utility to sort colors by lightness
export function sortColorsByLightness(colors: ColorDefinition[]): ColorDefinition[] {
  return [...colors].sort((a, b) => {
    const hslA = hexToHsl(a.hex);
    const hslB = hexToHsl(b.hex);
    return hslA.l - hslB.l;
  });
}

// Helper function to find the base color name based on HSL or HEX
export function findBaseColor(hslOrHex: string, colorSet: ColorDefinition[]): string | null {
  const foundColor = colorSet.find(
    (color) => color.hsl === hslOrHex || color.hex.toLowerCase() === hslOrHex.toLowerCase()
  );

  return foundColor ? foundColor.name : null;
}

export const colorGroups: ColorGroups = {
  warm: { minHue: 263, maxHue: 360 }, // Pinks, Magentas, Violets
  transition: { minHue: 220, maxHue: 262 }, // Purples, Blue-Purples
  cool: { minHue: 160, maxHue: 219 }, // Blues, Aquas
} as const;

export const getGroupColors = (
  colors: ColorDefinition[],
  group: keyof typeof colorGroups
): ColorDefinition[] => {
  if (group === "warm") {
    // Include colors with hue 0-30 as well
    const lowHueColors = filterColorsByHue(colors, 0, 30);
    const warmColors = filterColorsByHue(colors, colorGroups.warm.minHue, colorGroups.warm.maxHue);
    return [...warmColors, ...lowHueColors];
  }

  const hueRange = colorGroups[group];
  return filterColorsByHue(colors, hueRange.minHue, hueRange.maxHue);
};

export const calculateGroupColors = (colors: ColorDefinition[]) => {
  return {
    warmGroupColors: getGroupColors(colors, "warm"),
    transitionGroupColors: getGroupColors(colors, "transition"),
    coolGroupColors: getGroupColors(colors, "cool"),
  };
};
