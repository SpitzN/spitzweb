import { LatestUpdate } from "@/entry-types/updates/components/latest-update";

// The home page is designed (apps/site/.impeccable/surfaces) and waits for real Project data.
export default function HomePage() {
  return (
    <main className="py-16">
      <h1 className="font-display text-statement font-extrabold text-balance max-inline-4xl">
        Nadav Spitzer is a full-stack product engineer.
      </h1>
      <LatestUpdate />
    </main>
  );
}
