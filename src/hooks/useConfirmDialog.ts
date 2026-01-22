import { useState } from "react";

interface UseConfirmDialogReturn {
  isOpen: boolean;
  data: any | null;
  openConfirm: (data: any) => void;
  closeConfirm: () => void;
  confirm: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openConfirm = (confirmData: any) => {
    setData(confirmData);
    setIsOpen(true);
  };

  const closeConfirm = () => {
    setIsOpen(false);
    setData(null);
    setIsLoading(false);
  };

  const confirm = async () => {
    // This will be overridden by the component using the hook
    closeConfirm();
  };

  return {
    isOpen,
    data,
    openConfirm,
    closeConfirm,
    confirm,
    isLoading,
    setIsLoading,
  };
};
