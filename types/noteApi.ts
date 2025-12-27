import type { Note } from "./note";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
  sort?: string;
}

export interface FetchNotesResponse {
  totalPages: number;
  notes: Note[];
}
