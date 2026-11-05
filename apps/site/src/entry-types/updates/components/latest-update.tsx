import * as Sentry from "@sentry/nextjs";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { EntryDate } from "@/components/entry-date";
import type { updates } from "@/entry-types/updates/schema";
import { loadLatestUpdate } from "@/entry-types/updates/server/updates";

type ShownUpdate = Pick<typeof updates.$inferSelect, "text" | "link" | "postedAt">;

// The line's frame in every state: "Now:" in ink, the rest in muted ink. The loading state is the
// frame alone, one line tall, so a one-line Update arriving moves nothing.
function LatestUpdateFrame({ children }: { children?: ReactNode }) {
  return (
    <p className="pbs-5 text-lg text-ink-muted max-inline-2xl min-block-7">
      <span className="font-semibold text-ink">Now:</span> {children}
    </p>
  );
}

// An Update's link reads as its address without the protocol, which is always https:.
function linkLabel(link: string) {
  const { host, pathname, search } = new URL(link);
  return `${host}${pathname === "/" ? "" : pathname}${search}`;
}

/**
 * The latest Update, after "Now:": its text, its link, and the day it was posted, so a visitor
 * can tell how current "now" is. With no Update, it says there are none yet. The text renders as
 * text, never as HTML.
 */
export function LatestUpdateLine({ update }: { update: ShownUpdate | undefined }) {
  if (!update) return <LatestUpdateFrame>No Updates yet.</LatestUpdateFrame>;

  const { text, link, postedAt } = update;
  return (
    <LatestUpdateFrame>
      <span className="text-ink">{text}</span>
      {link === null ? null : (
        <>
          {" "}
          <a href={link} className="wrap-anywhere text-ink text-link">
            {linkLabel(link)}
          </a>
        </>
      )}
      {" · "}
      <EntryDate date={postedAt.toISOString().slice(0, 10)} />
    </LatestUpdateFrame>
  );
}

/** The latest Update's line when Updates can't be loaded: the page stays up and says so. */
export function UnavailableLatestUpdate() {
  return <LatestUpdateFrame>Updates are unavailable right now.</LatestUpdateFrame>;
}

// The build has no database, so the latest Update is read at request time, from the cache.
async function latestUpdateAtRequest() {
  await connection();
  try {
    return { ok: true as const, value: await loadLatestUpdate() };
  } catch (error) {
    Sentry.captureException(error);
    return { ok: false as const, error };
  }
}

async function StreamedLatestUpdate() {
  const latest = await latestUpdateAtRequest();
  return latest.ok ? <LatestUpdateLine update={latest.value} /> : <UnavailableLatestUpdate />;
}

/**
 * What Nadav is doing now: the latest Update, streamed in after the static shell. When the
 * database fails, only this line degrades; it reports the error and the page still returns 200.
 */
export function LatestUpdate() {
  return (
    <Suspense fallback={<LatestUpdateFrame />}>
      <StreamedLatestUpdate />
    </Suspense>
  );
}
