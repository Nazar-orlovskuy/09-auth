"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/(private routes)/profile/edit/EditProfilePage.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getMe as apiGetMe,
  updateMe as apiUpdateMe,
} from "../../../../lib/api/clientApi";
import { useAuthStore } from "../../../../lib/store/authStore";
import type { User } from "../../../../types/user";

export default function EditProfilePage() {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [username, setUsername] = useState<string>(authUser?.username || "");
  const [email, setEmail] = useState<string>(authUser?.email || "");
  const [avatar, setAvatar] = useState<string | null>(authUser?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      if (!authUser) {
        try {
          const me = await apiGetMe();
          if (!mounted) return;
          setUser(me as User);

          console.log(2);

          setUsername(me.username);
          setEmail(me.email);
          setAvatar(me.avatar || null);
        } catch {}
      }
    }
    fetchUser();
    return () => {
      mounted = false;
    };
  }, [authUser, setUser]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updated = await apiUpdateMe({ username });
      setUser(updated as User);
      router.push("/profile");
    } catch (err) {
      setError((err as Error)?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    router.push("/profile");
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.profileCard}>
        <h1 className={styles.formTitle}>Edit Profile</h1>

        <div>
          <Image
            src={avatar || "/next.svg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={styles.avatar}
          />
        </div>

        <form className={styles.profileInfo} onSubmit={handleSave}>
          <div className={styles.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              Save
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
