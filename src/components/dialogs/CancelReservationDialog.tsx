import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface CancelReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (reason: string) => Promise<void>;
  isLoading: boolean;
  reservationInfo?: {
    bookTitle: string;
    userName: string;
  };
}

const CancelReservationDialog = ({
  open,
  onOpenChange,
  onCancel,
  isLoading,
  reservationInfo,
}: CancelReservationDialogProps) => {
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    await onCancel(reason);
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Cancelar Reserva
          </DialogTitle>
          <DialogDescription>
            {reservationInfo ? (
              <>
                Vas a cancelar la reserva de "{reservationInfo.bookTitle}" para{" "}
                {reservationInfo.userName}. Esta acción notificará al usuario.
              </>
            ) : (
              "Proporciona una razón para cancelar esta reserva."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Razón de Cancelación *</Label>
              <Textarea
                id="reason"
                placeholder="Ej: Libro dañado, Usuario solicitó cancelación, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                El usuario recibirá esta razón por correo electrónico.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Volver
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !reason.trim()}
              variant="destructive"
            >
              {isLoading ? "Cancelando..." : "Cancelar Reserva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelReservationDialog;
