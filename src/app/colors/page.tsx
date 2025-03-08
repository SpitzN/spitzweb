import { AccessibilitySection } from "@/features/colors/components/sections/accessibility-section";
import { ColorPaletteConstruction } from "@/features/colors/components/sections/color-palette-construction-section";
import { DesignPhilosophy } from "@/features/colors/components/sections/design-philosophy-section";
import { ExtensionsOverview } from "@/features/colors/components/sections/extensions-overview-section";
import { FutureConsiderations } from "@/features/colors/components/sections/future-considerations-section";
import { HeaderSection } from "@/features/colors/components/sections/header-section";
import { ImplementationDetails } from "@/features/colors/components/sections/implementation-details-section";
import { ShadcnIntegration } from "@/features/colors/components/sections/shadcn-integration-section";
import { SurfaceSystem } from "@/features/colors/components/sections/surface-system-section";
import { UsageSection } from "@/features/colors/components/sections/usage-section";

export default function ColorsPage() {
  return (
    <article className="container mx-auto max-w-7xl space-y-16 px-4 py-12">
      <HeaderSection />
      <DesignPhilosophy />
      <ColorPaletteConstruction />
      <SurfaceSystem />
      <ExtensionsOverview />
      <ShadcnIntegration />
      <ImplementationDetails />
      <UsageSection />
      <AccessibilitySection />
      <FutureConsiderations />
    </article>
  );
}
