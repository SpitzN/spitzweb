// src/features/colors/color-docs.tsx

import {
  baseColors,
  luminanceColors,
  depthColors,
  semanticColors,
  layerColors,
  interactiveColors,
} from "@/lib/config/colors";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { filterColorsByHue } from "@/lib/utils/color-utils";
import { ColorBar } from "@/features/colors/components/color-bar";
import { ColorPreview } from "@/features/colors/components/color-preview";
import { ColorSection } from "@/features/colors/components/color-section";
import CustomList from "@/components/common/custom-list";
import { Circle, Contrast, Layout, Palette } from "lucide-react";
import { CodeBlock } from "@/components/common/code-block";

const lightModeMapping = `:root {
  --background: 210 17% 98%;              /* luminance-seasalt */
  --foreground: 210 11% 15%;              /* luminance-eerie-black */
  --card: 210 16% 93%;                    /* luminance-antiflash-white */
  --card-foreground: 210 11% 15%;         /* luminance-eerie-black */
  --popover: 210 14% 89%,                 /* luminance-platinum */
  --popover-foreground: 210 11% 15%,      /* luminance-eerie-black */
  --primary: 220 70% 55%;                 /* Royal Blue */
  --primary-foreground: 210 17% 98%;      /* Seasalt */
  --secondary: 278 100% 36%;              /* French Violet */
  --secondary-foreground: 210 17% 98%;    /* Seasalt */
  --muted: 210 14% 89%;                   /* luminance-platinum */
  --muted-foreground: 210 9% 31%;         /* aurora-outer-space */
  --accent: 315 87% 48%;                  /* aurora-fashion-fuchsia */
  --accent-foreground: 210 17% 98%;       /* aurora-seasalt */
  --destructive: 333 90% 55%;             /* aurora-electric-pink */
  --destructive-foreground: 210 17% 98%;  /* luminance-seasalt */
  --border: 210 14% 83%;                  /* French Gray */
  --input: 210 14% 89%;                   /* Platinum */
  --ring: 220 70% 55%;                    /* aurora-royal-blue */
}`;

const darkModeMapping = `.dark {
  --background: 232 56% 8%;                /* depth-rich-black */
  --foreground: 210 17% 98%;              /* luminance-seasalt */
  --card: 231 57% 12%;                    /* depth-oxford-blue */
  --card-foreground: 210 17% 98%;         /* aurora-seasalt */
  --popover: 231 57% 12%;                 /* depth-oxford-blue */
  --popover-foreground: 210 17% 98%;      /* luminance-seasalt */
  --primary: 171 80% 69%;                 /* Turquoise */
  --primary-foreground: 232 56% 8%;       /* Rich Black */
  --secondary: 220 70% 55%;               /* Royal Blue */
  --secondary-foreground: 210 17% 98%;    /* Seasalt */
  --muted: 232 56% 16%;                   /* Space Cadet */
  --muted-foreground: 210 14% 83%;        /* French Gray */
  --accent: 315 87% 48%;                  /* aurora-fashion-fuchsia */
  --accent-foreground: 210 17% 98%;       /* aurora-seasalt */
  --destructive: 333 90% 55%;             /* aurora-electric-pink */
  --destructive-foreground: 210 17% 98%;  /* aurora-seasalt */
  --border: 231 57% 20%;                  /* Penn Blue */
  --input: 231 57% 20%;                   /* Penn Blue */
  --ring: 171 80% 69%;                    /* Turquoise */
}`;

export const colorGroups = {
  warm: { minHue: 263, maxHue: 360 }, // Pinks, Magentas, Violets
  transition: { minHue: 220, maxHue: 262 }, // Purples, Blue-Purples
  cool: { minHue: 160, maxHue: 219 }, // Blues, Aquas
} as const;

// Filter colors for each group
export const warmColors = filterColorsByHue(
  baseColors,
  colorGroups.warm.minHue,
  colorGroups.warm.maxHue
);
export const transitionColors = filterColorsByHue(
  baseColors,
  colorGroups.transition.minHue,
  colorGroups.transition.maxHue
);
export const coolColors = filterColorsByHue(
  baseColors,
  colorGroups.cool.minHue,
  colorGroups.cool.maxHue
);

// Handle edge cases (colors at 0/360 boundary)
export const getGroupColors = (group: keyof typeof colorGroups) => {
  if (group === "warm") {
    // Include colors with hue 0-30 as well
    const lowHueColors = filterColorsByHue(baseColors, 0, 30);
    return [...warmColors, ...lowHueColors];
  }
  if (group === "cool") {
    return coolColors;
  }
  return transitionColors;
};

// Move color calculations outside component
const warmGroupColors = getGroupColors("warm");
const transitionGroupColors = getGroupColors("transition");
const coolGroupColors = getGroupColors("cool");

export function ColorsDocs() {
  // const designPrinciples =
  return (
    <article className="space-y-16">
      <section className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Aurora Color System: Design Documentation</h1>
          <p>
            The Aurora Color System is a comprehensive color framework inspired by the ethereal
            beauty of auroras and the deep cosmos. This system was designed to create a harmonious
            and accessible color palette that seamlessly transitions between light and dark modes
            while maintaining visual hierarchy and meaning.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Design Philosophy</h2>
          <p>The system&apos;s design is built on three core principles:</p>
        </div>

        <div className="space-y-4">
          <CustomList
            title="Cosmic Design Principles"
            size={"full"}
            items={[
              {
                subtitle: "Cosmic Inspiration",
                text: "The color progression moves from warm to cool tones, mimicking the natural color transitions seen in auroras and cosmic phenomena. This creates a unique and cohesive visual language that ties into the cosmic theme.",
              },
              {
                subtitle: "Dual-Mode Architecture",
                text: "Instead of simple inversion for dark mode, dedicated surface scales are optimized for both light and dark environments. The luminance scale handles light mode surfaces, while the depth scale provides rich, blue-tinted dark mode surfaces.",
              },
              {
                subtitle: "Semantic Consistency",
                text: "Colors maintain their semantic meaning across themes while adapting their appearance for optimal visibility and contrast in each context.",
              },
            ]}
            iconSize={24}
          />
        </div>

        <div className="space-y-4">
          <ColorSection
            title="Base Colors"
            description="Core color palette progressing from warm to cool tones, forming the foundation of my design system"
            colors={baseColors}
          />
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Color Palette Construction</h2>
          <CustomList
            title="Base Colors (Warm to Cool)"
            items={[
              {
                subtitle: "Maintaining consistent saturation bands",
                text: "(55-75% for most colors)",
              },
              {
                subtitle: "Gradual hue progression",
                text: "(333° → 163°)",
              },
              {
                subtitle: "Strategic luminance adjustments",
                text: "For accessibility",
              },
            ]}
            layout="grid"
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Base Palette Progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Foundational palette progresses from warm to cool tones, providing a complete
                spectrum for both functional and decorative uses.
              </p>
              <ColorBar colors={baseColors} showLabels />
            </CardContent>
          </Card>
        </div>

        <Card className="grid">
          <CardContent className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="grid gap-4 md:justify-items-center">
              <div className="flex items-center gap-2 md:flex-col">
                <h4 className="py-4">Warm Group</h4>
                <span className="text-xs text-muted-foreground">
                  {warmGroupColors.length} colors
                </span>
              </div>

              <div className="flex w-fit flex-wrap gap-4 lg:flex-nowrap">
                {warmGroupColors.map((color) => (
                  <ColorPreview key={color.variable} color={color} size="xs" variant="circle" />
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:justify-items-center">
              <div className="flex items-center gap-2 md:flex-col">
                <h4 className="py-4">Transition Group</h4>
                <span className="text-xs text-muted-foreground">
                  {transitionGroupColors.length} colors
                </span>
              </div>

              <div className="flex w-fit flex-wrap gap-4 lg:flex-nowrap">
                {transitionGroupColors.map((color) => (
                  <ColorPreview key={color.variable} color={color} size="xs" variant="circle" />
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:justify-items-center">
              <div className="flex items-center gap-2 md:flex-col">
                <h4 className="py-4">Cool Group</h4>
                <span className="text-xs text-muted-foreground">
                  {coolGroupColors.length} colors
                </span>
              </div>

              <div className="flex w-fit flex-wrap gap-4 lg:flex-nowrap">
                {coolGroupColors.map((color) => (
                  <ColorPreview key={color.variable} color={color} size="xs" variant="circle" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Surface System</h3>
          <p>Two carefully designed surface scales optimize both light and dark environments.</p>
          <p>
            These scales ensure a balanced visual experience while maintaining readability and
            contrast.
          </p>
          <p>
            The luminance scale provides a neutral gray base for light mode, while the depth scale
            enriches dark mode with blue-tinted surfaces.
          </p>
        </div>

        <Card className="py-4">
          <CardContent className="space-y-4">
            <CustomList
              title="Luminance Scale Progression"
              layout="grid"
              items={[
                {
                  subtitle: "Consistent hue: 210°",
                  text: "Provides a unified base tone for light mode.",
                },
                { subtitle: "Decreasing saturation: 17% → 7%", text: "Creates natural depth." },
                {
                  subtitle: "Wide luminance range: 98% → 15%",
                  text: "Enhances accessibility and readability.",
                },
              ]}
              variant="simple"
            />
          </CardContent>
          <CardContent className="space-y-4">
            <ColorBar colors={luminanceColors} showLabels />
          </CardContent>
          <CardContent className="space-y-4">
            <CustomList
              title="Depth Scale (Dark Mode)"
              layout="grid"
              items={[
                {
                  subtitle: "Consistent hue: 231-232°",
                  text: "Provides a rich, blue-tinted base for dark mode.",
                },
                {
                  subtitle: "Stable saturation: ~57%",
                  text: "Maintains a visually pleasing appearance.",
                },
                {
                  subtitle: "Controlled luminance progression: 8% → 52%",
                  text: "Ensures clear hierarchy and depth.",
                },
              ]}
              variant="simple"
            />
          </CardContent>
          <CardContent>
            <ColorBar colors={depthColors} showLabels />
          </CardContent>
          <CardContent>
            <CustomList
              title="Why It Works"
              layout="grid"
              items={[
                {
                  subtitle: "Neutral grays for light mode",
                  text: "Luminance scale ensures subtle cool tones for light interfaces.",
                },
                {
                  subtitle: "Rich tones for dark mode",
                  text: "Depth scale provides a vibrant, readable foundation in dark mode.",
                },
                {
                  subtitle: "Consistent relationships",
                  text: "Maintains clear layer distinctions across interface components.",
                },
              ]}
              variant="simple"
            />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <ColorSection
          title="Luminance Scale Palette"
          description="The luminance scale maintains a consistent hue (210) while varying saturation and lightness to create natural depth."
          colors={luminanceColors}
          size="sm"
          className="mt-6"
        />
        <ColorSection
          title="Depth Scale Palette"
          description="The depth scale uses a consistent blue hue (231-232) with carefully calibrated saturation and lightness to create depth while maintaining readability."
          colors={depthColors}
          size="sm"
          className="mt-6"
        />
      </section>

      <section className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Color System Extensions: Semantic, Layer, and Interactive Colors</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <CustomList
              title="Key Design Principles"
              variant="bordered"
              items={[
                {
                  subtitle: "Semantic Relationships",
                  text: "Colors have defined meanings, providing consistent visual cues across themes and UI components.",
                  icon: Palette,
                },
                {
                  subtitle: "Contrast Management",
                  text: "Careful adjustments ensure all colors meet WCAG 2.1 contrast ratios, making designs accessible and visually clear.",
                  icon: Contrast,
                },
                {
                  subtitle: "Dynamic Scaling",
                  text: "Seamless transitions between light and dark modes maintain aesthetic coherence and functional clarity.",
                  icon: Layout,
                },
              ]}
              className="mt-4"
            />

            <CustomList
              title="Key Benefits"
              variant="bordered"
              items={[
                {
                  subtitle: "Consistency",
                  text: "Semantic colors provide a unified language for design, ensuring that buttons, alerts, and other elements look cohesive across themes.",
                  icon: Palette,
                },
                {
                  subtitle: "Accessibility",
                  text: "Luminance and depth scales ensure sufficient contrast for text and UI components.",
                  icon: Contrast,
                },
                {
                  subtitle: "Visual Comfort",
                  text: "Layer colors optimize readability in both light and dark modes by offering subtle tonal differences for depth and hierarchy.",
                  icon: Layout,
                },
                {
                  subtitle: "Unified Experience",
                  text: "Interactive states ensure that user feedback is clear and immediate, maintaining continuity across themes.",
                  icon: Palette,
                },
              ]}
              className="mt-4"
            />

            <div className="col-span-2">
              <h4 className="mt-6 text-lg font-semibold">Why It Works</h4>
              <p>
                The System succeeds because it integrates semantic meaning, aesthetic harmony, and
                functional clarity into every design decision. By balancing aesthetic and functional
                needs, it delivers an intuitive and visually compelling experience.
              </p>
            </div>
          </CardContent>
        </Card>

        <ColorSection
          title="Semantic Colors"
          description="The semantic color system ensures consistent color meanings across themes while adapting their appearance for light and dark modes."
          colors={semanticColors}
          size="sm"
        />

        <ColorSection
          title="Layer Colors"
          description="Layer colors include both light-mode luminance layers and dark-mode depth layers for a balanced user experience."
          colors={layerColors}
          size="sm"
        />

        <ColorSection
          title="Interactive States"
          description="Interactive states provide clear feedback to users, with distinct colors for info, success, warning, and error states."
          colors={interactiveColors}
          size="sm"
        />
      </section>

      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Integration with Shadcn/UI</h2>

          <Card>
            <CardHeader>
              <CardTitle>Integrating the Aurora Color System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Aurora Color System integrates seamlessly with Shadcn/UI to deliver a robust and
                adaptable theming solution. By leveraging Aurora’s comprehensive color palettes and
                Shadcn’s semantic CSS variables, the integration ensures visual consistency,
                accessibility, and aesthetic harmony across all UI components.
              </p>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <CustomList
                  title="Core Integration Strategy"
                  iconSize={12}
                  variant="elevated"
                  items={[
                    {
                      subtitle: "Mapping Aurora Palettes",
                      text: "HSL values from Aurora’s semantic, layer, and interactive palettes are assigned to Shadcn variables like --background, --foreground, and --primary.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Dynamic Theme Switching",
                      text: "Aurora’s Luminance Scale is used for light mode, while its Depth Scale defines dark mode. The :root and .dark classes handle seamless transitions.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Custom Variables",
                      text: "New variables like --sidebar-background and --chart-* were added to accommodate advanced use cases while preserving Aurora’s design language.",
                      icon: Circle,
                    },
                  ]}
                />

                <CustomList
                  title="Key Features of Integration"
                  iconSize={12}
                  variant="elevated"
                  items={[
                    {
                      subtitle: "Enhanced Accessibility",
                      text: "All color combinations meet WCAG 2.1 contrast requirements, ensuring an accessible experience in both light and dark modes.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Semantic Clarity",
                      text: "Semantic colors like --primary and --accent maintain their intended meanings across themes, supporting intuitive interaction patterns.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Layer Hierarchy",
                      text: "By using Aurora’s Luminance and Depth scales, the system establishes clear depth distinctions, enhancing readability and UI layering.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Custom Additions",
                      text: "Sidebar and chart-specific variables were introduced, allowing tailored theming for dashboards and data visualizations.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Resilience to Framework Updates",
                      text: "Using HSL ensures the system remains flexible and future-proof, accommodating new design requirements with minimal effort.",
                      icon: Circle,
                    },
                  ]}
                />

                <CustomList
                  title="Why This Works"
                  iconSize={12}
                  variant="elevated"
                  items={[
                    {
                      subtitle: "HSL for Precision",
                      text: "Fine-grained control over hue, saturation, and lightness enables Aurora to adapt seamlessly across light and dark modes.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Semantic Mapping",
                      text: "Predictable and consistent roles for variables like --primary and --accent streamline development and design workflows.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Balanced Visual Comfort",
                      text: "Aurora’s careful balance of bright and rich tones reduces eye strain while enhancing visual appeal.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Developer-Friendly",
                      text: "Tailwind classes like bg-primary and text-primary-foreground make implementation straightforward and intuitive.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Future-Proof",
                      text: "The system’s modular structure supports easy extension, such as adding new chart colors or sidebar accents.",
                      icon: Circle,
                    },
                  ]}
                />

                <CustomList
                  title="Potential Enhancements"
                  iconSize={12}
                  variant="elevated"
                  items={[
                    {
                      subtitle: "Theming API",
                      text: "Introduce a utility or hook, useAuroraTheme, to expose theme states and dynamic color values for advanced customizations.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Dynamic Palettes",
                      text: "Add runtime palette generation using CSS Houdini or similar tools to enhance flexibility.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Smooth Transitions",
                      text: "Use animations for theme switching to create a polished user experience.",
                      icon: Circle,
                    },
                    {
                      subtitle: "Debugging Tools",
                      text: "Visualize active colors in the current theme for easier design validation and debugging.",
                      icon: Circle,
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <div className="columns-2 items-center justify-center space-y-4">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Light Mode Mappings</h3>
              <CodeBlock codeBlock={lightModeMapping} language="css" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Dark Mode Mappings</h3>
              <CodeBlock codeBlock={darkModeMapping} language="css" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Implementation Details</h2>

          <CustomList
            title="Key Steps"
            variant="elevated"
            items={[
              {
                subtitle: "CSS Variable Structure",
                text: "HSL values in CSS variables for maximum flexibility.",
              },
              {
                subtitle: "Theme Switching",
                text: "Handled via the .dark class, remapping semantic and layer colors while retaining variable names.",
              },
              {
                subtitle: "Usage Guidelines",
                text: "Base colors for branding, Luminance for light surfaces, Depth for dark surfaces—maintain semantic meanings across themes.",
              },
            ]}
            className="space-y-2"
          />

          <p>The system uses HSL values in CSS variables for maximum flexibility:</p>
          <CodeBlock
            codeBlock={`--aurora-[color-name]: "[hue] [saturation]% [lightness]%";`}
            language="css"
          />
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Accessibility Considerations</h2>

          <CustomList
            title="WCAG 2.1 Compliance"
            variant="elevated"
            items={[
              {
                subtitle: "Contrast Requirements",
                text: "All color combos meet contrast requirements; interactive elements have distinct states; colors are distinguishable for color-blind users.",
              },
            ]}
          />
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Future Considerations</h2>
          <CustomList
            title=""
            variant="elevated"
            items={[
              {
                subtitle: "Expansion Possibilities",
                text: "Additional variations, custom scales",
              },
              {
                subtitle: "Maintenance",
                text: "Regular contrast checks, user feedback",
              },
              {
                subtitle: "Integration",
                text: "More frameworks, custom tooling",
              },
            ]}
            className="space-y-1"
          />
        </div>
      </section>
    </article>
  );
}
