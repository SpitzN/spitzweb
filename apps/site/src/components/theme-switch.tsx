"use client";

import { useLayoutEffect } from "react";
import { applyTheme, storedTheme } from "@/lib/theme";
import { switchTheme } from "@/lib/theme-change";

// The stars beside the moon: where each is placed in the picture, and its outline.
const MOON_STARS = [
  {
    place: "translate(8 11)",
    outline: "M0 -3.5Q.4 -.4 3.5 0Q.4 .4 0 3.5Q-.4 .4 -3.5 0Q-.4 -.4 0 -3.5Z",
  },
  { place: "translate(41.5 7.5)", outline: "M-1.1 0A1.1 1.1 0 1 0 1.1 0A1.1 1.1 0 1 0 -1.1 0Z" },
  { place: "translate(7.5 31)", outline: "M-.9 0A.9 .9 0 1 0 .9 0A.9 .9 0 1 0 -.9 0Z" },
];

/** What the switch does, one wording per theme. It follows <html>, as the picture does. */
function SwitchName() {
  return (
    <>
      <span className="light:hidden">Switch to the light theme</span>
      <span className="hidden light:inline">Switch to the dark theme</span>
    </>
  );
}

/**
 * The header's theme switch, the site's one picture (DESIGN.md, Navigation). The header's
 * hairline is the horizon. In the light theme a lime sun stands half-risen on it; in the dark
 * theme the same disc is a crescent moon above it, with stars. The picture and the button's name
 * follow <html> through the `light:` variant, so both are right from the first paint, before this
 * component's script runs. Choosing a theme plays the change (lib/theme-change.ts), and each part
 * of the picture takes its motion from the change's phase (app/theme-change.css).
 */
export function ThemeSwitch() {
  // In development, Strict Mode's remount resets <html> to the attributes React renders and drops
  // the one the inline script set. In production the theme is already applied and this changes
  // nothing.
  useLayoutEffect(() => {
    applyTheme(storedTheme());
  }, []);

  return (
    // The header's last item reaches down through the header's bottom padding (`pbe-5`), so the
    // picture stands on the hairline. It shows the switch's name, then the picture; the button
    // comes first in the markup, so the name can follow the button's hover and focus.
    <span className="ms-auto -mbe-5 flex flex-row-reverse self-end">
      <button
        type="button"
        onClick={({ currentTarget: button }) => {
          // The header is the change's scene: its stars set and rise too, and the new theme
          // spreads from its hairline.
          const header = button.closest("header");
          if (!header) throw new Error("The theme switch must be inside the site header.");
          void switchTheme(header);
        }}
        className="group peer block cursor-pointer block-11 inline-12"
      >
        <span className="sr-only">
          <SwitchName />
        </span>
        {/* The picture's bottom edge is the hairline, and it hides whatever is below it. */}
        <svg
          viewBox="0 0 48 44"
          aria-hidden
          className="block overflow-hidden block-full inline-full"
        >
          {/* The sun. Each part is drawn around the sun's centre, which is on the hairline. */}
          <g transform="translate(24 44)" className="hidden light:block">
            <g
              strokeWidth="1.5"
              strokeLinecap="round"
              className="stroke-ink transition-transform group-hover:scale-116 group-focus-visible:scale-116 theme-setting:animate-rays-draw-in"
            >
              <line
                x1="0"
                y1="-14.5"
                x2="0"
                y2="-19.5"
                className="stagger-0 theme-rising:animate-ray-out"
              />
              <line
                x1="8.32"
                y1="-11.88"
                x2="11.19"
                y2="-15.97"
                className="stagger-1 theme-rising:animate-ray-out"
              />
              <line
                x1="-8.32"
                y1="-11.88"
                x2="-11.19"
                y2="-15.97"
                className="stagger-1 theme-rising:animate-ray-out"
              />
              <line
                x1="13.63"
                y1="-4.96"
                x2="18.32"
                y2="-6.67"
                className="stagger-2 theme-rising:animate-ray-out"
              />
              <line
                x1="-13.63"
                y1="-4.96"
                x2="-18.32"
                y2="-6.67"
                className="stagger-2 theme-rising:animate-ray-out"
              />
            </g>
            <circle
              r="10"
              strokeWidth="1.5"
              className="fill-accent stroke-ink theme-setting:animate-sun-set theme-rising:animate-sun-rise"
            />
          </g>
          {/* The moon: the same disc with a bite out of it, drawn around its own centre. */}
          <g transform="translate(24 19)" className="light:hidden">
            <path
              d="M-1.94 -9.81A10 10 0 1 0 9.48 3.17A8.8 8.8 0 0 1 -1.94 -9.81Z"
              className="fill-accent transition-transform group-hover:-rotate-16 group-focus-visible:-rotate-16 theme-setting:animate-moon-set theme-rising:animate-moon-rise"
            />
          </g>
          {MOON_STARS.map((star) => (
            <g key={star.place} transform={star.place} className="light:hidden">
              <path
                d={star.outline}
                className="star transition-transform group-hover:scale-135 group-focus-visible:scale-135"
              />
            </g>
          ))}
        </svg>
      </button>
      {/*
       * The name as a sighted visitor gets it: beside the picture, on hover and on keyboard focus.
       * The pointer can rest on it (WCAG 2.2, 1.4.13). It keeps its room in the header's row when
       * it isn't shown, so it never lies over a nav link, and it stays out while a change plays.
       */}
      <span
        aria-hidden
        className="pointer-events-none pe-3 whitespace-nowrap text-ink-muted opacity-0 transition-opacity theme-idle:peer-hover:pointer-events-auto theme-idle:peer-hover:opacity-100 theme-idle:peer-focus-visible:pointer-events-auto theme-idle:peer-focus-visible:opacity-100 theme-idle:hover:pointer-events-auto theme-idle:hover:opacity-100"
      >
        <SwitchName />
      </span>
    </span>
  );
}
