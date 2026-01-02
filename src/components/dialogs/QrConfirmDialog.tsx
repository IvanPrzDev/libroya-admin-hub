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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";

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
  const [qrData, setQrData] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrData.trim()) return;

    await onConfirm(qrData);
    setQrData("");
  };

  const handleCancel = () => {
    setQrData("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Confirmar Reserva con Código QR
          </DialogTitle>
          <DialogDescription>
            Pega el código QR que recibió el usuario en su correo electrónico.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="qrData">Código QR</Label>
              <Input
                id="qrData"
                placeholder='{"reservationId":"...","bookId":"...","userId":"..."}'
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                disabled={isLoading}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                El código debe ser un JSON con los datos encriptados de la
                reserva.
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
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !qrData.trim()}
              className="bg-libroya-green hover:bg-libroya-green-light"
            >
              {isLoading ? "Confirmando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QrConfirmDialog;
