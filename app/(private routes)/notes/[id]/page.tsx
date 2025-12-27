import type { Metadata } from "next";
import styles from "@/app/Home.module.css";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNotes, fetchNoteById } from "@/lib/api";
import getQueryClient from "@/lib/getQueryClient";
import NotesClient from "@/app/(private routes)/notes/filter/[...slug]/Notes.client";

type MetadataProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { id } = params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} — NoteHub`;
    const description = note.content
      ? note.content.slice(0, 160)
      : "View note details on NoteHub";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://notehub.app/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  } catch {
    return {
      title: "NoteHub — Note",
      description: "Note details",
      openGraph: {
        title: "NoteHub — Note",
        description: "Note details",
        url: `https://notehub.app/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }
}

export default async function NotesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: "", tag: "" }),
  });

  return (
    <main className={styles.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient />
      </HydrationBoundary>
    </main>
  );
}
