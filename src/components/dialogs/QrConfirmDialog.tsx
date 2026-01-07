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
            Confirmar Reserva
          </DialogTitle>
          <DialogDescription>
            Escanea el código QR del correo o ingresa manualmente el ID de la
            reserva.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="qrData">ID de Reserva o Código QR</Label>
              <Input
                id="qrData"
                placeholder="Ej: 64f1a5c123456789abcdef01"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                disabled={isLoading}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Ingresa el ID de la reserva (24 caracteres) que aparece en el
                correo del usuario.
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
