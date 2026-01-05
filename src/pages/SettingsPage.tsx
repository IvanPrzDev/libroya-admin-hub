import { useState, useEffect } from "react";
import {
  Bell,
  Shield,
  User,
  Database,
  Calendar,
  PlayCircle,
  Loader2,
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import * as reservationsService from "@/services/reservationsService";
import { getErrorMessage } from "@/services/api";

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
          {/* Profile Settings */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-libroya-green/10 flex items-center justify-center">
                  <User size={20} className="text-libroya-green" />
                </div>
                <div>
                  <CardTitle>Configuración del Perfil</CardTitle>
                  <CardDescription>
                    Administra la información de tu cuenta
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" defaultValue="Alfredo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" defaultValue="Gutierrez" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="alfredo@libroya.com"
                />
              </div>
              <Button className="bg-libroya-green hover:bg-libroya-green-light">
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card
            className="shadow-card animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-libroya-yellow/10 flex items-center justify-center">
                  <Bell size={20} className="text-libroya-yellow" />
                </div>
                <div>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>
                    Configura cómo recibes las notificaciones
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por correo</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones sobre las reservas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de nuevos usuarios</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe alertas cuando se registren nuevos usuarios
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Aprobaciones pendientes</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertas sobre reservas pendientes de aprobar
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card
            className="shadow-card animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-libroya-error/10 flex items-center justify-center">
                  <Shield size={20} className="text-libroya-error" />
                </div>
                <div>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>
                    Administra tus preferencias de seguridad
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticación de dos factores</Label>
                  <p className="text-sm text-muted-foreground">
                    Añade una capa extra de seguridad
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Cambiar contraseña</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Contraseña actual"
                    className="flex-1"
                  />
                  <Input
                    type="password"
                    placeholder="Nueva contraseña"
                    className="flex-1"
                  />
                  <Button variant="outline">Actualizar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card
            className="shadow-card animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-libroya-green/10 flex items-center justify-center">
                  <Database size={20} className="text-libroya-green" />
                </div>
                <div>
                  <CardTitle>Sistema</CardTitle>
                  <CardDescription>
                    Configuración general del sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Copias de seguridad automáticas</Label>
                  <p className="text-sm text-muted-foreground">
                    Respaldo diario de todos los datos
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo de mantenimiento</Label>
                  <p className="text-sm text-muted-foreground">
                    Deshabilitar temporalmente el acceso público
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Administrative Tools */}
          <Card
            className="shadow-card animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
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
      <AlertDialog
        open={showSchedulerConfirm}
        onOpenChange={setShowSchedulerConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Ejecutar tareas del scheduler?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción ejecutará las siguientes tareas:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cancelar reservas PENDING con más de 24h sin confirmar</li>
                <li>Marcar como CORRUPTED las reservas CONFIRMED vencidas</li>
              </ul>
              <p className="mt-2 text-sm font-medium">
                Esta operación puede tardar unos segundos si hay muchas
                reservas.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSchedulerLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTestScheduler}
              disabled={isSchedulerLoading}
              className="bg-libroya-green hover:bg-libroya-green-light"
            >
              {isSchedulerLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SettingsPage;
