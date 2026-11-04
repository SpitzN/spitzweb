// Stands in for src/lib/content-glob.ts in the e2e build (next.config.ts), so the suite runs
// against fixture Entries in every publication state instead of Nadav's real content.
export const CONTENT_FILES = import.meta.glob("/e2e/content/**/*.mdx", { eager: true });
