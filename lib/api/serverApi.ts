import { AxiosRequestConfig, AxiosResponse } from "axios";
import { api } from "./api";
import type { User } from "../../types/user";
import type { Note, NoteTag } from "../../types/note";

/* Types */

type ServerNote = {
  _id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt?: string;
};

/* Mappers */

function toNote(sn: ServerNote): Note {
  return {
    id: sn._id,
    title: sn.title,
    content: sn.content,
    tag: sn.tag as NoteTag,
    createdAt: sn.createdAt,
    updatedAt: sn.updatedAt ?? sn.createdAt,
  };
}

/* Helpers */

function buildConfig(
  cookies?: string,
  params?: Record<string, unknown>
): AxiosRequestConfig {
  return {
    params,
    headers: cookies ? { Cookie: cookies } : undefined,
  };
}

/* Notes API (SERVER) */

export async function fetchNotes(
  cookies: string | undefined,
  params?: {
    search?: string;
    page?: number;
    tag?: string;
    limit?: number;
  }
): Promise<Note[]> {
  const res = await api.get<ServerNote[]>(
    "/notes",
    buildConfig(cookies, params)
  );

  return res.data.map(toNote);
}

export async function fetchNoteById(
  cookies: string | undefined,
  id: string
): Promise<Note> {
  const res = await api.get<ServerNote>(
    `/notes/${id}`,
    buildConfig(cookies)
  );

  return toNote(res.data);
}

/* Auth API */

export async function checkSession(
  cookies?: string
): Promise<AxiosResponse<User | null>> {
  return api.get<User | null>(
    "/auth/session",
    buildConfig(cookies)
  );
}

export async function getMe(cookies?: string): Promise<User> {
  const res = await api.get<User>(
    "/users/me",
    buildConfig(cookies)
  );

  return res.data;
}
