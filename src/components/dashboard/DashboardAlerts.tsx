import { AlertCircle, AlertTriangle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Reservation } from "@/types";

interface DashboardAlertsProps {
  pendingAboutToExpire: Reservation[];
  expiringSoon: Reservation[];
  corruptedReservations: Reservation[];
}

export default function DashboardAlerts({
  pendingAboutToExpire,
  expiringSoon,
  corruptedReservations,
}: DashboardAlertsProps) {
  const navigate = useNavigate();

  if (
    pendingAboutToExpire.length === 0 &&
    expiringSoon.length === 0 &&
    corruptedReservations.length === 0
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {pendingAboutToExpire.length > 0 && (
        <Alert className="border-libroya-warning bg-libroya-warning/10">
          <AlertTriangle className="h-4 w-4 text-libroya-warning" />
          <AlertTitle>Reservas por Expirar</AlertTitle>
          <AlertDescription>
            {pendingAboutToExpire.length} reservas PENDING con más de 20h sin
            confirmar
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto ml-2"
              onClick={() => navigate("/reservations")}
            >
              Ver todas
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {expiringSoon.length > 0 && (
        <Alert className="border-libroya-yellow bg-libroya-yellow/10">
          <Clock className="h-4 w-4 text-libroya-yellow" />
          <AlertTitle>Próximas a Vencer</AlertTitle>
          <AlertDescription>
            {expiringSoon.length} reservas vencen en ≤3 días
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto ml-2"
              onClick={() => navigate("/reservations")}
            >
              Ver todas
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {corruptedReservations.length > 0 && (
        <Alert className="border-libroya-error bg-libroya-error/10">
          <AlertCircle className="h-4 w-4 text-libroya-error" />
          <AlertTitle>Reservas Corruptas</AlertTitle>
          <AlertDescription>
            {corruptedReservations.length} reservas necesitan atención
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto ml-2"
              onClick={() => navigate("/reservations")}
            >
              Ver todas
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
