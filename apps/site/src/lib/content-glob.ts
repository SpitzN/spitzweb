// Every MDX file in content/, compiled by @next/mdx and found by the bundler at build time, so no
// page reads the filesystem at request time. The e2e build replaces this module with
// e2e/content-glob.ts (next.config.ts); nothing but mdx-files.ts should import it.
export const CONTENT_FILES = import.meta.glob("/content/**/*.mdx", { eager: true });
