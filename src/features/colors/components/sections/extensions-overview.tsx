// src/features/colors/components/sections/extensions-overview.tsx
import { semanticColors, layerColors, interactiveColors } from "@/lib/config/colors";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ColorSection } from "../shared/color-section";
import { CustomList } from "@/components/common/custom-list";
import { Palette, Contrast, Layout } from "lucide-react";

export function ExtensionsOverview() {
  return (
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
  );
}
