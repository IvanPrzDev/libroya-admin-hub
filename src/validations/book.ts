import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  author: z.string().min(1, "El autor es obligatorio"),
  isbn: z.string().optional(),
  publishedYear: z.coerce
    .number()
    .int()
    .min(1000, "Año inválido")
    .max(new Date().getFullYear() + 1, "Año inválido")
    .optional()
    .or(z.literal("")),
  genre: z.string().optional(),
  description: z.string().optional(),
  available: z.boolean().default(true),
  availabilityReason: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;
