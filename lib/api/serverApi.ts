import axios from 'axios';

// Local User type to avoid import resolution issues during build
export type User = {
  email: string;
  username: string;
  avatar: string;
};

const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000') + '/api';

function createServerInstance(cookies?: string) {
  const instance = axios.create({ baseURL, withCredentials: true });
  if (cookies) {
    // assign Cookie header using a safe cast to avoid type incompatibilities with axios headers types
    const defaults = instance.defaults;
    (defaults.headers as unknown as Record<string, unknown>)['Cookie'] = cookies;
  }
  return instance;
}

export type Note = {
  _id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
};

export async function fetchNotes(cookies?: string, params?: { search?: string; page?: number; tag?: string }) {
  const api = createServerInstance(cookies);
  const res = await api.get<Note[]>('/notes', { params });
  return res.data;
}

export async function fetchNoteById(cookies: string | undefined, id: string) {
  const api = createServerInstance(cookies);
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function getMe(cookies?: string) {
  const api = createServerInstance(cookies);
  const res = await api.get<User>('/users/me');
  return res.data;
}

export async function checkSession(cookies?: string) {
  const api = createServerInstance(cookies);
  const res = await api.get<User | null>('/auth/session');
  return res.data;
}