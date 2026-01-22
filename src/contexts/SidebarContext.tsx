import { useState, useEffect, ReactNode } from "react";
import { SidebarContext } from "./sidebar-context";

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // On desktop, sidebar is always open (not mobile mode)
      if (!mobile) {
        setIsOpen(true);
      } else {
        // On mobile, sidebar starts closed
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isMobile,
        isCollapsed,
        toggle,
        close,
        open,
        toggleCollapse,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
