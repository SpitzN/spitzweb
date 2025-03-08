"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColorSwatch } from "./color-swatch";
import { hexToRgb, getContrastRatio } from "@/lib/utils/color-utils";
import { useState } from "react";
import { X } from "lucide-react";
import { useColorContext } from "@/features/colors/context/color-context";
import type { ColorDefinition } from "@/types/color-system";

export function ColorCompare() {
  const { comparedColors, compareColors } = useColorContext();
  const [showDetails, setShowDetails] = useState(false);
  const [color1, color2] = comparedColors;

  if (!color1 || !color2) return null;

  const contrastRatio = getContrastRatio(color1.hex, color2.hex);
  const meetsAA = contrastRatio >= 4.5;
  const meetsAAA = contrastRatio >= 7;
  const rgb1 = hexToRgb(color1.hex);
  const rgb2 = hexToRgb(color2.hex);

  const handleClear = () => {
    // Pass the same colors to reset the comparison
    compareColors(color1, color1);
  };

  return (
    <Card className="relative">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleClear}>
        <X className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle className="text-lg">Color Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <ColorDetails color={color1} />
          <ColorDetails color={color2} />
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Contrast Ratio: {contrastRatio.toFixed(2)}:1</p>
            <div className="space-y-1 text-sm">
              <AccessibilityLevel level="AA" passes={meetsAA} requirement="4.5:1" />
              <AccessibilityLevel level="AAA" passes={meetsAAA} requirement="7:1" />
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide" : "Show"} Technical Details
          </Button>

          {showDetails && (
            <div className="rounded-md bg-muted p-3 text-xs">
              <p>RGB Values:</p>
              <p className="font-mono">
                Color 1: rgb({rgb1.r}, {rgb1.g}, {rgb1.b})
              </p>
              <p className="font-mono">
                Color 2: rgb({rgb2.r}, {rgb2.g}, {rgb2.b})
              </p>
              <p className="mt-2">HSL Values:</p>
              <p className="font-mono">Color 1: {color1.hsl}</p>
              <p className="font-mono">Color 2: {color2.hsl}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ColorDetails({ color }: { color: ColorDefinition }) {
  return (
    <div>
      <ColorSwatch color={color} size="md" />
      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium">{color.name}</p>
        <p className="font-mono text-xs text-muted-foreground">{color.variable}</p>
      </div>
    </div>
  );
}

interface AccessibilityLevelProps {
  level: "AA" | "AAA";
  passes: boolean;
  requirement: string;
}

function AccessibilityLevel({ level, passes, requirement }: AccessibilityLevelProps) {
  return (
    <p>
      WCAG {level}:{" "}
      <span className={passes ? "text-success" : "text-destructive"}>
        {passes ? "Passes" : "Fails"}
      </span>
      <span className="ml-1 text-muted-foreground">(requires {requirement})</span>
    </p>
  );
}
