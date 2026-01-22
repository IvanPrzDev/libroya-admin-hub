import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as reservationsService from "@/services/reservationsService";
import {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
} from "@/types";

// Query Keys
export const RESERVATIONS_KEYS = {
  all: ["reservations"] as const,
  lists: () => [...RESERVATIONS_KEYS.all, "list"] as const,
  list: (filters?: string) =>
    [...RESERVATIONS_KEYS.lists(), { filters }] as const,
  details: () => [...RESERVATIONS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...RESERVATIONS_KEYS.details(), id] as const,
  byUser: (userId: string) =>
    [...RESERVATIONS_KEYS.all, "user", userId] as const,
  byBook: (bookId: string) =>
    [...RESERVATIONS_KEYS.all, "book", bookId] as const,
};

export const useReservations = () => {
  return useQuery({
    queryKey: RESERVATIONS_KEYS.lists(),
    queryFn: () => reservationsService.getAllReservations(),
  });
};

export const useReservation = (id: string) => {
  return useQuery({
    queryKey: RESERVATIONS_KEYS.detail(id),
    queryFn: () => reservationsService.getReservationById(id),
    enabled: !!id,
  });
};

export const useReservationsByUser = (userId: string) => {
  return useQuery({
    queryKey: RESERVATIONS_KEYS.byUser(userId),
    queryFn: () => reservationsService.getReservationsByUser(userId),
    enabled: !!userId,
  });
};

export const useReservationsByBook = (bookId: string) => {
  return useQuery({
    queryKey: RESERVATIONS_KEYS.byBook(bookId),
    queryFn: () => reservationsService.getReservationsByBook(bookId),
    enabled: !!bookId,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<Reservation, Error, CreateReservationRequest>({
    mutationFn: (reservation: CreateReservationRequest) =>
      reservationsService.createReservation(reservation),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: RESERVATIONS_KEYS.byUser(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: RESERVATIONS_KEYS.byBook(variables.bookId),
      });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Reservation,
    Error,
    { id: string; data: UpdateReservationRequest }
  >({
    mutationFn: ({ id, data }) =>
      reservationsService.updateReservation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: RESERVATIONS_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEYS.lists() });
    },
  });
};

export const useConfirmReservationByQr = () => {
  const queryClient = useQueryClient();

  return useMutation<Reservation, Error, string>({
    mutationFn: (qrData: string) =>
      reservationsService.confirmReservationByQr(qrData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEYS.lists() });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<Reservation, Error, { id: string; reason: string }>({
    mutationFn: ({ id, reason }) =>
      reservationsService.cancelReservation(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: RESERVATIONS_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEYS.lists() });
    },
  });
};

export const useCompleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<Reservation, Error, string>({
    mutationFn: (id: string) => reservationsService.completeReservation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEYS.lists() });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => reservationsService.deleteReservation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEYS.lists() });
    },
  });
};

export const useTestScheduler = () => {
  return useMutation<{ message: string }, Error>({
    mutationFn: () => reservationsService.testScheduler(),
  });
};
