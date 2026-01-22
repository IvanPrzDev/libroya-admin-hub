import { createContext } from "react";

export interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  toggleCollapse: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined,
);
