import type { Metadata } from "next";
import { z } from "zod";
import { EditUpdate } from "@/entry-types/updates/components/update-admin";

export const metadata: Metadata = {
  title: "Edit Update",
  robots: { index: false, follow: false },
};

// An id that isn't a UUID names no Update; the slice turns undefined into a 404.
async function updateIdFrom(params: PageProps<"/admin/updates/[id]">["params"]) {
  const { id } = await params;
  return z.uuid().safeParse(id).data;
}

export default function EditUpdatePage({ params }: PageProps<"/admin/updates/[id]">) {
  return (
    <main className="pbs-16 pbe-24 max-inline-xl">
      <h1 className="font-display text-title font-extrabold">Edit Update</h1>
      <EditUpdate id={updateIdFrom(params)} />
    </main>
  );
}
