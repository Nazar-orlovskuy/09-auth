import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api/clientApi";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{
    slug?: string[];
  }>;
};

const PER_PAGE = 12;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  const tagTitle = tag === "all" ? "All notes" : `Notes tagged "${tag}"`;

  return {
    title: `NoteHub — ${tagTitle}`,
    description: `Browse ${tagTitle.toLowerCase()} on NoteHub.`,
    openGraph: {
      title: `NoteHub — ${tagTitle}`,
      description: `Browse ${tagTitle.toLowerCase()} on NoteHub.`,
      url: `https://notehub.app/notes/filter/${tag}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag} tag={tag} />
    </HydrationBoundary>
  );
}
