import { api } from "./api";
import type { User } from "../../types/user";
import type { Note, NoteTag } from "../../types/note";

/* Notes mapping */

type ServerNote = {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt?: string;
};

function toNote(sn: ServerNote): Note {
  return {
    id: sn.id,
    title: sn.title,
    content: sn.content,
    tag: sn.tag as NoteTag,
    createdAt: sn.createdAt,
    updatedAt: sn.updatedAt ?? sn.createdAt,
  };
}

/* Notes API */

export async function fetchNotes(params?: {
  search?: string;
  page?: number;
  tag?: string;
  perPage?: number;
}) {
  const filteredParams: Record<string, unknown> = {};

  if (params?.page) filteredParams.page = params.page;
  if (params?.perPage) filteredParams.limit = params.perPage;
  if (params?.search) filteredParams.search = params.search;
  if (params?.tag && params.tag !== "all") {
    filteredParams.tag = params.tag;
  }

  const res = await api.get<
    {
  totalPages: number;
  notes: ServerNote[];
}
>("/notes", {
    params: filteredParams,
  });
  return {
    notes: res.data.notes.map(toNote)
  , totalPages: res.data.totalPages };
}

export async function fetchNoteById(id: string) {
  const res = await api.get<ServerNote>(`/notes/${id}`);
  return toNote(res.data);
}

export async function createNote(payload: {
  title: string;
  content: string;
  tag: string;
}) {
  const res = await api.post<ServerNote>("/notes", payload);
  return toNote(res.data);
}

export async function deleteNote(id: string) {
  const res = await api.delete<ServerNote>(`/notes/${id}`);
  return toNote(res.data);
}

/* Auth API */

export async function register(payload: {
  email: string;
  password: string;
}) {
  const res = await api.post<User>("/auth/register", payload);
  return res.data;
}

export async function login(payload: {
  email: string;
  password: string;
}) {
  const res = await api.post<User>("/auth/login", payload);
  return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}

export async function checkSession() {
  const res = await api.get<{success:boolean} | null>("/auth/session");
  console.log(res);
  return res.data?.success;
}

/* User API */

export async function getMe() {
  const res = await api.get<User>("/users/me");
  return res.data;
}

/* DTO with allowed update fields only */
type UpdateMePayload = {
  username: string;
};

export async function updateMe(payload: UpdateMePayload) {
  const res = await api.patch<User>("/users/me", payload);
  return res.data;
}
