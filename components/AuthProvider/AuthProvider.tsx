"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession as apiCheckSession } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";
import { getMe } from "@/lib/api/serverApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [checking, setChecking] = useState(true);

  const isPrivate = Boolean(
    pathname &&
      (pathname.startsWith("/profile") || pathname.startsWith("/notes"))
  );

  useEffect(() => {
    let mounted = true;
    async function verify() {
      setChecking(true);
      try {
        const isAuthenticated = await apiCheckSession();
        if (isAuthenticated) {
          const user = await getMe();
          setUser(user);
          console.log(1);
        } else {
          clearIsAuthenticated();
          if (isPrivate) {
            router.replace("/sign-in");
          }
        }
      } catch {
        clearIsAuthenticated();
        if (isPrivate) router.replace("/sign-in");
      } finally {
        if (mounted) setChecking(false);
      }
    }

    verify();

    return () => {
      mounted = false;
    };
  }, [pathname, clearIsAuthenticated, isPrivate, router, setUser]);

  if (checking) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (isPrivate && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
