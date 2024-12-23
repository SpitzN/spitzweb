// src/features/colors/components/sections/color-grid.tsx
import { CustomList } from "@/components/common/custom-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AccessibilitySection() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Accessibility Considerations</h2>

        <Card>
          <CardHeader>
            <CardTitle>WCAG 2.1 Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomList
              title=""
              variant="elevated"
              items={[
                {
                  subtitle: "Color Contrast",
                  text: "All text combinations meet WCAG 2.1 Level AA contrast requirements (4.5:1 for normal text, 3:1 for large text).",
                },
                {
                  subtitle: "Interactive Elements",
                  text: "Focus states and interactive elements maintain a minimum 3:1 contrast ratio against adjacent colors.",
                },
                {
                  subtitle: "Color Independence",
                  text: "Information is never conveyed through color alone, ensuring accessibility for color-blind users.",
                },
                {
                  subtitle: "State Indicators",
                  text: "Interactive states are communicated through multiple visual cues beyond just color changes.",
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Blindness Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomList
              title=""
              variant="elevated"
              items={[
                {
                  subtitle: "Distinct Palettes",
                  text: "Colors are distinguishable even in various types of color blindness (protanopia, deuteranopia, tritanopia).",
                },
                {
                  subtitle: "Semantic Reinforcement",
                  text: "Important UI elements use additional visual cues like icons, patterns, or text labels.",
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
