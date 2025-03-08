import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomList } from "@/components/common/custom-list";
import { Circle } from "lucide-react";
import { CodeBlock } from "@/components/common/code-block";
import { lightModeMapping, darkModeMapping } from "@/constants/theme-constants";

export function ShadcnIntegration() {
  return (
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
              adaptable theming solution. By leveraging Aurora&apos;s comprehensive color palettes
              and Shadcn&apos;s semantic CSS variables, the integration ensures visual consistency,
              accessibility, and aesthetic harmony across all UI components.
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <IntegrationStrategyList />
              <IntegrationFeaturesList />
              <ImplementationDetailsList />
              <PotentialEnhancementsList />
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
  );
}

function IntegrationStrategyList() {
  return (
    <CustomList
      title="Core Integration Strategy"
      iconSize={12}
      variant="elevated"
      items={[
        {
          subtitle: "Mapping Aurora Palettes",
          text: "HSL values from Aurora's semantic, layer, and interactive palettes are assigned to Shadcn variables like --background, --foreground, and --primary.",
          icon: Circle,
        },
        {
          subtitle: "Dynamic Theme Switching",
          text: "Aurora's Luminance Scale is used for light mode, while its Depth Scale defines dark mode. The :root and .dark classes handle seamless transitions.",
          icon: Circle,
        },
        {
          subtitle: "Custom Variables",
          text: "New variables like --sidebar-background and --chart-* were added to accommodate advanced use cases while preserving Aurora's design language.",
          icon: Circle,
        },
      ]}
    />
  );
}

function IntegrationFeaturesList() {
  return (
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
          text: "By using Aurora's Luminance and Depth scales, the system establishes clear depth distinctions, enhancing readability and UI layering.",
          icon: Circle,
        },
      ]}
    />
  );
}

function ImplementationDetailsList() {
  return (
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
          text: "Aurora's careful balance of bright and rich tones reduces eye strain while enhancing visual appeal.",
          icon: Circle,
        },
      ]}
    />
  );
}

function PotentialEnhancementsList() {
  return (
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
      ]}
    />
  );
}
