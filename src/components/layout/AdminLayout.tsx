import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { useSidebar } from "@/hooks/useSidebar";

const AdminLayoutContent = () => {
  const { isOpen, isMobile, isCollapsed, close } = useSidebar();

  return (
    <div className="flex min-h-screen w-full gradient-bg">
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      <AdminSidebar />

      <main
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          !isMobile ? (isCollapsed ? "lg:ml-20" : "lg:ml-64") : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
};

export default AdminLayout;
