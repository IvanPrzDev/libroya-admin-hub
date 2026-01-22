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
import { Input } from "@/components/ui/input";
import { QrCode } from "lucide-react";
import {
  qrConfirmSchema,
  type QrConfirmFormData,
} from "@/validations/reservation";

interface QrConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (qrData: string) => Promise<void>;
  isLoading: boolean;
}

const QrConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: QrConfirmDialogProps) => {
  const form = useForm<QrConfirmFormData>({
    resolver: zodResolver(qrConfirmSchema),
    defaultValues: {
      qrData: "",
    },
  });

  const handleSubmit = async (data: QrConfirmFormData) => {
    await onConfirm(data.qrData);
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
            <QrCode className="h-5 w-5" />
            Confirmar Reserva
          </DialogTitle>
          <DialogDescription>
            Escanea el código QR del correo o ingresa manualmente el ID de la
            reserva.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="qrData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Reserva o Código QR</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: 64f1a5c123456789abcdef01"
                      disabled={isLoading}
                      className="font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Ingresa el ID de la reserva (24 caracteres) que aparece en
                    el correo del usuario.
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
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-libroya-green hover:bg-libroya-green-light"
              >
                {isLoading ? "Confirmando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QrConfirmDialog;
