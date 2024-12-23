// src/lib/plugins/shadcn-plugin.ts
import plugin from "tailwindcss/plugin";

export const shadcnPlugin = plugin(
  function ({ addBase }) {
    addBase({
      ":root": {
        // Base Layers
        "--background": "210 17% 98%", // luminance-seasalt
        "--foreground": "210 11% 15%", // luminance-eerie-black

        // Card & Popover
        "--card": "210 16% 93%", // luminance-antiflash-white
        "--card-foreground": "210 11% 15%", // luminance-eerie-black
        "--popover": "210 14% 89%", // luminance-platinum
        "--popover-foreground": "210 11% 15%", // luminance-eerie-black

        // Primary
        "--primary": "220 70% 55%", // Royal Blue
        "--primary-foreground": "210 17% 98%", // Seasalt

        // Secondary
        "--secondary": "278 100% 36%", // French Violet
        "--secondary-foreground": "210 17% 98%", // Seasalt

        // Muted
        "--muted": "210 14% 89%", // luminance-platinum
        "--muted-foreground": "210 9% 31%", // aurora-outer-space

        // Accent
        "--accent": "315 87% 48%", // aurora-fashion-fuchsia
        "--accent-foreground": "210 17% 98%", // aurora-seasalt

        // Destructive
        "--destructive": "333 90% 55%", // aurora-electric-pink
        "--destructive-foreground": "210 17% 98%", // luminance-seasalt

        // Border, Input, Ring
        // Updated border and input
        "--border": "210 14% 83%", // French Gray
        "--input": "210 14% 89%", // Platinum
        "--ring": "220 70% 55%", // aurora-royal-blue

        // Chart Colors
        "--chart-1": "333 90% 55%", // aurora-electric-pink
        "--chart-2": "315 87% 48%", // aurora-fashion-fuchsia
        "--chart-3": "278 100% 36%", // aurora-french-violet
        "--chart-4": "232 58% 52%", // aurora-byzantine-blue
        "--chart-5": "220 70% 55%", // aurora-royal-blue

        // Radius
        "--radius": "0.5rem",

        // Sidebar
        "--sidebar-background": "210 17% 98%", // luminance-seasalt
        "--sidebar-foreground": "210 9% 31%", // aurora-outer-space
        "--sidebar-muted": "210 14% 89%", // luminance-platinum
        "--sidebar-accent": "220 70% 55%", // aurora-royal-blue
        "--sidebar-accent-foreground": "210 17% 98%", // luminance-seasalt
        "--sidebar-border": "210 14% 83%", // luminance-french-gray
      },
      ".dark": {
        // Base Layers
        "--background": "232 56% 8%", // depth-rich-black
        "--foreground": "210 17% 98%", // luminance-seasalt

        // Card & Popover
        "--card": "231 57% 12%", // depth-oxford-blue
        "--card-foreground": "210 17% 98%", // aurora-seasalt
        "--popover": "231 57% 12%", // depth-oxford-blue
        "--popover-foreground": "210 17% 98%", // luminance-seasalt

        // Primary
        "--primary": "171 80% 69%", // Turquoise
        "--primary-foreground": "232 56% 8%", // Rich Black

        // Secondary
        "--secondary": "220 70% 55%", // Royal Blue
        "--secondary-foreground": "210 17% 98%", // Seasalt

        // Muted
        "--muted": "232 56% 16%", // Space Cadet
        "--muted-foreground": "210 14% 83%", // French Gray

        // Accent
        "--accent": "315 87% 48%", // aurora-fashion-fuchsia
        "--accent-foreground": "210 17% 98%", // aurora-seasalt

        // Destructive
        "--destructive": "333 90% 55%", // aurora-electric-pink
        "--destructive-foreground": "210 17% 98%", // aurora-seasalt

        // Border, Input, Ring

        "--border": "231 57% 20%", // Penn Blue
        "--input": "231 57% 20%", // Penn Blue
        "--ring": "171 80% 69%", // Turquoise

        // Chart Colors (kept consistent with light mode)
        "--chart-1": "333 90% 55%", // aurora-electric-pink
        "--chart-2": "315 87% 48%", // aurora-fashion-fuchsia
        "--chart-3": "278 100% 36%", // aurora-french-violet
        "--chart-4": "232 58% 52%", // aurora-byzantine-blue
        "--chart-5": "220 70% 55%", // aurora-royal-blue

        // Sidebar
        "--sidebar-background": "232 56% 8%", // depth-rich-black
        "--sidebar-foreground": "210 17% 98%", // luminance-seasalt
        "--sidebar-muted": "231 57% 20%", // depth-penn-blue
        "--sidebar-accent": "220 70% 55%", // aurora-royal-blue
        "--sidebar-accent-foreground": "232 56% 8%", // depth-rich-black
        "--sidebar-border": "231 56% 16%", // depth-space-cadet
      },
    });

    addBase({
      "*": {
        "@apply border-border": {},
      },
      // body: {
      //   "@apply bg-background text-foreground": {},
      // },
    });
  },
  {
    theme: {
      extend: {
        colors: {
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          chart: {
            "1": "hsl(var(--chart-1))",
            "2": "hsl(var(--chart-2))",
            "3": "hsl(var(--chart-3))",
            "4": "hsl(var(--chart-4))",
            "5": "hsl(var(--chart-5))",
          },
          sidebar: {
            DEFAULT: "hsl(var(--sidebar-background))",
            foreground: "hsl(var(--sidebar-foreground))",
            muted: "hsl(var(--sidebar-muted))",
            accent: "hsl(var(--sidebar-accent))",
            "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
            border: "hsl(var(--sidebar-border))",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
          "accordion-down": {
            from: {
              height: "0",
            },
            to: {
              height: "var(--radix-accordion-content-height)",
            },
          },
          "accordion-up": {
            from: {
              height: "var(--radix-accordion-content-height)",
            },
            to: {
              height: "0",
            },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
  }
);
