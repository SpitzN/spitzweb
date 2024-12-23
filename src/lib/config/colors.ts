// src/lib/config/colors.ts

export interface ColorDefinition {
  name: string;
  variable: string;
  hsl: string;
  hex: string;
  description?: string;
  backgroundColor: string;
  basedOn?: string;
  darkMode?: {
    hsl: string;
    hex: string;
    basedOn?: string;
  };
}

export const baseColors: ColorDefinition[] = [
  {
    name: "Electric Pink",
    variable: "--aurora-electric-pink",
    hsl: "333 90% 55%",
    hex: "#F03E6B",
    description:
      "A vibrant, energetic pink that initiates our warm spectrum with its electrifying presence",
    backgroundColor: "bg-aurora-electric-pink",
  },
  {
    name: "Fashion Fuchsia",
    variable: "--aurora-fashion-fuchsia",
    hsl: "315 87% 48%",
    hex: "#D91A75",
    description: "A bold, sophisticated fuchsia that bridges pink and magenta in our warm palette",
    backgroundColor: "bg-aurora-fashion-fuchsia",
  },
  {
    name: "Deep Magenta",
    variable: "--aurora-deep-magenta",
    hsl: "295 92% 42%",
    hex: "#B816A2",
    description: "A rich, intense magenta that adds depth to our warm spectrum",
    backgroundColor: "bg-aurora-deep-magenta",
  },
  {
    name: "French Violet",
    variable: "--aurora-french-violet",
    hsl: "278 100% 36%",
    hex: "#7400b8",
    description: "A regal violet that marks the transition from warm purples to cool tones",
    backgroundColor: "bg-aurora-french-violet",
  },
  {
    name: "Grape",
    variable: "--aurora-grape",
    hsl: "263 60% 48%",
    hex: "#6930c3",
    description: "A balanced purple that softens the transition between violet and blue",
    backgroundColor: "bg-aurora-grape",
  },
  {
    name: "Slate Blue",
    variable: "--aurora-slate-blue",
    hsl: "239 53% 59%",
    hex: "#5e60ce",
    description: "A refined blue with subtle purple undertones, bridging our middle spectrum",
    backgroundColor: "bg-aurora-slate-blue",
  },
  {
    name: "Byzantine Blue",
    variable: "--aurora-byzantine-blue",
    hsl: "232 58% 52%",
    hex: "#4B4EAB",
    description: "A historical blue hue that adds richness to our cool spectrum",
    backgroundColor: "bg-aurora-byzantine-blue",
  },
  {
    name: "Royal Blue",
    variable: "--aurora-royal-blue",
    hsl: "220 70% 55%",
    hex: "#2E68D9",
    description: "A majestic blue that anchors our cool palette with its strong presence",
    backgroundColor: "bg-aurora-royal-blue",
  },
  {
    name: "United Nations Blue",
    variable: "--aurora-united-nations-blue",
    hsl: "213 64% 59%",
    hex: "#5390d9",
    description: "A diplomatic blue that softens into our lighter spectrum",
    backgroundColor: "bg-aurora-united-nations-blue",
  },
  {
    name: "Picton Blue",
    variable: "--aurora-picton-blue",
    hsl: "203 69% 59%",
    hex: "#4ea8de",
    description: "A clear, bright blue reminiscent of summer skies",
    backgroundColor: "bg-aurora-picton-blue",
  },
  {
    name: "Aero",
    variable: "--aurora-aero",
    hsl: "194 73% 59%",
    hex: "#48bfe3",
    description: "A refreshing blue with hints of cyan, adding lightness to our palette",
    backgroundColor: "bg-aurora-aero",
  },
  {
    name: "Sky Blue",
    variable: "--aurora-sky-blue",
    hsl: "188 70% 61%",
    hex: "#56cfe1",
    description: "A bright, airy blue that captures the essence of clear horizons",
    backgroundColor: "bg-aurora-sky-blue",
  },
  {
    name: "Tiffany Blue",
    variable: "--aurora-tiffany-blue",
    hsl: "180 66% 63%",
    hex: "#64dfdf",
    description: "An elegant cyan blue that introduces mint undertones",
    backgroundColor: "bg-aurora-tiffany-blue",
  },
  {
    name: "Turquoise",
    variable: "--aurora-turquoise",
    hsl: "171 80% 69%",
    hex: "#72efdd",
    description: "A vibrant turquoise that merges blue and green qualities",
    backgroundColor: "bg-aurora-turquoise",
  },
  {
    name: "Aquamarine",
    variable: "--aurora-aquamarine",
    hsl: "163 100% 75%",
    hex: "#80ffdb",
    description: "A crystalline blue-green that completes our cool spectrum",
    backgroundColor: "bg-aurora-aquamarine",
  },
];

export const luminanceColors: ColorDefinition[] = [
  {
    name: "Seasalt",
    variable: "--aurora-seasalt",
    hsl: "210 17% 98%",
    hex: "#f8f9fa",
    description: "Our lightest shade, providing an airy, clean foundation",
    backgroundColor: "bg-aurora-luminance-seasalt",
  },
  {
    name: "Antiflash White",
    variable: "--aurora-antiflash-white",
    hsl: "210 16% 93%",
    hex: "#e9ecef",
    description: "A soft, gentle white with subtle warmth",
    backgroundColor: "bg-aurora-luminance-antiflash-white",
  },
  {
    name: "Platinum",
    variable: "--aurora-platinum",
    hsl: "210 14% 89%",
    hex: "#dee2e6",
    description: "A balanced, neutral tone for subtle contrasts",
    backgroundColor: "bg-aurora-luminance-platinum",
  },
  {
    name: "French Gray",
    variable: "--aurora-french-gray",
    hsl: "210 14% 83%",
    hex: "#ced4da",
    description: "A refined gray with a hint of sophistication",
    backgroundColor: "bg-aurora-luminance-french-gray",
  },
  {
    name: "French Gray 2",
    variable: "--aurora-french-gray-2",
    hsl: "210 11% 71%",
    hex: "#adb5bd",
    description: "A deeper variant of French Gray for enhanced contrast",
    backgroundColor: "bg-aurora-luminance-french-gray-2",
  },
  {
    name: "Slate Gray",
    variable: "--aurora-slate-gray",
    hsl: "208 7% 46%",
    hex: "#6c757d",
    description: "A modern, versatile mid-tone gray",
    backgroundColor: "bg-aurora-luminance-slate-gray",
  },
  {
    name: "Outer Space",
    variable: "--aurora-outer-space",
    hsl: "210 9% 31%",
    hex: "#495057",
    description: "A deep gray reminiscent of the cosmos",
    backgroundColor: "bg-aurora-luminance-outer-space",
  },
  {
    name: "Onyx",
    variable: "--aurora-onyx",
    hsl: "210 10% 23%",
    hex: "#343a40",
    description: "A rich, dark gray approaching black",
    backgroundColor: "bg-aurora-luminance-onyx",
  },
  {
    name: "Eerie Black",
    variable: "--aurora-eerie-black",
    hsl: "210 11% 15%",
    hex: "#212529",
    description: "Our darkest gray, providing maximum contrast",
    backgroundColor: "bg-aurora-luminance-eerie-black",
  },
];

export const depthColors: ColorDefinition[] = [
  {
    name: "Rich Black",
    variable: "--aurora-depth-rich-black",
    hsl: "232 56% 8%",
    hex: "#0D0F1A",
    description: "The Deepest blue-black, creating a sense of infinite depth",
    backgroundColor: "bg-aurora-depth-rich-black",
  },
  {
    name: "Oxford Blue",
    variable: "--aurora-depth-oxford-blue",
    hsl: "231 57% 12%",
    hex: "#141726",
    description: "A sophisticated dark blue with subtle depth",
    backgroundColor: "bg-aurora-depth-oxford-blue",
  },
  {
    name: "Space Cadet",
    variable: "--aurora-depth-space-cadet",
    hsl: "231 56% 16%",
    hex: "#1B1F33",
    description: "A mysterious blue reminiscent of the night sky",
    backgroundColor: "bg-aurora-depth-space-cadet",
  },
  {
    name: "Penn Blue",
    variable: "--aurora-depth-penn-blue",
    hsl: "231 57% 20%",
    hex: "#222740",
    description: "A rich blue that adds dimensional depth",
    backgroundColor: "bg-aurora-depth-penn-blue",
  },
  {
    name: "Royal Blue Traditional",
    variable: "--aurora-depth-royal-blue",
    hsl: "231 57% 28%",
    hex: "#2F3659",
    description: "A classic blue with royal heritage",
    backgroundColor: "bg-aurora-depth-royal-blue",
  },
  {
    name: "Resolution Blue",
    variable: "--aurora-depth-resolution",
    hsl: "230 58% 32%",
    hex: "#363E66",
    description: "A clear, purposeful blue for strong presence",
    backgroundColor: "bg-aurora-depth-resolution",
  },
  {
    name: "Egyptian Blue",
    variable: "--aurora-depth-egyptian",
    hsl: "231 57% 36%",
    hex: "#3D4573",
    description: "An ancient blue with historical significance",
    backgroundColor: "bg-aurora-depth-egyptian",
  },
  {
    name: "Violet Blue",
    variable: "--aurora-depth-violet",
    hsl: "231 57% 44%",
    hex: "#4B548C",
    description: "A blue with subtle violet undertones",
    backgroundColor: "bg-aurora-depth-violet",
  },
  {
    name: "Byzantine Blue",
    variable: "--aurora-depth-byzantine",
    hsl: "231 57% 52%",
    hex: "#5964A6",
    description: "Our lightest depth blue, bridging to lighter tones",
    backgroundColor: "bg-aurora-depth-byzantine",
  },
];

export const semanticColors: ColorDefinition[] = [
  {
    name: "Primary",
    variable: "--aurora-primary",
    hsl: "220 70% 55%",
    hex: "#2E68D9",
    backgroundColor: "bg-aurora-primary",
    basedOn: "Royal Blue",
    description: "Main brand color, used for primary actions and key UI elements",
    darkMode: {
      hsl: "171 80% 69%",
      hex: "#72efdd",
      basedOn: "Turquoise",
    },
  },
  {
    name: "Secondary",
    variable: "--aurora-secondary",
    hsl: "278 100% 36%",
    hex: "#7400b8",
    backgroundColor: "bg-aurora-secondary",
    basedOn: "French Violet",
    description: "Supporting color for secondary actions and elements",
    darkMode: {
      hsl: "220 70% 55%",
      hex: "#2E68D9",
      basedOn: "Royal Blue",
    },
  },
  {
    name: "Accent",
    variable: "--aurora-accent",
    hsl: "315 87% 48%",
    hex: "#D91A75",
    backgroundColor: "bg-aurora-accent",
    basedOn: "Fashion Fuchsia",
    description:
      "Highlight color for special elements and accent pieces, does not change between modes",
    darkMode: {
      hsl: "315 87% 48%",
      hex: "#D91A75",
      basedOn: "Fashion Fuchsia",
    },
  },
  {
    name: "Base",
    variable: "--aurora-base",
    hsl: "210 17% 98%",
    hex: "#f8f9fa",
    backgroundColor: "bg-aurora-base",
    basedOn: "Seasalt",
    description: "Primary background color",
    darkMode: {
      hsl: "232 56% 8%",
      hex: "#0D0F1A",
      basedOn: "Rich Black",
    },
  },
  {
    name: "Muted",
    variable: "--aurora-muted",
    hsl: "210 14% 89%",
    hex: "#dee2e6",
    backgroundColor: "bg-aurora-muted",
    basedOn: "Platinum",
    description: "Subdued background color for secondary content",
    darkMode: {
      hsl: "232 56% 16%",
      hex: "#1B1F33",
      basedOn: "Space Cadet",
    },
  },
  {
    name: "Border",
    variable: "--aurora-border",
    hsl: "210 14% 83%",
    hex: "#ced4da",
    backgroundColor: "bg-aurora-border",
    basedOn: "French Gray",
    description: "Default border color for UI elements",
    darkMode: {
      hsl: "231 57% 20%",
      hex: "#222740",
      basedOn: "Penn Blue",
    },
  },
  {
    name: "Ring",
    variable: "--aurora-ring",
    hsl: "220 70% 55%",
    hex: "#2E68D9",
    backgroundColor: "bg-aurora-ring",
    basedOn: "Royal Blue",
    description: "Focus ring color for interactive elements",
    darkMode: {
      hsl: "171 80% 69%",
      hex: "#72efdd",
      basedOn: "Turquoise",
    },
  },
];

export const interactiveColors: ColorDefinition[] = [
  {
    name: "Info",
    variable: "--aurora-info",
    hsl: "203 69% 59%",
    hex: "#4ea8de",
    description: "Used for informational messages and helper text",
    backgroundColor: "bg-aurora-info",
    basedOn: "Picton Blue",
  },
  {
    name: "Success",
    variable: "--aurora-success",
    hsl: "188 70% 61%",
    hex: "#56cfe1",
    description: "Indicates successful actions and positive states",
    backgroundColor: "bg-aurora-success",
    basedOn: "Sky Blue",
  },
  {
    name: "Warning",
    variable: "--aurora-warning",
    hsl: "278 100% 36%",
    hex: "#7400b8",
    description: "Highlights potential issues or warnings",
    backgroundColor: "bg-aurora-warning",
    basedOn: "French Violet",
  },
  {
    name: "Destructive",
    variable: "--aurora-destructive",
    hsl: "333 90% 55%",
    hex: "#F03E6B",
    description: "Indicates errors or destructive actions",
    backgroundColor: "bg-aurora-destructive",
    basedOn: "Electric Pink",
  },
  {
    name: "Highlight",
    variable: "--aurora-highlight",
    hsl: "163 100% 75%",
    hex: "#80ffdb",
    description: "Used for highlighting or emphasizing content",
    backgroundColor: "bg-aurora-highlight",
    basedOn: "Aquamarine",
  },
];

export const layerColors: ColorDefinition[] = [
  {
    name: "Layer 100",
    variable: "--aurora-layer-100",
    hsl: "210 17% 98%",
    hex: "#f8f9fa",
    description: "Base layer, main background",
    backgroundColor: "bg-aurora-layer-100",
    basedOn: "Seasalt",
    darkMode: {
      hsl: "232 56% 8%",
      hex: "#0D0F1A",
      basedOn: "Rich Black",
    },
  },
  {
    name: "Layer 200",
    variable: "--aurora-layer-200",
    hsl: "210 16% 93%",
    hex: "#e9ecef",
    description: "Subtle elevation, card backgrounds",
    backgroundColor: "bg-aurora-layer-200",
    basedOn: "Antiflash White",
    darkMode: {
      hsl: "231 57% 12%",
      hex: "#141726",
      basedOn: "Oxford Blue",
    },
  },
  {
    name: "Layer 300",
    variable: "--aurora-layer-300",
    hsl: "210 14% 89%",
    hex: "#dee2e6",
    description: "Light elevation, hover states",
    backgroundColor: "bg-aurora-layer-300",
    basedOn: "Platinum",
    darkMode: {
      hsl: "231 56% 16%",
      hex: "#1B1F33",
      basedOn: "Space Cadet",
    },
  },
  {
    name: "Layer 400",
    variable: "--aurora-layer-400",
    hsl: "210 14% 83%",
    hex: "#ced4da",
    description: "Medium elevation, active states",
    backgroundColor: "bg-aurora-layer-400",
    basedOn: "French Gray",
    darkMode: {
      hsl: "231 57% 20%",
      hex: "#222740",
      basedOn: "Penn Blue",
    },
  },
  {
    name: "Layer 500",
    variable: "--aurora-layer-500",
    hsl: "210 11% 71%",
    hex: "#adb5bd",
    description: "High elevation, modal backgrounds",
    backgroundColor: "bg-aurora-layer-500",
    basedOn: "French Gray 2",
    darkMode: {
      hsl: "231 57% 28%",
      hex: "#2F3659",
      basedOn: "Royal Blue Traditional",
    },
  },
  {
    name: "Layer 600",
    variable: "--aurora-layer-600",
    hsl: "208 7% 46%",
    hex: "#6c757d",
    description: "Elevated components, dropdowns",
    backgroundColor: "bg-aurora-layer-600",
    basedOn: "Slate Gray",
    darkMode: {
      hsl: "230 58% 32%",
      hex: "#363E66",
      basedOn: "Resolution Blue",
    },
  },
  {
    name: "Layer 700",
    variable: "--aurora-layer-700",
    hsl: "210 9% 31%",
    hex: "#495057",
    description: "Deep elevation, nested modals",
    backgroundColor: "bg-aurora-layer-700",
    basedOn: "Outer Space",
    darkMode: {
      hsl: "231 57% 36%",
      hex: "#3D4573",
      basedOn: "Egyptian Blue",
    },
  },
  {
    name: "Layer 800",
    variable: "--aurora-layer-800",
    hsl: "210 10% 23%",
    hex: "#343a40",
    description: "Maximum elevation, overlays",
    backgroundColor: "bg-aurora-layer-800",
    basedOn: "Onyx",
    darkMode: {
      hsl: "231 57% 44%",
      hex: "#4B548C",
      basedOn: "Violet Blue",
    },
  },
  {
    name: "Layer 900",
    variable: "--aurora-layer-900",
    hsl: "210 11% 15%",
    hex: "#212529",
    description: "Highest elevation, top-level overlays",
    backgroundColor: "bg-aurora-layer-900",
    basedOn: "Eerie Black",
    darkMode: {
      hsl: "231 57% 52%",
      hex: "#5964A6",
      basedOn: "Byzantine Blue",
    },
  },
];

// Utility functions to get color definitions
export const getColor = (
  colorName: string,
  category: "base" | "semantic" | "interactive" | "layer" | "luminance" | "depth" = "base"
): ColorDefinition | undefined => {
  const colorCategories: Record<
    "base" | "semantic" | "interactive" | "layer" | "luminance" | "depth",
    ColorDefinition[]
  > = {
    base: baseColors,
    semantic: semanticColors,
    interactive: interactiveColors,
    layer: layerColors,
    luminance: luminanceColors,
    depth: depthColors,
  };

  return colorCategories[category]?.find(
    (color) =>
      color.name.toLowerCase() === colorName.toLowerCase() ||
      color.variable === colorName ||
      color.hex.toLowerCase() === colorName.toLowerCase()
  );
};

export const colorCategories = {
  baseColors,
  semanticColors,
  interactiveColors,
  layerColors,
  luminanceColors,
  depthColors,
};
