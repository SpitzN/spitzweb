import { z } from "zod";

/**
 * The curated Topic set, shared by every Entry type (GLOSSARY.md, Topic). Nadav changes it by
 * commit. Frontmatter names a Topic by its id; visitors read its label.
 */
export const topicSchema = z.enum([
  "ai-agents",
  "frontend",
  "developer-tools",
  "product-minded-engineering",
]);

export type Topic = z.infer<typeof topicSchema>;

export const TOPIC_LABELS = {
  "ai-agents": "AI agents",
  frontend: "Frontend",
  "developer-tools": "Developer tools",
  "product-minded-engineering": "Product-minded engineering",
} satisfies Record<Topic, string>;
