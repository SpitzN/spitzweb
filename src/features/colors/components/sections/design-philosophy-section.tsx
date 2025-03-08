import { CustomList } from "@/components/common/custom-list";
import { ColorGroup } from "../shared/color-group";
import { baseColors } from "@/lib/config/colors";

export function DesignPhilosophy() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Design Philosophy</h2>
        <p>The system&apos;s design is built on three core principles:</p>
      </div>

      <div className="space-y-4">
        <CustomList
          title="Cosmic Design Principles"
          size="full"
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
        <ColorGroup
          title="Base Colors"
          description="Core color palette progressing from warm to cool tones, forming the foundation of my design system"
          colors={baseColors}
        />
      </div>
    </section>
  );
}
