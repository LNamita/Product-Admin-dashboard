"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/authService";
import { clearSession, getStoredUser } from "@/lib/token";
import { clearLocalChanges } from "@/lib/localChanges";

export default function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Show the saved name right away, then confirm the token with /auth/me.
    // If the token has expired, the Axios interceptor logs the user out.
    setUser(getStoredUser());
    getCurrentUser()
      .then(setUser)
      .catch(() => {});
  }, []);

  function logout() {
    clearSession();
    clearLocalChanges();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/products" className="font-semibold text-indigo-600">
          Product Admin
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">
              {user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="h-7 w-7 rounded-full bg-slate-100" />
              )}
              {user.firstName} {user.lastName}
            </span>
          )}
          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
