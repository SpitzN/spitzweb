// src/features/colors/components/sections/color-palette-construction.tsx
import { baseColors } from "@/lib/config/colors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorBar } from "../shared/color-bar";
import { ColorPreview } from "../shared/color-preview";
import { CustomList } from "@/components/common/custom-list";
import { useColorGroups } from "../../hooks/use-color-groups";
import type { ColorDefinition } from "@/types/color-system";

export function ColorPaletteConstruction() {
  const {
    warmGroupColors,
    transitionGroupColors,
    coolGroupColors,
    warmCount,
    transitionCount,
    coolCount,
  } = useColorGroups(baseColors);

  return (
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
              Foundational palette progresses from warm to cool tones, providing a complete spectrum
              for both functional and decorative uses.
            </p>
            <ColorBar colors={baseColors} showLabels />
          </CardContent>
        </Card>
      </div>

      <Card className="grid">
        <CardContent className="flex flex-col gap-4 md:flex-row md:justify-between">
          <ColorGroup title="Warm Group" count={warmCount} colors={warmGroupColors} />
          <ColorGroup
            title="Transition Group"
            count={transitionCount}
            colors={transitionGroupColors}
          />
          <ColorGroup title="Cool Group" count={coolCount} colors={coolGroupColors} />
        </CardContent>
      </Card>
    </section>
  );
}

interface ColorGroupProps {
  title: string;
  count: number;
  colors: ColorDefinition[];
}

function ColorGroup({ title, count, colors }: ColorGroupProps) {
  return (
    <div className="grid gap-4 md:justify-items-center">
      <div className="flex items-center gap-2 md:flex-col">
        <h4 className="py-4">{title}</h4>
        <span className="text-xs text-muted-foreground">{count} colors</span>
      </div>

      <div className="flex w-fit flex-wrap gap-4 lg:flex-nowrap">
        {colors.map((color) => (
          <ColorPreview key={color.variable} color={color} size="xs" variant="circle" />
        ))}
      </div>
    </div>
  );
}
