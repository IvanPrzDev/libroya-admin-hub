import {
  CheckCircle,
  XCircle,
  QrCode,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Reservation, ReservationStatus } from "@/types";

interface ReservationActionsProps {
  reservation: Reservation;
  onConfirm: (reservation: Reservation) => void;
  onComplete: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
  onDelete: (reservation: Reservation) => void;
  onViewDetails: (reservation: Reservation) => void;
}

const ReservationActions = ({
  reservation,
  onConfirm,
  onComplete,
  onEdit,
  onCancel,
  onDelete,
  onViewDetails,
}: ReservationActionsProps) => {
  const canConfirm = (status: ReservationStatus) => status === "PENDING";
  const canComplete = (status: ReservationStatus) => status === "CONFIRMED";
  const canCancel = (status: ReservationStatus) =>
    status === "PENDING" || status === "CONFIRMED";

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Confirmar por QR */}
      {canConfirm(reservation.status) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConfirm(reservation)}
          className="gap-1"
        >
          <QrCode size={14} />
          Confirmar
        </Button>
      )}

      {/* Completar */}
      {canComplete(reservation.status) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onComplete(reservation)}
          className="gap-1 text-libroya-success border-libroya-success hover:bg-libroya-success/10"
        >
          <CheckCircle size={14} />
          Completar
        </Button>
      )}

      {/* Menú de opciones */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewDetails(reservation)}>
            <Eye size={14} className="mr-2" />
            Ver Detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(reservation)}>
            <Edit size={14} className="mr-2" />
            Editar
          </DropdownMenuItem>
          {canCancel(reservation.status) && (
            <DropdownMenuItem
              onClick={() => onCancel(reservation)}
              className="text-destructive"
            >
              <XCircle size={14} className="mr-2" />
              Cancelar
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => onDelete(reservation)}
            className="text-destructive"
          >
            <Trash2 size={14} className="mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReservationActions;
