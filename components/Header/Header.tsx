import styles from "./Header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" aria-label="Home" className={styles.headerLink}>
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={styles.navigation}>
          <li className={styles.navigationItem}>
            <Link href="/" className={styles.navigationLink}>
              Home
            </Link>
          </li>

          <li className={styles.navigationItem}>
            <Link href="/notes/filter/all" className={styles.navigationLink}>
              Notes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
