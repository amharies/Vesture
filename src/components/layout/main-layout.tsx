'use client';

import type { ReactNode } from "react";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <main className="flex-grow p-4 pb-24">
        {children}
      </main>
      <Navigation />
    </div>
  );
}
