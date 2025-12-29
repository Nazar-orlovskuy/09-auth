import type { Metadata } from "next";
import styles from "@/app/Home.module.css";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import getQueryClient from "@/lib/getQueryClient";
import NoteDetailsClient from "./NoteDetails.client";
import { cookies } from "next/headers";

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
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
      .join("; ");

    const note = await fetchNoteById(cookieHeader, id);
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

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(cookieHeader, id),
  });

  return (
    <main className={styles.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient key={id} />
      </HydrationBoundary>
    </main>
  );
}
