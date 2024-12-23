// src/lib/plugins/typography-plugin.ts
import plugin from "tailwindcss/plugin";

export const typographyPlugin = plugin(
  function ({ addBase, theme }) {
    addBase({
      // Root styles
      ":root": {
        "--font-heading": theme("fontFamily.heading"),
        "--font-body": theme("fontFamily.sans"),
      },

      // Base text styles
      body: {
        fontFamily: "var(--font-body)",
        lineHeight: theme("lineHeight.normal"),
        fontWeight: theme("fontWeight.normal"),
        textRendering: "optimizeLegibility",
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
      },

      // Headings
      "h1,h2,h3,h4,h5,h6": {
        fontFamily: "var(--font-heading)",
        fontWeight: theme("fontWeight.semibold"),
      },

      // Heading sizes

      h1: {
        fontSize: theme("fontSize.4xl"),
        lineHeight: theme("lineHeight.tight"),
        letterSpacing: theme("letterSpacing.tight"),
        "@screen md": {
          fontSize: theme("fontSize.5xl"),
        },
      },
      h2: {
        fontSize: theme("fontSize.3xl"),
        lineHeight: theme("lineHeight.tight"),
        letterSpacing: theme("letterSpacing.tight"),
        "@screen md": {
          fontSize: theme("fontSize.4xl"),
        },
      },
      h3: {
        fontSize: theme("fontSize.2xl"),
        lineHeight: theme("lineHeight.snug"),
        "@screen md": {
          fontSize: theme("fontSize.3xl"),
        },
      },
      h4: {
        fontSize: theme("fontSize.xl"),
        lineHeight: theme("lineHeight.snug"),
        "@screen md": {
          fontSize: theme("fontSize.2xl"),
        },
      },

      // Paragraphs
      p: {
        lineHeight: theme("lineHeight.relaxed"),
        // marginBottom: theme("margin.1"),
        // "&:last-child": {
        //   marginBottom: "0",
        // },
      },

      // Lists
      "ul,ol": {
        lineHeight: theme("lineHeight.relaxed"),
        marginBottom: theme("margin.4"),
        "&:last-child": {
          marginBottom: "0",
        },
      },

      // Basic element styles
      a: {
        color: "hsl(var(--primary))",
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },

      code: {
        backgroundColor: "hsl(var(--muted))",
        borderRadius: theme("borderRadius.sm"),
        padding: `${theme("spacing.1")} ${theme("spacing.2")}`,
        fontSize: theme("fontSize.sm"),
      },

      pre: {
        backgroundColor: "hsl(var(--muted))",
        borderRadius: theme("borderRadius.md"),
        padding: theme("spacing.4"),
        overflowX: "auto",
        fontSize: theme("fontSize.sm"),
      },
    });
  },
  {
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-sans)", "system-ui", "sans-serif"],
          heading: ["var(--font-heading)", "var(--font-sans)", "system-ui", "sans-serif"],
          mono: ["var(--font-mono)", "monospace"],
        },
      },
    },
  }
);
