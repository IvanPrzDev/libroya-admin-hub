import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional()
    .or(z.literal("")),
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  role: z.enum(["admin", "user"]).default("user"),
  isActive: z.boolean().default(true),
});

export type UserFormValues = z.infer<typeof userSchema>;
