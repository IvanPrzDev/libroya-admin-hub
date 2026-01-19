import { api } from "@/config/axios";
import {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
  ConfirmQrRequest,
  CancelReservationRequest,
} from "@/types";
import { RESERVATIONS_ENDPOINTS } from "@/constants/endpoints";

export const getAllReservations = async (): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(RESERVATIONS_ENDPOINTS.BASE);
  return data;
};

export const getReservationById = async (id: string): Promise<Reservation> => {
  const { data } = await api.get<Reservation>(RESERVATIONS_ENDPOINTS.BY_ID(id));
  return data;
};

export const getReservationsByUser = async (
  userId: string,
): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(
    RESERVATIONS_ENDPOINTS.BY_USER(userId),
  );
  return data;
};

export const getReservationsByBook = async (
  bookId: string,
): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(
    RESERVATIONS_ENDPOINTS.BY_BOOK(bookId),
  );
  return data;
};

export const createReservation = async (
  reservation: CreateReservationRequest,
): Promise<Reservation> => {
  const { data } = await api.post<Reservation>(
    RESERVATIONS_ENDPOINTS.BASE,
    reservation,
  );
  return data;
};

export const updateReservation = async (
  id: string,
  reservation: UpdateReservationRequest,
): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(
    RESERVATIONS_ENDPOINTS.BY_ID(id),
    reservation,
  );
  return data;
};

export const confirmReservationByQr = async (
  qrData: string,
): Promise<Reservation> => {
  const { data } = await api.post<Reservation>(
    RESERVATIONS_ENDPOINTS.CONFIRM_QR,
    {
      qrData,
    },
  );
  return data;
};

export const cancelReservation = async (
  id: string,
  reason: string,
): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(
    RESERVATIONS_ENDPOINTS.CANCEL(id),
    {
      reason,
    },
  );
  return data;
};

export const completeReservation = async (id: string): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(
    RESERVATIONS_ENDPOINTS.COMPLETE(id),
  );
  return data;
};

export const deleteReservation = async (id: string): Promise<void> => {
  await api.delete(RESERVATIONS_ENDPOINTS.BY_ID(id));
};

export const testScheduler = async (): Promise<{ message: string }> => {
  const { data } = await api.get<{ message: string }>(
    RESERVATIONS_ENDPOINTS.TEST_SCHEDULER,
  );
  return data;
};
