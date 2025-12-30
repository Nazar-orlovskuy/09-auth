import { api } from './api';
import type { User } from '../../types/user';
import type { Note, NoteTag } from '../../types/note';

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

function buildConfig(cookies?: string, params?: Record<string, unknown>) {
  return {
    params,
    headers: cookies ? { Cookie: cookies } : undefined,
  };
}

export async function fetchNotes(
  params?: { search?: string; page?: number; tag?: string; perPage?: number },
  cookies?: string
) {
  const filteredParams: Record<string, unknown> = {};
  if (params?.page) filteredParams.page = params.page;
  if (params?.perPage) filteredParams.limit = params.perPage;
  if (params?.search) filteredParams.search = params.search;
  if (params?.tag && params.tag !== 'all') filteredParams.tag = params.tag;

  const res = await api.get<ServerNote[]>('/notes', buildConfig(cookies, filteredParams));
  return res.data.map(toNote);
}


export async function fetchNoteById(id: string, cookies?: string) {
  const res = await api.get<ServerNote>(`/notes/${id}`, buildConfig(cookies));
  return toNote(res.data);
}

export async function createNote(payload: { title: string; content: string; tag: string }) {
  const res = await api.post<ServerNote>('/notes', payload);
  return toNote(res.data);
}

export async function deleteNote(id: string) {
  const res = await api.delete<ServerNote>(`/notes/${id}`);
  return toNote(res.data);
}

export async function register(payload: { email: string; password: string }) {
  const res = await api.post<User>('/auth/register', payload);
  return res.data;
}

export async function login(payload: { email: string; password: string }) {
  const res = await api.post<User>('/auth/login', payload);
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function checkSession(cookies?: string) {
  const res = await api.get<User | null>('/auth/session', buildConfig(cookies));
  return res.data;
}

export async function getMe(cookies?: string) {
  const res = await api.get<User>('/users/me', buildConfig(cookies));
  return res.data;
}

export async function updateMe(payload: Partial<User>) {
  const res = await api.patch<User>('/users/me', payload);
  return res.data;
}
