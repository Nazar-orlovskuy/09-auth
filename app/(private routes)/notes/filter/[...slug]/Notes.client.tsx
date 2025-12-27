"use client";

import styles from "@/app/(private routes)/notes/page.module.css";
import { useState, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import { useDebounce } from "use-debounce";
import Link from "next/link";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import type { FetchNotesResponse } from "@/types/noteApi";

const PER_PAGE = 12;

type NotesClientProps = {
  tag?: string;
};

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 500);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const notesQuery = useQuery({
    queryKey: ["notes", page, debounced, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debounced,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const data = notesQuery.data as FetchNotesResponse | undefined;
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={styles.app}>
      <div className={styles.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={totalPages}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={styles.button}>
          Create note +
        </Link>
      </div>

      <main>
        {notesQuery.isLoading && <p>Loading notes...</p>}
        {notesQuery.isError && <p>Error loading notes.</p>}
        {!notesQuery.isLoading && notes.length === 0 && <p>No notes found.</p>}
        {notes.length > 0 && <NoteList notes={notes} />}
      </main>
    </div>
  );
}
