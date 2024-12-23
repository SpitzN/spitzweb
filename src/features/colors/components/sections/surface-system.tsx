// src/features/colors/components/sections/surface-system.tsx
import { luminanceColors, depthColors } from "@/lib/config/colors";
import { Card, CardContent } from "@/components/ui/card";
import { ColorBar } from "../shared/color-bar";
import { ColorSection } from "../shared/color-section";
import { CustomList } from "@/components/common/custom-list";

export function SurfaceSystem() {
  return (
    <section className="space-y-8">
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
              {
                subtitle: "Decreasing saturation: 17% → 7%",
                text: "Creates natural depth.",
              },
              {
                subtitle: "Wide luminance range: 98% → 15%",
                text: "Enhances accessibility and readability.",
              },
            ]}
            variant="simple"
          />
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
  );
}
