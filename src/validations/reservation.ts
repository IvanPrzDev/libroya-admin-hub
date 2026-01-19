import { z } from "zod";

export const cancelReservationSchema = z.object({
  reason: z
    .string()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede exceder 500 caracteres"),
});

export const qrConfirmSchema = z.object({
  qrData: z
    .string()
    .min(1, "El código QR es requerido")
    .regex(/^[a-zA-Z0-9-_]+$/, "Código QR inválido"),
});

export const reservationFormSchema = z
  .object({
    userId: z.string().min(1, "El usuario es obligatorio"),
    bookId: z.string().min(1, "El libro es obligatorio"),
    startDate: z.date({ required_error: "La fecha de inicio es obligatoria" }),
    endDate: z.date({ required_error: "La fecha de fin es obligatoria" }),
    status: z.string().min(1, "El estado es obligatorio"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  });

export type CancelReservationFormData = z.infer<typeof cancelReservationSchema>;
export type QrConfirmFormData = z.infer<typeof qrConfirmSchema>;
export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
