"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

type Props = {
  noteId: string;
};

export default function NotePreviewClient({ noteId }: Props) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {/* Кнопка закриття */}
      <button
        onClick={() => router.back()}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          fontSize: 18,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Close modal"
      >
        ×
      </button>

      {isLoading && <p>Loading note...</p>}
      {isError && <p>Error loading note.</p>}

      {note && (
        <div>
          <h2>{note.title}</h2>

          <p>{note.content}</p>

          <p>
            <strong>Tag:</strong> {note.tag}
          </p>

          <p>
            <strong>Created:</strong>{" "}
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </Modal>
  );
}
