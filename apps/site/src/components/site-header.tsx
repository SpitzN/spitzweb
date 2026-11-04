import Link from "next/link";

const SECTIONS = [
  { href: "/projects", label: "Projects" },
  { href: "/articles", label: "Articles" },
  { href: "/activity", label: "Activity" },
];

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-baseline gap-x-12 gap-y-3 border-be border-rule pbs-6 pbe-5">
      <Link href="/" className="font-display text-xl font-bold tracking-tight">
        spitzweb
      </Link>
      <nav aria-label="Sections">
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
    </header>
  );
}
