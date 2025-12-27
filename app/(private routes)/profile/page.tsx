import type { Metadata } from "next";
import styles from "./ProfilePage.module.css";
import Image from "next/image";
import { cookies } from "next/headers";
import { getMe as serverGetMe } from "../../../lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile - NoteHub",
  description: "User profile page",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");
  let user = null;
  try {
    user = await serverGetMe(cookieHeader);
  } catch {}

  return (
    <main className={styles.mainContent}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h1 className={styles.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={styles.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={styles.avatarWrapper}>
          <Image
            src={user?.avatar || "/next.svg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={styles.avatar}
          />
        </div>

        <div className={styles.profileInfo}>
          <p>Username: {user?.username || "your_username"}</p>
          <p>Email: {user?.email || "your_email@example.com"}</p>
        </div>
      </div>
    </main>
  );
}
