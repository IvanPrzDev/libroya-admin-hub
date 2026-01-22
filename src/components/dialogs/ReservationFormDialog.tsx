import { Reservation, UpdateReservationRequest } from "@/types";
import ReservationForm from "@/components/forms/ReservationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReservationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
  onSubmit: (data: UpdateReservationRequest) => Promise<void>;
  isLoading: boolean;
}

const ReservationFormDialog = ({
  open,
  onOpenChange,
  reservation,
  onSubmit,
  isLoading,
}: ReservationFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogDescription>
            Modifica los datos de la reserva. Ten cuidado al cambiar el estado
            manualmente.
          </DialogDescription>
        </DialogHeader>

        <ReservationForm
          reservation={reservation}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          isOpen={open}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReservationFormDialog;
