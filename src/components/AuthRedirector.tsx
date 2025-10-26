"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function AuthRedirector({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }
    const isProtectedRoute =
      pathname.startsWith("/favorites") || pathname === "/";

    const isAuthRoute = pathname.startsWith("/login");

    if (!user && isProtectedRoute) {
      router.replace("/login");
    } else if (user && isAuthRoute) {
      router.replace("/");
    }
  }, [user, loading, router, pathname]);

  if (loading && !pathname.startsWith("/share")) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-blue-950">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }
  return <>{children}</>;
}
