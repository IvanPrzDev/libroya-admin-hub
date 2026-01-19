import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import {
  cancelReservationSchema,
  type CancelReservationFormData,
} from "@/validations/reservation";

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
  const form = useForm<CancelReservationFormData>({
    resolver: zodResolver(cancelReservationSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleSubmit = async (data: CancelReservationFormData) => {
    await onCancel(data.reason);
    form.reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón de Cancelación *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Libro dañado, Usuario solicitó cancelación, etc."
                      disabled={isLoading}
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    El usuario recibirá esta razón por correo electrónico.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Volver
              </Button>
              <Button type="submit" disabled={isLoading} variant="destructive">
                {isLoading ? "Cancelando..." : "Cancelar Reserva"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelReservationDialog;
