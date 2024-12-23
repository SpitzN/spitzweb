// src/features/colors/components/sections/future-considerations.tsx
import { CustomList } from "@/components/common/custom-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FutureConsiderations() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Future Considerations</h2>

        <Card>
          <CardHeader>
            <CardTitle>Future Development Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomList
              title=""
              variant="elevated"
              items={[
                {
                  subtitle: "Expansion Possibilities",
                  text: "Development of additional color variations, custom scales, and specialized palettes for specific use cases.",
                },
                {
                  subtitle: "Maintenance & Updates",
                  text: "Regular contrast ratio checks, user feedback integration, and updates to match evolving accessibility standards.",
                },
                {
                  subtitle: "Framework Integration",
                  text: "Expansion to support additional frameworks and development of custom tooling for improved developer experience.",
                },
                {
                  subtitle: "Advanced Features",
                  text: "Implementation of color mixing, advanced theme customization, and dynamic palette generation.",
                },
              ]}
              className="space-y-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Research Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomList
              title=""
              variant="elevated"
              items={[
                {
                  subtitle: "Color Psychology",
                  text: "Further research into color psychology and its impact on user experience across different cultures.",
                },
                {
                  subtitle: "Performance Optimization",
                  text: "Investigation of CSS variable performance and optimization techniques for large-scale applications.",
                },
                {
                  subtitle: "Accessibility Innovation",
                  text: "Exploration of new techniques for improving color accessibility and user customization options.",
                },
              ]}
              className="space-y-1"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
