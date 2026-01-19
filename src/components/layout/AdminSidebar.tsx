import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "../core/Logo";
import { cn } from "@/utils/utils";
import { NAV_ITEMS } from "@/constants/navigation";
import { useSidebar } from "@/hooks/useSidebar";

const AdminSidebar = () => {
  const location = useLocation();
  const { isOpen, isMobile, isCollapsed, toggleCollapse, close } = useSidebar();

  // On mobile, sidebar visibility is controlled by isOpen from context
  // On desktop, sidebar is always visible but can be collapsed
  const handleToggleCollapse = () => {
    if (!isMobile) {
      toggleCollapse();
    }
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when clicking a nav item
    if (isMobile) {
      close();
    }
  };

  return (
    <aside
      className={cn(
        "sidebar-gradient h-screen flex flex-col transition-all duration-300 shadow-sidebar fixed left-0 top-0 z-50",
        // Mobile: slide in/out
        isMobile && !isOpen && "-translate-x-full",
        isMobile && isOpen && "translate-x-0",
        // Desktop: always visible, but can be collapsed
        !isMobile && (isCollapsed ? "w-20" : "w-64"),
        // Mobile: always full width when open
        isMobile && "w-64",
      )}
    >
      {/* Toggle Button - Only visible on desktop */}
      {!isMobile && (
        <button
          onClick={handleToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-secondary transition-colors z-50"
        >
          {isCollapsed ? (
            <ChevronRight size={14} className="text-libroya-green" />
          ) : (
            <ChevronLeft size={14} className="text-libroya-green" />
          )}
        </button>
      )}

      {/* Logo */}
      <div
        className={cn(
          "p-6",
          isCollapsed && !isMobile && "px-4 flex justify-center",
        )}
      >
        <Logo
          size={isCollapsed && !isMobile ? "sm" : "md"}
          showText={!isCollapsed || isMobile}
          variant="sidebar"
        />
        {(!isCollapsed || isMobile) && (
          <p className="text-white/60 text-xs mt-1 ml-12">
            Panel de Administración
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                    isCollapsed && !isMobile && "justify-center px-2",
                  )}
                >
                  <item.icon
                    size={20}
                    className={isActive ? "text-libroya-yellow" : ""}
                  />
                  {(!isCollapsed || isMobile) && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
