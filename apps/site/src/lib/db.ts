import "server-only";
import { neon } from "@neondatabase/serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/neon-http";
import { readServerEnv } from "@/lib/env";

/**
 * A Postgres database: Neon in the app, PGlite in tests. Every data-access function takes one as
 * its first parameter (.claude/rules/server.md, Data).
 */
export type Database = PgDatabase<PgQueryResultHKT>;

/**
 * The app's database. Neon's HTTP driver sends each query as one request, so there is no pool to
 * keep alive between serverless invocations and creating one per call costs nothing. It has no
 * interactive transactions; Better Auth's Postgres adapter doesn't use them.
 */
export function getDatabase() {
  return drizzle({ client: neon(readServerEnv().DATABASE_URL) });
}
