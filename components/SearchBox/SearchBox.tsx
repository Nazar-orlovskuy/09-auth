import styles from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
  type="text"
  placeholder="Search notes"
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className={styles.input} />
  );
}
