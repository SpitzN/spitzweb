import { AdminShell } from "@/admin/components/admin-shell";

export default function SignedInLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
