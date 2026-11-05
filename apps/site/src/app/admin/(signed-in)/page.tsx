import type { Metadata } from "next";
import { PostUpdateForm, UpdateAdminList } from "@/entry-types/updates/components/update-admin";

export const metadata: Metadata = {
  title: "Admin panel",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="pbs-16 pbe-24 max-inline-xl">
      <h1 className="font-display text-title font-extrabold">Admin panel</h1>
      <section aria-labelledby="post-update" className="pbs-8">
        <h2 id="post-update" className="sr-only">
          Post an Update
        </h2>
        <PostUpdateForm />
      </section>
      <section aria-labelledby="updates" className="pbs-12">
        <h2 id="updates" className="pbe-4 font-display text-xl font-bold">
          Updates
        </h2>
        <UpdateAdminList />
      </section>
    </main>
  );
}
