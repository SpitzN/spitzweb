import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";

// Only sections whose route exists: a section's link is added in the ticket that builds it, and
// the e2e link check fails on a link to a 404.
const SECTIONS = [
  { href: "/projects", label: "Projects" },
  { href: "/articles", label: "Articles" },
];

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-baseline gap-x-12 gap-y-3 border-be border-rule pbs-6 pbe-5">
      <Link href="/" className="font-display text-xl font-bold tracking-tight">
        spitzweb
      </Link>
      {/* The nav takes the row's spare space, so the theme switch sits at its end. */}
      <nav aria-label="Sections" className="me-auto">
        <ul className="flex gap-6">
          {SECTIONS.map((section) => (
            <li key={section.href}>
              <Link href={section.href} className="text-ink-muted transition-colors hover:text-ink">
                {section.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ThemeSwitch />
    </header>
  );
}
