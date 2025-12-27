"use client";

import styles from "./AuthNavigation.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { logout as apiLogout } from "../../lib/api/clientApi";

export default function AuthNavigation() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  async function handleLogout() {
    try {
      await apiLogout();
    } catch {
      // ignore
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  }

  if (isAuthenticated) {
    return (
      <>
        <li className={styles.navigationItem}>
          <Link
            href="/profile"
            prefetch={false}
            className={styles.navigationLink}
          >
            Profile
          </Link>
        </li>

        <li className={styles.navigationItem}>
          <p className={styles.userEmail}>{user?.email}</p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={styles.navigationItem}>
        <Link
          href="/sign-in"
          prefetch={false}
          className={styles.navigationLink}
        >
          Login
        </Link>
      </li>

      <li className={styles.navigationItem}>
        <Link
          href="/sign-up"
          prefetch={false}
          className={styles.navigationLink}
        >
          Sign up
        </Link>
      </li>
    </>
  );
}
