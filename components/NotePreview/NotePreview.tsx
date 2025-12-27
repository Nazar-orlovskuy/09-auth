"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { useRouter } from "next/navigation";
import css from "@/components/NotePreview/NotePreview.module.css";
import Modal from "@/components/Modal/Modal";

type Props = {
  noteId: string;
};

function NotePreviewContent({ noteId, onClose }:Props&{onClose:()=>void}) {
const { data, isLoading, isError } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  if (isLoading) {
    return <p>Loading note...</p>;
  }

  if (isError || !data) {
    return <p>Failed to load note.</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <button
          className={css.backBtn}
          onClick={() => onClose()}
        >
          ← Back
        </button>

        <div className={css.header}>
          <h2>{data.title}</h2>
          {data.tag && <span className={css.tag}>{data.tag}</span>}
        </div>

        <p className={css.content}>{data.content}</p>

        <p className={css.date}>
          {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 

export default function NotePreview({ noteId }: Props) {
  const router = useRouter();
 
  const handleClose = () =>{router.back()}
    return <Modal onClose={handleClose}>
      <NotePreviewContent noteId={noteId} onClose={handleClose}/>
        </Modal>
 
}
