// src/app/page.tsx
import { HeroSection } from "@/features/home/components/hero";
import { AuroraBackground } from "@/components/animations/aurora-background";
import { AuroraTextEffect } from "@/components/animations/aurora-text-effect";

export default function Home() {
  return (
    <AuroraBackground>
      {/* <section className="flex min-h-screen items-center justify-center">
        <AuroraTextEffect text="Nadav Spitzer" strokeWidth={0.5} textSize={"6xl"} />
      </section> */}

      <section className="relative flex min-h-screen items-center justify-center pt-24">
        <div className="h-[60vh] w-[90vw]">
          <AuroraTextEffect
            text="Nadav Spitzer"
            strokeWidth={0.5}
            textSize="5xl"
            className="h-full w-full"
          />
        </div>
      </section>

      {/* Second section - Contained Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <HeroSection />
      </section>

      {/* <div className="container mx-auto max-w-7xl px-4 py-12">
        <section className="flex min-h-screen items-center justify-center overflow-auto py-8 sm:py-12">
          <AuroraTextEffect text="Nadav Spitzer" strokeWidth={0.5} textSize={"6xl"} />
        </section>
        <section>
          <HeroSection />
        </section>
      </div> */}
    </AuroraBackground>
  );
}
