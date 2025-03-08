import { ReactNode } from "react";
import { Footer } from "./footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
