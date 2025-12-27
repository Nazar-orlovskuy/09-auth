import styles from "./NoteList.module.css";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import type { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <div>
            <h2 className={styles.title}>{note.title}</h2>
            <p className={styles.content}>{note.content}</p>
          </div>

          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag}</span>

            <div>
              <Link href={`/notes/${note.id}`} className={styles.link}>
                View details
              </Link>

              <button
                className={styles.button}
                onClick={() => mutation.mutate(note.id)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
