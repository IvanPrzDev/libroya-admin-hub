import { BookGenre, ReservationStatus, UserRole } from "@/types";

export const BOOK_GENRES: Record<BookGenre, string> = {
  fiction: "Ficción",
  non_fiction: "No Ficción",
  mystery: "Misterio",
  romance: "Romance",
  drama: "Drama",
  thriller: "Thriller",
  science_fiction: "Ciencia Ficción",
  fantasy: "Fantasía",
  horror: "Terror",
  biography: "Biografía",
  autobiography: "Autobiografía",
  history: "Historia",
  children: "Infantil",
  young_adult: "Juvenil",
  self_help: "Autoayuda",
  classics: "Clásicos",
  comedy: "Comedia",
  western: "Western",
  literature: "Literatura",
};

export const RESERVATION_STATUSES: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  CORRUPTED: "Corrupta",
};

export const BLOCKING_STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "CORRUPTED",
];

export const USER_ROLES: Record<UserRole, string> = {
  admin: "Administrador",
  user: "Usuario",
};

export const RESERVATION_STATUS_COLORS: Record<
  ReservationStatus,
  {
    badge: string;
    bg: string;
    text: string;
    border: string;
  }
> = {
  PENDING: {
    badge: "bg-libroya-yellow/15 text-libroya-yellow border-libroya-yellow/30",
    bg: "bg-libroya-yellow/10",
    text: "text-libroya-yellow",
    border: "border-libroya-yellow",
  },
  CONFIRMED: {
    badge: "bg-libroya-green/15 text-libroya-green border-libroya-green/30",
    bg: "bg-libroya-green/10",
    text: "text-libroya-green",
    border: "border-libroya-green",
  },
  CANCELLED: {
    badge:
      "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
    bg: "bg-muted-foreground/10",
    text: "text-muted-foreground",
    border: "border-muted-foreground",
  },
  COMPLETED: {
    badge:
      "bg-libroya-success/15 text-libroya-success border-libroya-success/30",
    bg: "bg-libroya-success/10",
    text: "text-libroya-success",
    border: "border-libroya-success",
  },
  CORRUPTED: {
    badge: "bg-libroya-error/15 text-libroya-error border-libroya-error/30",
    bg: "bg-libroya-error/10",
    text: "text-libroya-error",
    border: "border-libroya-error",
  },
};

export const USER_ROLE_COLORS: Record<
  UserRole,
  {
    badge: string;
    bg: string;
    text: string;
  }
> = {
  admin: {
    badge: "bg-libroya-error/15 text-libroya-error border-libroya-error/30",
    bg: "bg-libroya-error/10",
    text: "text-libroya-error",
  },
  user: {
    badge: "bg-libroya-green/15 text-libroya-green border-libroya-green/30",
    bg: "bg-libroya-green/10",
    text: "text-libroya-green",
  },
};
