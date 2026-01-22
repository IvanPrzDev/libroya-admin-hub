import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BookOpen,
  Settings,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Panel", path: "/dashboard" },
  { icon: CalendarCheck, label: "Reservas", path: "/reservations" },
  { icon: Users, label: "Usuarios", path: "/users" },
  { icon: BookOpen, label: "Libros", path: "/books" },
  { icon: Settings, label: "Configuración", path: "/settings" },
];
