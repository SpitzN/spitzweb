"use client";

// Temporary: proves a browser error reaches Sentry with readable frames. Removed before merge.
function throwClientError() {
  throw new Error("Sentry check: client error");
}

export default function SentryCheckClientPage() {
  return (
    <main className="pbs-16">
      <button type="button" onClick={throwClientError}>
        Throw a client error
      </button>
    </main>
  );
}
