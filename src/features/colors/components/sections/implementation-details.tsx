// src/features/colors/components/sections/implementation-details.tsx
import { CustomList } from "@/components/common/custom-list";
import { CodeBlock } from "@/components/common/code-block";

export function ImplementationDetails() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Implementation Details</h2>

        <CustomList
          title="Key Steps"
          variant="elevated"
          items={[
            {
              subtitle: "CSS Variable Structure",
              text: "HSL values in CSS variables for maximum flexibility.",
            },
            {
              subtitle: "Theme Switching",
              text: "Handled via the .dark class, remapping semantic and layer colors while retaining variable names.",
            },
            {
              subtitle: "Usage Guidelines",
              text: "Base colors for branding, Luminance for light surfaces, Depth for dark surfaces—maintain semantic meanings across themes.",
            },
          ]}
          className="space-y-2"
        />

        <p>The system uses HSL values in CSS variables for maximum flexibility:</p>
        <CodeBlock
          codeBlock={`--aurora-[color-name]: "[hue] [saturation]% [lightness]%";`}
          language="css"
        />

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">Variable Implementation</h3>
          <CodeBlock
            codeBlock={`
:root {
  --aurora-primary: var(--aurora-royal-blue);
  --aurora-secondary: var(--aurora-french-violet);
  --aurora-accent: var(--aurora-fashion-fuchsia);
}

.dark {
  --aurora-primary: var(--aurora-turquoise);
  --aurora-secondary: var(--aurora-royal-blue);
  --aurora-accent: var(--aurora-fashion-fuchsia);
}`}
            language="css"
          />
        </div>
      </div>
    </section>
  );
}
