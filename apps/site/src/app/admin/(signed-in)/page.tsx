import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin panel",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="pbs-16 pbe-24 max-inline-xl">
      <h1 className="font-display text-title font-extrabold">Admin panel</h1>
      <p className="pbs-2 text-ink-muted">
        Updates will be posted from here. Nothing else runs from the Admin panel yet.
      </p>
    </main>
  );
}
