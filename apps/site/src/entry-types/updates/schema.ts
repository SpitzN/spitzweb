import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// An Update is always Published (GLOSSARY.md, Update), so it has no publication state: a row
// exists while the Update does, and deleting the Update deletes the row.
export const updates = pgTable(
  "updates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    text: text("text").notNull(),
    /** An https: URL, or null for an Update without a link. */
    link: text("link"),
    postedAt: timestamp("posted_at", { withTimezone: true }).defaultNow().notNull(),
    /** When the Update was last edited, or null if it never was. */
    editedAt: timestamp("edited_at", { withTimezone: true }),
  },
  (table) => [index("updates_posted_at_idx").on(table.postedAt.desc())],
);
