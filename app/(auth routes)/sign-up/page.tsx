"use client";

import React, { useState } from "react";
import styles from "@/app/(auth routes)/sign-up/SingUpPage.module.css";
import { useRouter } from "next/navigation";
import { register as apiRegister } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import type { User } from "../../../types/user";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const user = await apiRegister({ email, password });
      setUser(user as User);
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed");
    }
  }

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.formTitle}>Sign up</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </div>

        <p className={styles.error}>{error}</p>
      </form>
    </main>
  );
}
