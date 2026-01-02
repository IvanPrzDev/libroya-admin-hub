import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Calendar,
  Loader2,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import UserFormDialog from "@/components/forms/UserFormDialog";
import UserReservationsDialog from "@/components/dialogs/UserReservationsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import * as usersService from "@/services/usersService";
import * as reservationsService from "@/services/reservationsService";
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from "@/types";
import { USER_ROLES, USER_ROLE_COLORS } from "@/utils/constants";
import { getErrorMessage } from "@/services/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reservationsDialogUser, setReservationsDialogUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [userReservationCounts, setUserReservationCounts] = useState<
    Record<string, { total: number; corrupted: number }>
  >({});
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadReservationCounts = useCallback(async () => {
    try {
      const counts: Record<string, { total: number; corrupted: number }> = {};

      // Cargar reservas para cada usuario
      await Promise.all(
        users.map(async (user) => {
          try {
            const reservations =
              await reservationsService.getReservationsByUser(user._id);
            counts[user._id] = {
              total: reservations.length,
              corrupted: reservations.filter((r) => r.status === "CORRUPTED")
                .length,
            };
          } catch (error) {
            counts[user._id] = { total: 0, corrupted: 0 };
          }
        })
      );

      setUserReservationCounts(counts);
    } catch (error) {
      console.error("Error al cargar conteos de reservas:", error);
    }
  }, [users]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Cargar conteos de reservas cuando cambien los usuarios
  useEffect(() => {
    if (users.length > 0) {
      loadReservationCounts();
    }
  }, [users, loadReservationCounts]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenForm = (user?: User) => {
    setSelectedUser(user || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    try {
      setIsFormLoading(true);

      if (selectedUser) {
        await usersService.updateUser(
          selectedUser._id,
          data as UpdateUserRequest
        );
        toast({
          title: "Usuario actualizado",
          description: "Los cambios se guardaron correctamente.",
        });
      } else {
        await usersService.createUser(data as CreateUserRequest);
        toast({
          title: "Usuario creado",
          description: "El usuario se agregó correctamente.",
        });
      }

      handleCloseForm();
      await loadUsers();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      await usersService.deleteUser(userToDelete._id);
      toast({
        title: "Usuario eliminado",
        description: "El usuario se eliminó correctamente.",
      });
      setUserToDelete(null);
      await loadUsers();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM, yyyy", { locale: es });
  };

  return (
    <>
      <AdminHeader title="Usuarios" />

      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Todos los Usuarios
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {isLoading
                    ? "Cargando..."
                    : `${users.length} usuarios registrados`}
                </p>
              </div>
              <Button
                onClick={() => handleOpenForm()}
                className="gap-2 bg-libroya-green hover:bg-libroya-green-light"
              >
                <Plus size={16} />
                Agregar Usuario
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Buscar por nombre o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Roles</SelectItem>
                  {Object.entries(USER_ROLES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user, index) => (
                  <Card
                    key={user._id}
                    className="border shadow-sm hover:shadow-card transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`https://i.pravatar.cc/150?u=${user._id}`}
                            />
                            <AvatarFallback className="bg-libroya-green text-white">
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {user.firstName} {user.lastName}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                USER_ROLE_COLORS[user.role as UserRole].badge
                              }`}
                            >
                              {USER_ROLES[user.role as UserRole]}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenForm(user)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setUserToDelete(user)}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail size={14} />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar size={14} />
                          <span>Registrado: {formatDate(user.createdAt)}</span>
                        </div>
                        {userReservationCounts[user._id]?.total > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <BookOpen size={14} />
                            <span>
                              {userReservationCounts[user._id].total} reserva
                              {userReservationCounts[user._id].total !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Alerta de reservas CORRUPTED */}
                      {userReservationCounts[user._id]?.corrupted > 0 && (
                        <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
                          <AlertCircle
                            size={14}
                            className="text-destructive mt-0.5 flex-shrink-0"
                          />
                          <div className="text-xs text-destructive">
                            <strong>
                              {userReservationCounts[user._id].corrupted}
                            </strong>{" "}
                            reserva
                            {userReservationCounts[user._id].corrupted !== 1
                              ? "s"
                              : ""}{" "}
                            corrompida
                            {userReservationCounts[user._id].corrupted !== 1
                              ? "s"
                              : ""}
                            . Usuario bloqueado para nuevas reservas.
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Estado
                          </span>
                          <Badge
                            variant="secondary"
                            className={
                              user.isActive
                                ? "bg-libroya-success/15 text-libroya-success"
                                : "bg-muted-foreground/15 text-muted-foreground"
                            }
                          >
                            {user.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>

                        {/* Botón Ver Reservas */}
                        {userReservationCounts[user._id]?.total > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={() =>
                              setReservationsDialogUser({
                                id: user._id,
                                name: `${user.firstName} ${user.lastName}`,
                              })
                            }
                          >
                            <BookOpen size={14} />
                            Ver Reservas
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredUsers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No se encontraron usuarios
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Formulario de crear/editar */}
      <UserFormDialog
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        user={selectedUser}
        onSubmit={handleSubmit}
        isLoading={isFormLoading}
      />

      {/* Confirmación de eliminación */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario "
              {userToDelete?.firstName} {userToDelete?.lastName}". Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de reservas del usuario */}
      <UserReservationsDialog
        open={!!reservationsDialogUser}
        onOpenChange={() => setReservationsDialogUser(null)}
        userId={reservationsDialogUser?.id || null}
        userName={reservationsDialogUser?.name}
      />
    </>
  );
};

export default UsersPage;
