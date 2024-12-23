// src/app/page.tsx
import { Hero } from "@/features/home/hero";
import { AuroraBackground } from "@/components/theme/aurora-background";

export default function Home() {
  return (
    <AuroraBackground>
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Hero />
      </div>
    </AuroraBackground>
  );
}
