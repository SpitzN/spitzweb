// src/components/animations/aurora-text-effect.tsx
"use client";

import { useRef, useEffect, useState, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/utils";

interface AnimationConfig {
  outline?: {
    enabled?: boolean;
    duration?: number;
    ease?: string;
    delay?: number;
  };
  hover?: {
    duration?: number;
    ease?: string;
  };
  mask?: {
    duration?: number;
    ease?: string;
  };
}

interface MaskConfig {
  size?: string;
  shape?: "circle" | "square" | "ellipse";
  blur?: string;
  intensity?: number;
}

interface AuroraTextEffectProps {
  text: string;
  className?: string;
  textSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  strokeWidth?: number;
  gradientColors?: string[];
  // New configuration props
  animations?: AnimationConfig;
  mask?: MaskConfig;
}

// Default gradient colors using Aurora palette
const defaultGradientColors = [
  "hsl(var(--aurora-electric-pink))",
  "hsl(var(--aurora-fashion-fuchsia))",
  "hsl(var(--aurora-royal-blue))",
  "hsl(var(--aurora-turquoise))",
  "hsl(var(--aurora-aquamarine))",
];

// Default configurations
const defaultAnimations: AnimationConfig = {
  outline: {
    enabled: true,
    duration: 4,
    ease: "easeInOut",
    delay: 0,
  },
  hover: {
    duration: 0.3,
    ease: "easeOut",
  },
  mask: {
    duration: 0,
    ease: "easeOut",
  },
};

const defaultMask: MaskConfig = {
  size: "20%",
  shape: "circle",
  blur: "0",
  intensity: 1,
};

const textSizeClasses = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
} as const;

export function AuroraTextEffect({
  text,
  className,
  textSize = "4xl",
  strokeWidth = 0.3,
  gradientColors = defaultGradientColors,
  animations = defaultAnimations,
  mask = defaultMask,
}: AuroraTextEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  const uniqueId = useId();
  const gradientId = `auroraTextGradient-${uniqueId}`;
  const maskId = `auroraRevealMask-${uniqueId}`;
  const textMaskId = `auroraTextMask-${uniqueId}`;

  // mask shape based on configuration
  const getMaskShape = () => {
    switch (mask.shape) {
      case "square":
        return (
          <rect
            x="0"
            y="0"
            width={mask.size}
            height={mask.size}
            filter={mask.blur ? `blur(${mask.blur})` : undefined}
          />
        );
      case "ellipse":
        return (
          <ellipse
            rx={mask.size}
            ry={`${parseInt(mask.size!) / 2}%`}
            filter={mask.blur ? `blur(${mask.blur})` : undefined}
          />
        );
      case "circle":
      default:
        return <circle r={mask.size} filter={mask.blur ? `blur(${mask.blur})` : undefined} />;
    }
  };

  useEffect(() => {
    if (!svgRef.current || cursor.x === null || cursor.y === null) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
    const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;

    setMaskPosition({
      cx: `${cxPercentage}%`,
      cy: `${cyPercentage}%`,
    });
  }, [cursor]);

  const renderGradientStops = () => {
    return gradientColors.map((color, index) => (
      <stop
        key={index}
        offset={`${(index / (gradientColors.length - 1)) * 100}%`}
        stopColor={color}
      />
    ));
  };

  const textClassNames = cn("font-bold fill-transparent", textSizeClasses[textSize], className);

  // [isolation:isolate] is used to prevent the gradient from overflowing the text
  return (
    <div className="relative h-full min-h-[100px] w-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 400 100" // Adjusted viewBox for larger text
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
        className="select-none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {renderGradientStops()}
          </linearGradient>

          <motion.radialGradient
            id={maskId}
            cx={maskPosition.cx}
            cy={maskPosition.cy}
            animate={maskPosition}
            transition={{
              duration: animations.mask?.duration,
              ease: animations.mask?.ease,
            }}
          >
            <stop offset="0%" stopColor="white" stopOpacity={mask.intensity} />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>

          <mask id={textMaskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <motion.g
              style={{
                translateX: maskPosition.cx,
                translateY: maskPosition.cy,
              }}
              fill={`url(#${maskId})`}
            >
              {getMaskShape()}
            </motion.g>
          </mask>
        </defs>

        {/* Background stroke text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth={strokeWidth}
          className={cn(
            textClassNames,
            "stroke-aurora-luminance-french-gray dark:stroke-aurora-depth-penn-blue"
          )}
          style={{
            opacity: hovered ? 0.7 : 0,
            transition: `opacity ${animations.hover?.duration}s ${animations.hover?.ease}`,
          }}
        >
          {text}
        </text>

        {/* Animated outline text */}
        {animations.outline?.enabled && (
          <motion.text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth={strokeWidth}
            className={cn(
              textClassNames,
              "stroke-aurora-luminance-french-gray dark:stroke-aurora-depth-penn-blue"
            )}
            initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
            animate={{
              strokeDashoffset: 0,
              strokeDasharray: 1000,
            }}
            transition={{
              duration: animations.outline.duration,
              ease: animations.outline.ease,
              delay: animations.outline.delay,
            }}
          >
            {text}
          </motion.text>
        )}

        {/* Gradient masked text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth={strokeWidth}
          className={textClassNames}
          style={{
            stroke: `url(#${gradientId})`,
            opacity: hovered ? 1 : 0,
            transition: `opacity ${animations.hover?.duration}s ${animations.hover?.ease}`,
            mask: `url(#${textMaskId})`,
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

export default AuroraTextEffect;
