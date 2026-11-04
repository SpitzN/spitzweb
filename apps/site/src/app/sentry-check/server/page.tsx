import { connection } from "next/server";
import { Suspense } from "react";

// Temporary: proves a server render error reaches Sentry. Removed before merge.
async function ServerError() {
  await connection();
  if (Date.now() > 0) throw new Error("Sentry check: server render error");
  return null;
}

export default function SentryCheckServerPage() {
  return (
    <Suspense>
      <ServerError />
    </Suspense>
  );
}
