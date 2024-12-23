// src/lib/plugins/auroraPlugin.ts
import plugin from "tailwindcss/plugin";

export const auroraPlugin = plugin(
  function ({ addBase }) {
    addBase({
      ":root": {
        // Base color palette - Warm to Cool Progression
        "--aurora-electric-pink": "333 90% 55%",
        "--aurora-fashion-fuchsia": "315 87% 48%",
        "--aurora-deep-magenta": "295 92% 42%",
        "--aurora-french-violet": "278 100% 36%",
        "--aurora-grape": "263 60% 48%",
        "--aurora-slate-blue": "239 53% 59%",
        "--aurora-byzantine-blue": "232 58% 52%",
        "--aurora-royal-blue": "220 70% 55%",
        "--aurora-united-nations-blue": "213 64% 59%",
        "--aurora-picton-blue": "203 69% 59%",
        "--aurora-aero": "194 73% 59%",
        "--aurora-sky-blue": "188 70% 61%",
        "--aurora-tiffany-blue": "180 66% 63%",
        "--aurora-turquoise": "171 80% 69%",
        "--aurora-aquamarine": "163 100% 75%",

        // Luminance palette (Gray Scale)
        "--aurora-seasalt": "210 17% 98%",
        "--aurora-antiflash-white": "210 16% 93%",
        "--aurora-platinum": "210 14% 89%",
        "--aurora-french-gray": "210 14% 83%",
        "--aurora-french-gray-2": "210 11% 71%",
        "--aurora-slate-gray": "208 7% 46%",
        "--aurora-outer-space": "210 9% 31%",
        "--aurora-onyx": "210 10% 23%",
        "--aurora-eerie-black": "210 11% 15%",

        // Depth palette (Blue Scale)
        "--aurora-depth-rich-black": "232 56% 8%",
        "--aurora-depth-oxford-blue": "231 57% 12%",
        "--aurora-depth-space-cadet": "231 56% 16%",
        "--aurora-depth-penn-blue": "231 57% 20%",
        "--aurora-depth-royal-blue": "231 57% 28%",
        "--aurora-depth-resolution": "230 58% 32%",
        "--aurora-depth-egyptian": "231 57% 36%",
        "--aurora-depth-violet": "231 57% 44%",
        "--aurora-depth-byzantine": "231 57% 52%",

        // Semantic colors - Light mode
        "--aurora-primary": "220 70% 55%", // Royal Blue
        "--aurora-secondary": "278 100% 36%", // French Violet
        "--aurora-accent": "315 87% 48%", // Fashion Fuchsia
        "--aurora-base": "210 17% 98%", // Seasalt
        "--aurora-muted": "210 14% 89%", // Platinum
        "--aurora-border": "210 14% 83%", // French Gray
        "--aurora-ring": "220 70% 55%", // Royal Blue

        // Interactive State Colors
        "--aurora-destructive": "333 90% 55%", // Electric Pink
        "--aurora-info": "203 69% 59%", // Picton Blue
        "--aurora-success": "188 70% 61%", // Sky Blue
        "--aurora-warning": "278 100% 36%", // French Violet
        "--aurora-highlight": "163 100% 75%", // Aquamarine

        // Original Layer system (Light Mode)
        "--aurora-layer-100": "210 17% 98%", // Seasalt
        "--aurora-layer-200": "210 16% 93%", // Antiflash White
        "--aurora-layer-300": "210 14% 89%", // Platinum
        "--aurora-layer-400": "210 14% 83%", // French Gray
        "--aurora-layer-500": "210 11% 71%", // French Gray 2
        "--aurora-layer-600": "208 7% 46%", // Slate Gray
        "--aurora-layer-700": "210 9% 31%", // Outer Space
        "--aurora-layer-800": "210 10% 23%", // Onyx
        "--aurora-layer-900": "210 11% 15%", // Eerie Black
      },
      ".dark": {
        // Semantic colors - Dark mode
        "--aurora-primary": "171 80% 69%", // Turquoise
        "--aurora-secondary": "220 70% 55%", // Royal Blue
        "--aurora-accent": "315 87% 48%", // Keep Fashion Fuchsia
        "--aurora-base": "232 56% 8%", // Rich Black
        "--aurora-muted": "232 56% 16%", // Space Cadet
        "--aurora-border": "231 57% 20%", // Penn Blue
        "--aurora-ring": "171 80% 69%", // Turquoise

        // Layer system (Dark Mode - Using depth scale)
        "--aurora-layer-100": "232 56% 8%", // depth-rich-black
        "--aurora-layer-200": "231 57% 12%", // depth-oxford-blue
        "--aurora-layer-300": "231 56% 16%", // depth-space-cadet
        "--aurora-layer-400": "231 57% 20%", // depth-penn-blue
        "--aurora-layer-500": "231 57% 28%", // depth-royal-blue
        "--aurora-layer-600": "230 58% 32%", // depth-resolution
        "--aurora-layer-700": "231 57% 36%", // depth-egyptian
        "--aurora-layer-800": "231 57% 44%", // depth-violet
        "--aurora-layer-900": "231 57% 52%", // depth-byzantine},
      },
    });
  },
  {
    theme: {
      extend: {
        colors: {
          aurora: {
            // Semantic colors
            primary: "hsl(var(--aurora-primary))",
            secondary: "hsl(var(--aurora-secondary))",
            accent: "hsl(var(--aurora-accent))",
            base: "hsl(var(--aurora-base))",
            muted: "hsl(var(--aurora-muted))",
            border: "hsl(var(--aurora-border))",
            ring: "hsl(var(--aurora-ring))",
            // Interactive state colors
            info: "hsl(var(--aurora-info))",
            success: "hsl(var(--aurora-success))",
            warning: "hsl(var(--aurora-warning))",
            destructive: "hsl(var(--aurora-destructive))",
            highlight: "hsl(var(--aurora-highlight))",

            // Base color palette
            "electric-pink": "hsl(var(--aurora-electric-pink))",
            "fashion-fuchsia": "hsl(var(--aurora-fashion-fuchsia))",
            "deep-magenta": "hsl(var(--aurora-deep-magenta))",
            "french-violet": "hsl(var(--aurora-french-violet))",
            grape: "hsl(var(--aurora-grape))",
            "slate-blue": "hsl(var(--aurora-slate-blue))",
            "byzantine-blue": "hsl(var(--aurora-byzantine-blue))",
            "royal-blue": "hsl(var(--aurora-royal-blue))",
            "united-nations-blue": "hsl(var(--aurora-united-nations-blue))",
            "picton-blue": "hsl(var(--aurora-picton-blue))",
            aero: "hsl(var(--aurora-aero))",
            "sky-blue": "hsl(var(--aurora-sky-blue))",
            "tiffany-blue": "hsl(var(--aurora-tiffany-blue))",
            turquoise: "hsl(var(--aurora-turquoise))",
            aquamarine: "hsl(var(--aurora-aquamarine))",

            // Grayscale palette
            luminance: {
              seasalt: "hsl(var(--aurora-seasalt))",
              "antiflash-white": "hsl(var(--aurora-antiflash-white))",
              platinum: "hsl(var(--aurora-platinum))",
              "french-gray": "hsl(var(--aurora-french-gray))",
              "french-gray-2": "hsl(var(--aurora-french-gray-2))",
              "slate-gray": "hsl(var(--aurora-slate-gray))",
              "outer-space": "hsl(var(--aurora-outer-space))",
              onyx: "hsl(var(--aurora-onyx))",
              "eerie-black": "hsl(var(--aurora-eerie-black))",
            },

            // Depth palette
            depth: {
              "rich-black": "hsl(var(--aurora-depth-rich-black))",
              "oxford-blue": "hsl(var(--aurora-depth-oxford-blue))",
              "space-cadet": "hsl(var(--aurora-depth-space-cadet))",
              "penn-blue": "hsl(var(--aurora-depth-penn-blue))",
              "royal-blue": "hsl(var(--aurora-depth-royal-blue))",
              resolution: "hsl(var(--aurora-depth-resolution))",
              egyptian: "hsl(var(--aurora-depth-egyptian))",
              violet: "hsl(var(--aurora-depth-violet))",
              byzantine: "hsl(var(--aurora-depth-byzantine))",
            },

            // Single definition for layer colors which are semantically named
            layer: {
              100: "hsl(var(--aurora-layer-100))",
              200: "hsl(var(--aurora-layer-200))",
              300: "hsl(var(--aurora-layer-300))",
              400: "hsl(var(--aurora-layer-400))",
              500: "hsl(var(--aurora-layer-500))",
              600: "hsl(var(--aurora-layer-600))",
              700: "hsl(var(--aurora-layer-700))",
              800: "hsl(var(--aurora-layer-800))",
              900: "hsl(var(--aurora-layer-900))",
            },
          },
        },
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
          "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          "aurora-grid":
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        },
        keyframes: {
          shimmer: {
            "0%": { backgroundPosition: "-1000px 0" },
            "100%": { backgroundPosition: "1000px 0" },
          },
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          "gradient-flow": {
            "0%, 100%": {
              "background-size": "200% 200%",
              "background-position": "left center",
            },
            "50%": {
              "background-size": "200% 200%",
              "background-position": "right center",
            },
          },
          "border-flow": {
            "0%, 100%": {
              "background-position": "0% 50%",
            },
            "50%": {
              "background-position": "100% 50%",
            },
          },
          "fade-in-up": {
            "0%": {
              opacity: "0",
              transform: "translateY(20px)",
            },
            "100%": {
              opacity: "1",
              transform: "translateY(0)",
            },
          },
        },
        animation: {
          shimmer: "shimmer 2s linear infinite",
          float: "float 3s ease-in-out infinite",
          "gradient-flow": "gradient-flow 15s ease infinite",
          "border-flow": "border-flow 3s ease infinite",
          "fade-in-up": "fade-in-up 0.2s ease-out",
        },
      },
    },
  }
);
