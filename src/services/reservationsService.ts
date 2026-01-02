import { api } from "./api";
import {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
  ConfirmQrRequest,
  CancelReservationRequest,
} from "@/types";

const BASE_PATH = "/admin/reservations";

export const getAllReservations = async (): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(BASE_PATH);
  return data;
};

export const getReservationById = async (id: string): Promise<Reservation> => {
  const { data } = await api.get<Reservation>(`${BASE_PATH}/${id}`);
  return data;
};

export const getReservationsByUser = async (
  userId: string
): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(`${BASE_PATH}/user/${userId}`);
  return data;
};

export const getReservationsByBook = async (
  bookId: string
): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(`${BASE_PATH}/book/${bookId}`);
  return data;
};

export const createReservation = async (
  reservation: CreateReservationRequest
): Promise<Reservation> => {
  const { data } = await api.post<Reservation>(BASE_PATH, reservation);
  return data;
};

export const updateReservation = async (
  id: string,
  reservation: UpdateReservationRequest
): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(
    `${BASE_PATH}/${id}`,
    reservation
  );
  return data;
};

export const confirmReservationByQr = async (
  qrData: string
): Promise<Reservation> => {
  const { data } = await api.post<Reservation>(`${BASE_PATH}/confirm-qr`, {
    qrData,
  });
  return data;
};

export const cancelReservation = async (
  id: string,
  reason: string
): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(`${BASE_PATH}/${id}/cancel`, {
    reason,
  });
  return data;
};

export const completeReservation = async (id: string): Promise<Reservation> => {
  const { data } = await api.patch<Reservation>(`${BASE_PATH}/${id}/complete`);
  return data;
};

export const deleteReservation = async (id: string): Promise<void> => {
  await api.delete(`${BASE_PATH}/${id}`);
};
