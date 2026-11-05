import { expect, test } from "vitest";
import { updates } from "@/entry-types/updates/schema";
import { findUpdate, latestUpdate, listUpdates } from "@/entry-types/updates/server/updates";
import { createTestDatabase } from "@/lib/test-auth";

async function databaseWithUpdates() {
  const db = await createTestDatabase();
  // Inserted out of order, so the reads must sort them.
  await db.insert(updates).values([
    { text: "Middle", postedAt: new Date("2026-11-04T09:00:00Z") },
    { text: "Newest", postedAt: new Date("2026-11-05T09:00:00Z") },
    { text: "Oldest", postedAt: new Date("2026-11-03T09:00:00Z") },
  ]);
  return db;
}

test("with no Updates posted, there is no latest Update and the list is empty", async () => {
  const db = await createTestDatabase();

  expect(await latestUpdate(db)).toBeUndefined();
  expect(await listUpdates(db)).toStrictEqual([]);
});

test("Updates are listed newest first, and the latest is the newest", async () => {
  const db = await databaseWithUpdates();

  const listed = await listUpdates(db);

  expect(listed.map(({ text }) => text)).toStrictEqual(["Newest", "Middle", "Oldest"]);
  expect(await latestUpdate(db)).toMatchObject({ text: "Newest" });
});

test("an Update is found by its id, and an id that names none finds nothing", async () => {
  const db = await databaseWithUpdates();
  const [newest] = await listUpdates(db);

  expect(await findUpdate(db, newest?.id ?? "")).toMatchObject({ text: "Newest" });
  expect(await findUpdate(db, "00000000-0000-4000-8000-000000000000")).toBeUndefined();
});
