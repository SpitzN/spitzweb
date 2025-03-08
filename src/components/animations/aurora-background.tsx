// src/components/animations/aurora-background.tsx
import { cn } from "@/lib/utils/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

// I found 2 cool ways to handle the AuroraBackground component:
// 1. Use the AuroraBackground component in the MainLayout component
// 2. Use the AuroraBackground component in the RootLayout component

// also i found 2 potential css classes that can be used in the AuroraBackground component:
// 1. absolute inset-0 overflow-hidden - Scrolls with the page content - the element moves up and out of view as you scroll down.
// 2. fixed inset-0 overflow-hidden - positioning stays in place while scrolling.

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div className="min-h-screen">
      <div
        className={cn(
          // "transition-bg relative flex min-h-screen flex-col items-center justify-center bg-aurora-base text-aurora-primary",
          "transition-bg relative min-h-screen w-full bg-aurora-base text-aurora-primary",
          className
        )}
        {...props}
      >
        {/* <div className="absolute inset-0 overflow-hidden"> */}
        <div className="fixed inset-0 overflow-hidden">
          <div
            className={cn(
              "aurora-effect after:animate-aurora pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert filter will-change-transform",
              'after:absolute after:inset-0 after:mix-blend-difference after:content-[""]',
              "after:[background-attachment:fixed]",
              "dark:invert-0",
              showRadialGradient &&
                "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
            )}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
