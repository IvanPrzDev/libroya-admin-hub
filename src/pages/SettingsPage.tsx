import { useState, useEffect } from "react";
import { Calendar, PlayCircle, Loader2 } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import * as reservationsService from "@/services/reservationsService";
import { getErrorMessage } from "@/utils/errorHandler";

const SettingsPage = () => {
  const [isSchedulerLoading, setIsSchedulerLoading] = useState(false);
  const [showSchedulerConfirm, setShowSchedulerConfirm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Configuración | LibroYa Admin";
  }, []);

  const handleTestScheduler = async () => {
    try {
      setIsSchedulerLoading(true);
      await reservationsService.testScheduler();
      toast({
        title: "Scheduler ejecutado correctamente",
        description:
          "Las tareas programadas se han ejecutado. Refresca la lista de reservas para ver los cambios.",
      });
      setShowSchedulerConfirm(false);
    } catch (error) {
      console.error("Error al ejecutar scheduler:", error);
      toast({
        title: "Error al ejecutar scheduler",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSchedulerLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Configuración" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Administrative Tools */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-libroya-yellow/10 flex items-center justify-center">
                  <Calendar size={20} className="text-libroya-yellow" />
                </div>
                <div>
                  <CardTitle>Herramientas Administrativas</CardTitle>
                  <CardDescription>
                    Tareas de mantenimiento y gestión del sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label>Test de Scheduler</Label>
                  <p className="text-sm text-muted-foreground">
                    Ejecuta manualmente las tareas programadas para cancelar
                    reservas expiradas y marcar reservas vencidas como corruptas
                  </p>
                </div>
                <Button
                  onClick={() => setShowSchedulerConfirm(true)}
                  disabled={isSchedulerLoading}
                  variant="outline"
                  className="ml-4"
                >
                  {isSchedulerLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Ejecutar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={showSchedulerConfirm}
        onOpenChange={setShowSchedulerConfirm}
        title="¿Ejecutar tareas del scheduler?"
        description={
          <>
            Esta acción ejecutará las siguientes tareas:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Cancelar reservas PENDING con más de 24h sin confirmar</li>
              <li>Marcar como CORRUPTED las reservas CONFIRMED vencidas</li>
            </ul>
            <p className="mt-2 text-sm font-medium">
              Esta operación puede tardar unos segundos si hay muchas reservas.
            </p>
          </>
        }
        onConfirm={handleTestScheduler}
        isLoading={isSchedulerLoading}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </>
  );
};

export default SettingsPage;
