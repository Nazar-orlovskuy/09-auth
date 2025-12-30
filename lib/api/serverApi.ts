import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from './api';
import { User } from '../../types/user';
import { Note, NoteTag } from '../../types/note';

type ServerNote = {
  _id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt?: string;
};

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

function buildConfig(
  cookies?: string,
  params?: Record<string, unknown>
): AxiosRequestConfig {
  return {
    params,
    headers: cookies ? { Cookie: cookies } : undefined,
  };
}

export async function fetchNotes(
  cookies?: string,
  params?: { search?: string; page?: number; tag?: string }
): Promise<Note[]> {
  const res = await api.get<ServerNote[]>('/notes', buildConfig(cookies, params));
  return res.data.map(toNote);
}

export async function fetchNoteById(
  cookies: string | undefined,
  id: string
): Promise<Note> {
  const res = await api.get<ServerNote>(`/notes/${id}`, buildConfig(cookies));
  return toNote(res.data);
}

export async function getMe(cookies?: string): Promise<User> {
  const res = await api.get<User>('/users/me', buildConfig(cookies));
  return res.data;
}

export async function checkSession(
  cookies?: string
): Promise<AxiosResponse<User | null>> {
  return api.get<User | null>('/auth/session', buildConfig(cookies));
}
