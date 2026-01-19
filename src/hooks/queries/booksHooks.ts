import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as booksService from "@/services/booksService";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types";

// Query Keys
export const BOOKS_KEYS = {
  all: ["books"] as const,
  lists: () => [...BOOKS_KEYS.all, "list"] as const,
  list: (filters?: string) => [...BOOKS_KEYS.lists(), { filters }] as const,
  details: () => [...BOOKS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BOOKS_KEYS.details(), id] as const,
};
export const useBooks = () => {
  return useQuery({
    queryKey: BOOKS_KEYS.lists(),
    queryFn: () => booksService.getAllBooks(),
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: BOOKS_KEYS.detail(id),
    queryFn: () => booksService.getBookById(id),
    enabled: !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation<Book, Error, CreateBookRequest>({
    mutationFn: (book: CreateBookRequest) => booksService.createBook(book),
    onSuccess: () => {
      // Invalida el cache de la lista de libros para refrescarla
      queryClient.invalidateQueries({ queryKey: BOOKS_KEYS.lists() });
    },
  });
};
const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation<Book, Error, { id: string; data: UpdateBookRequest }>({
    mutationFn: ({ id, data }) => booksService.updateBook(id, data),
    onSuccess: (_, variables) => {
      // Invalida tanto el detalle como la lista
      queryClient.invalidateQueries({
        queryKey: BOOKS_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: BOOKS_KEYS.lists() });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => booksService.deleteBook(id),
    onSuccess: (_, id) => {
      // Invalida el detalle y la lista
      queryClient.invalidateQueries({ queryKey: BOOKS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: BOOKS_KEYS.lists() });
    },
  });
};
