import type { MDXComponents } from "mdx/types";

// @next/mdx requires this file. Each Entry type styles its own MDX by passing `components` where it
// renders the content, so the site-wide map stays empty.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
