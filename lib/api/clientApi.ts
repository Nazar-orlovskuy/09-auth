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

export async function fetchNotes(params?: { search?: string; page?: number; tag?: string; perPage?: number }) {
  const res = await api.get<ServerNote[]>('/notes', { params });
  return res.data.map(toNote);
}

export async function fetchNoteById(id: string) {
  const res = await api.get<ServerNote>(`/notes/${id}`);
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

export async function checkSession() {
  const res = await api.get<User | null>('/auth/session');
  return res.data;
}

export async function getMe() {
  const res = await api.get<User>('/users/me');
  return res.data;
}

export async function updateMe(payload: Partial<User>) {
  const res = await api.patch<User>('/users/me', payload);
  return res.data;
}