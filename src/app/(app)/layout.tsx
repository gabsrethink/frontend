"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Navbar } from "@/src/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-950 text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-6 p-4 md:p-8 bg-blue-950 text-white">
      <Navbar />
      <main className="flex-1 md:ml-30">{children}</main>
    </div>
  );
}
