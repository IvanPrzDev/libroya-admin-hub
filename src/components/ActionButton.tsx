import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  variant: "approve" | "reject";
  onClick?: () => void;
  size?: "sm" | "md";
}

const ActionButton = ({ variant, onClick, size = "sm" }: ActionButtonProps) => {
  const isApprove = variant === "approve";
  
  return (
    <Button
      onClick={onClick}
      size={size === "sm" ? "sm" : "default"}
      className={cn(
        "font-medium transition-all duration-200",
        isApprove
          ? "bg-libroya-success hover:bg-libroya-success/90 text-white"
          : "bg-libroya-error hover:bg-libroya-error/90 text-white"
      )}
    >
      {isApprove ? "Approve" : "Reject"}
    </Button>
  );
};

export default ActionButton;
