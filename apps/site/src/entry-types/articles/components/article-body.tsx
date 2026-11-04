import type { MDXComponents, MDXContent } from "mdx/types";
import { Funnel_Sans } from "next/font/google";

// Emphasis in an Article uses Funnel Sans's true italic rather than a synthesized slant. It is
// declared here, so only pages that render an Article's body load it.
const funnelSansItalic = Funnel_Sans({ subsets: ["latin"], style: "italic", display: "swap" });

// The Read register's prose (DESIGN.md): a calm column of Funnel Sans at a real measure, headings
// in Funnel Display with more space above than below, code on the lifted ground. Anchored
// headings stop clear of the top edge when a contents link scrolls to them.
const PROSE: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      className="scroll-mbs-6 pbs-10 pbe-3 font-display text-3xl/tight font-bold tracking-tight text-balance"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="scroll-mbs-6 pbs-6 pbe-2 font-display text-xl/snug font-bold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  p: (props) => <p className="pbe-6 text-pretty" {...props} />,
  ul: (props) => <ul className="list-disc ps-6 pbe-6 marker:text-ink-muted" {...props} />,
  ol: (props) => <ol className="list-decimal ps-6 pbe-6 marker:text-ink-muted" {...props} />,
  li: (props) => <li className="ps-1 pbe-2 text-pretty" {...props} />,
  a: ({ children, ...props }) => (
    <a
      className="underline decoration-ink-muted underline-offset-4 transition-colors hover:decoration-ink"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: (props) => (
    <blockquote className="mbe-6 border-s border-rule ps-6 text-ink-muted [&>p]:pbe-0" {...props} />
  ),
  code: (props) => <code className="bg-ground-raised px-0.5 font-mono text-base" {...props} />,
  // A code block scrolls sideways instead of wrapping, so it is a labelled region that takes focus
  // for keyboard scrolling.
  pre: (props) => (
    <pre
      role="region"
      aria-label="Code sample"
      tabIndex={0}
      className="mbe-6 overflow-x-auto bg-ground-raised p-5 text-sm/6 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="mbs-4 mbe-10 border-rule" />,
  strong: (props) => <strong className="font-bold" {...props} />,
  em: (props) => <em className={funnelSansItalic.className} {...props} />,
};

/** An Article's MDX, set as Read-register prose. */
export function ArticleBody({ Content }: { Content: MDXContent }) {
  return (
    // About 68 characters to the line at 18px. Prose takes proportional figures; tabular ones stay
    // with the ledger and lists.
    <div className="text-lg/7 proportional-nums max-inline-xl">
      <Content components={PROSE} />
    </div>
  );
}
