import { api } from "./api";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types";

const BASE_PATH = "/admin/books";

export const getAllBooks = async (): Promise<Book[]> => {
  const { data } = await api.get<Book[]>(BASE_PATH);
  return data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const { data } = await api.get<Book>(`${BASE_PATH}/${id}`);
  return data;
};

export const createBook = async (book: CreateBookRequest): Promise<Book> => {
  const { data } = await api.post<Book>(BASE_PATH, book);
  return data;
};

export const updateBook = async (
  id: string,
  book: UpdateBookRequest
): Promise<Book> => {
  const { data } = await api.patch<Book>(`${BASE_PATH}/${id}`, book);
  return data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await api.delete(`${BASE_PATH}/${id}`);
};
