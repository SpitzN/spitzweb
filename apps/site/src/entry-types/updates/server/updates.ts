import "server-only";
import { desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { updates } from "@/entry-types/updates/schema";
import type { Database } from "@/lib/db";
import { getDatabase } from "@/lib/db";

/** Every Update, newest first. */
export function listUpdates(db: Database) {
  return db.select().from(updates).orderBy(desc(updates.postedAt));
}

/** The most recently posted Update, or undefined when none has been posted. */
export async function latestUpdate(db: Database) {
  const [latest] = await db.select().from(updates).orderBy(desc(updates.postedAt)).limit(1);
  return latest;
}

/** The Update with this id, or undefined when there is none. The caller parses the id as a UUID. */
export async function findUpdate(db: Database, id: string) {
  const [found] = await db.select().from(updates).where(eq(updates.id, id));
  return found;
}

/** The cache tag on every cached read of Updates; each change to an Update calls `updateTag` on it. */
export const UPDATES_CACHE_TAG = "updates";

/**
 * The latest Update, for public pages, from a cache shared by every server instance and kept until
 * an Update is posted, edited or deleted. Throws when the database fails, so a failure is never
 * cached. Call it at request time: the build has no database.
 */
export async function loadLatestUpdate() {
  "use cache: remote";
  cacheLife("max");
  cacheTag(UPDATES_CACHE_TAG);
  return latestUpdate(getDatabase());
}
