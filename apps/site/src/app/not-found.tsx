import type { Metadata } from "next";
import Link from "next/link";
import { StatusMessage } from "@/components/status-message";

// Every unmatched URL and every notFound() lands here, inside the root layout. Without this file
// Next.js renders its built-in 404, whose own <style> overrides the theme (docs/tooling.md, Traps).
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <StatusMessage
      heading="Page not found."
      actions={
        <Link href="/" className="text-link">
          Go to the home page
        </Link>
      }
    >
      Nothing lives at this address. It may have moved, or never existed.
    </StatusMessage>
  );
}
