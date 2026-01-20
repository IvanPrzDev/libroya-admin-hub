import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { icon: LayoutDashboard, label: "Panel", path: "/dashboard" },
  { icon: CalendarCheck, label: "Reservas", path: "/reservations" },
  { icon: Users, label: "Usuarios", path: "/users" },
  { icon: BookOpen, label: "Libros", path: "/books" },
  { icon: Settings, label: "Configuración", path: "/settings" },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const AdminSidebar = ({ collapsed = false, onToggle }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "sidebar-gradient h-screen flex flex-col transition-all duration-300 shadow-sidebar fixed left-0 top-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-secondary transition-colors z-50"
      >
        {collapsed ? (
          <ChevronRight size={14} className="text-libroya-green" />
        ) : (
          <ChevronLeft size={14} className="text-libroya-green" />
        )}
      </button>

      {/* Logo */}
      <div className={cn("p-6", collapsed && "px-4")}>
        <Logo
          size={collapsed ? "sm" : "md"}
          showText={!collapsed}
          variant="sidebar"
        />
        {!collapsed && (
          <p className="text-white/60 text-xs mt-1 ml-12">
            Panel de Administración
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon
                    size={20}
                    className={isActive ? "text-libroya-yellow" : ""}
                  />
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className={cn("p-4 border-t border-white/10", collapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center gap-3 mb-3",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="w-10 h-10 border-2 border-white/30">
            <AvatarFallback className="bg-libroya-yellow text-libroya-green-dark font-semibold">
              IP
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                Iván Pérez
              </p>
              <p className="text-white/50 text-xs">Administrador</p>
            </div>
          )}
        </div>
        <button
          className={cn(
            "flex items-center gap-2 text-white/60 hover:text-white transition-colors w-full px-2 py-2 rounded-lg hover:bg-white/10",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
