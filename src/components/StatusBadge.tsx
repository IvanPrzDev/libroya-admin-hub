import { cn } from "@/lib/utils";

type StatusType = "pending" | "approved" | "rejected";

interface StatusBadgeProps {
  status: StatusType;
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    className: "bg-libroya-yellow/15 text-libroya-yellow border-libroya-yellow/30",
  },
  approved: {
    label: "Aprobado",
    className: "bg-libroya-success/15 text-libroya-success border-libroya-success/30",
  },
  rejected: {
    label: "Rechazado",
    className: "bg-libroya-error/15 text-libroya-error border-libroya-error/30",
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
