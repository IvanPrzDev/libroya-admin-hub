import { UserRole } from "@/types";

export const USER_ROLES: Record<UserRole, string> = {
  admin: "Administrador",
  user: "Usuario",
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
