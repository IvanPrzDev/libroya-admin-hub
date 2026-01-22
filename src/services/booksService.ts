import { api } from "@/config/axios";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types";
import { BOOKS_ENDPOINTS } from "@/constants/endpoints";

export const getAllBooks = async (): Promise<Book[]> => {
  const { data } = await api.get<Book[]>(BOOKS_ENDPOINTS.BASE);
  return data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const { data } = await api.get<Book>(BOOKS_ENDPOINTS.BY_ID(id));
  return data;
};

export const createBook = async (book: CreateBookRequest): Promise<Book> => {
  const { data } = await api.post<Book>(BOOKS_ENDPOINTS.BASE, book);
  return data;
};

export const updateBook = async (
  id: string,
  book: UpdateBookRequest,
): Promise<Book> => {
  const { data } = await api.patch<Book>(BOOKS_ENDPOINTS.BY_ID(id), book);
  return data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await api.delete(BOOKS_ENDPOINTS.BY_ID(id));
};
