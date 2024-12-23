// src/features/colors/components/shared/color-section.tsx

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { ColorDefinition } from "@/types/color-system";
import { ColorGrid } from "./color-grid";
import { cn } from "@/lib/utils/utils";

interface ColorSectionProps {
  title: string;
  description: string;
  colors: ColorDefinition[];
  className?: string;
  showInfo?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ColorSection({
  title,
  description,
  colors,
  className,
  showInfo = true,
  size = "md",
}: ColorSectionProps) {
  return (
    <Card className={cn("space-y-2", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ColorGrid colors={colors} showInfo={showInfo} size={size} />
      </CardContent>
    </Card>
  );
}