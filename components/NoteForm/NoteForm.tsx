"use client";

import styles from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";

interface NoteFormProps {
  onClose?: () => void;
}

const allowedTags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const [form, setForm] = useState({ ...initialDraft, ...draft });

  useEffect(() => {
    setDraft(form);
  }, [form, setDraft]);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      if (onClose) onClose();
      else router.back();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mutation.isPending) return;

    mutation.mutate({
      title: form.title,
      content: form.content,
      tag: form.tag as NoteTag,
    });
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else router.back();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={styles.input}
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={styles.textarea}
          value={form.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={styles.select}
          value={form.tag}
          onChange={handleChange}
        >
          {allowedTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
