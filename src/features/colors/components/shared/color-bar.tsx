// src/features/colors/components/shared/color-bar.tsx
import type { ColorDefinition } from "@/types/color-system";
import { cn } from "@/lib/utils/utils";

interface ColorBarProps {
  colors: ColorDefinition[];
  className?: string;
  showLabels?: boolean;
}

export function ColorBar({ colors, className, showLabels = false }: ColorBarProps) {
  return (
    <div className={cn("flex h-12 overflow-hidden rounded-lg", className)}>
      {colors.map((color) => (
        <div
          key={color.name}
          className="group relative flex-1"
          style={{
            backgroundColor: `hsl(${color.hsl})`,
          }}
        >
          {showLabels && (
            <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-medium">{color.name}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
