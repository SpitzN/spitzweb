interface StarProps {
  /** Where the star sits in the header, how large and how bright it is, and its turn to come out. */
  className: string;
}

/** A bright star: four points. */
function Sparkle({ className }: StarProps) {
  return (
    <svg viewBox="-5 -5 10 10" className={className}>
      <path
        d="M0 -5Q.6 -.6 5 0Q.6 .6 0 5Q-.6 .6 -5 0Q-.6 -.6 0 -5Z"
        className="fill-ink theme-setting:animate-star-out theme-rising:animate-star-in"
      />
    </svg>
  );
}

/** A faint star: a point. */
function Dot({ className }: StarProps) {
  return (
    <svg viewBox="-5 -5 10 10" className={className}>
      <circle
        r="5"
        className="fill-ink theme-setting:animate-star-out theme-rising:animate-star-in"
      />
    </svg>
  );
}

/**
 * The stars along the site header in the dark theme (DESIGN.md, Navigation). It fills the header,
 * which must be positioned. Every star sits in the header's top or bottom padding, where no line
 * of text reaches at any width. Each is placed as a share of the header's width, so the stars keep
 * their order and their distance from one another as the header narrows. They are listed from the
 * moon outward, which is the order they come out in when night falls (app/theme-change.css). The
 * two nearest in the bottom padding move further out below `sm`, where a share
 * that small would put them under the theme switch.
 */
export function NightSky() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 light:hidden">
      <Sparkle className="absolute inset-e-1/14 inset-bs-1.75 block-2.25 inline-2.25 stagger-0" />
      <Dot className="absolute inset-e-1/4 inset-be-2 opacity-80 block-0.75 inline-0.75 stagger-1 sm:inset-e-1/9" />
      <Dot className="absolute inset-e-3/20 inset-bs-3.75 opacity-60 block-0.75 inline-0.75 stagger-2" />
      <Sparkle className="absolute inset-e-7/10 inset-be-1.25 opacity-90 block-1.75 inline-1.75 stagger-3 sm:inset-e-2/11" />
      <Dot className="absolute inset-e-3/8 inset-bs-4 opacity-50 block-0.75 inline-0.75 stagger-4" />
      <Dot className="absolute inset-e-2/5 inset-be-1.5 opacity-60 block-0.5 inline-0.5 stagger-5" />
      <Dot className="absolute inset-e-11/20 inset-be-1.75 opacity-70 block-0.75 inline-0.75 stagger-6" />
      <Sparkle className="absolute inset-e-2/3 inset-bs-2.5 opacity-75 block-1.5 inline-1.5 stagger-7" />
      <Dot className="absolute inset-e-4/5 inset-bs-1.5 opacity-60 block-0.75 inline-0.75 stagger-8" />
      <Dot className="absolute inset-e-5/6 inset-be-2.25 opacity-50 block-0.5 inline-0.5 stagger-9" />
      <Dot className="absolute inset-e-10/11 inset-be-1.5 opacity-45 block-0.5 inline-0.5 stagger-10" />
    </span>
  );
}
