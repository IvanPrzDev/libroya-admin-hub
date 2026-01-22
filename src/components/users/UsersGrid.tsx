import {
  Loader2,
  MoreHorizontal,
  Mail,
  Calendar,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserRole } from "@/types";
import { USER_ROLES, USER_ROLE_COLORS } from "@/constants/users";
import { formatDate } from "@/utils/dates";

interface UsersGridProps {
  users: User[];
  isLoading: boolean;
  userReservationCounts: Record<string, { total: number; corrupted: number }>;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewReservations: (userId: string, userName: string) => void;
}

const UsersGrid = ({
  users,
  isLoading,
  userReservationCounts,
  onEdit,
  onDelete,
  onViewReservations,
}: UsersGridProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user, index) => (
        <Card
          key={user._id}
          className="border shadow-sm hover:shadow-card transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(user)}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(user)}
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
                    {userReservationCounts[user._id].total !== 1 ? "s" : ""}
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
                  <strong>{userReservationCounts[user._id].corrupted}</strong>{" "}
                  reserva
                  {userReservationCounts[user._id].corrupted !== 1
                    ? "s"
                    : ""}{" "}
                  corrompida
                  {userReservationCounts[user._id].corrupted !== 1 ? "s" : ""}.
                  Usuario bloqueado para nuevas reservas.
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Estado</span>
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
                    onViewReservations(
                      user._id,
                      `${user.firstName} ${user.lastName}`,
                    )
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
  );
};

export default UsersGrid;
