import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";
import UserFormDialog from "@/components/dialogs/UserFormDialog";
import UserReservationsDialog from "@/components/dialogs/UserReservationsDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import UsersFilters from "@/components/users/UsersFilters";
import UsersGrid from "@/components/users/UsersGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as usersService from "@/services/usersService";
import * as reservationsService from "@/services/reservationsService";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
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
        }),
      );

      setUserReservationCounts(counts);
    } catch (error) {
      console.error("Error al cargar conteos de reservas:", error);
    }
  }, [users]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    document.title = "Usuarios | LibroYa Admin";
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
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? user.isActive === true
          : user.isActive === false;
    return matchesSearch && matchesRole && matchesStatus;
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
          data as UpdateUserRequest,
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

            <div className="mt-4">
              <UsersFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </div>
          </CardHeader>

          <CardContent>
            <UsersGrid
              users={filteredUsers}
              isLoading={isLoading}
              userReservationCounts={userReservationCounts}
              onEdit={handleOpenForm}
              onDelete={setUserToDelete}
              onViewReservations={(userId, userName) =>
                setReservationsDialogUser({ id: userId, name: userName })
              }
            />
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
      <ConfirmDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
        title="¿Estás seguro?"
        description={`Esta acción eliminará permanentemente al usuario "${userToDelete?.firstName} ${userToDelete?.lastName}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />

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
