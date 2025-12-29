import { Bell, Shield, User, Database } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
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
                  <CardDescription>Administra la información de tu cuenta</CardDescription>
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
                <Input id="email" type="email" defaultValue="alfredo@libroya.com" />
              </div>
              <Button className="bg-libroya-green hover:bg-libroya-green-light">
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-libroya-yellow/10 flex items-center justify-center">
                  <Bell size={20} className="text-libroya-yellow" />
                </div>
                <div>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configura cómo recibes las notificaciones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por correo</Label>
                  <p className="text-sm text-muted-foreground">Recibe actualizaciones sobre las reservas</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de nuevos usuarios</Label>
                  <p className="text-sm text-muted-foreground">Recibe alertas cuando se registren nuevos usuarios</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Aprobaciones pendientes</Label>
                  <p className="text-sm text-muted-foreground">Alertas sobre reservas pendientes de aprobar</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-libroya-error/10 flex items-center justify-center">
                  <Shield size={20} className="text-libroya-error" />
                </div>
                <div>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>Administra tus preferencias de seguridad</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticación de dos factores</Label>
                  <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Cambiar contraseña</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="Contraseña actual" className="flex-1" />
                  <Input type="password" placeholder="Nueva contraseña" className="flex-1" />
                  <Button variant="outline">Actualizar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-libroya-green/10 flex items-center justify-center">
                  <Database size={20} className="text-libroya-green" />
                </div>
                <div>
                  <CardTitle>Sistema</CardTitle>
                  <CardDescription>Configuración general del sistema</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Copias de seguridad automáticas</Label>
                  <p className="text-sm text-muted-foreground">Respaldo diario de todos los datos</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo de mantenimiento</Label>
                  <p className="text-sm text-muted-foreground">Deshabilitar temporalmente el acceso público</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
