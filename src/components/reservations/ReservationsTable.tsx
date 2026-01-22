import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Reservation, ReservationStatus, User, Book } from "@/types";
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_COLORS,
} from "@/constants/reservations";
import { formatDate } from "@/utils/dates";
import { differenceInDays } from "date-fns";
import ReservationActions from "./ReservationActions";

interface ReservationsTableProps {
  reservations: Reservation[];
  users: Record<string, User>;
  books: Record<string, Book>;
  isLoading: boolean;
  onConfirm: (reservation: Reservation) => void;
  onComplete: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
  onDelete: (reservation: Reservation) => void;
  onViewDetails: (reservation: Reservation) => void;
}

const ReservationsTable = ({
  reservations,
  users,
  books,
  isLoading,
  onConfirm,
  onComplete,
  onEdit,
  onCancel,
  onDelete,
  onViewDetails,
}: ReservationsTableProps) => {
  const getUserName = (reservation: Reservation) => {
    const user = users[reservation.userId];
    return user
      ? `${user.firstName} ${user.lastName}`
      : "Usuario no encontrado";
  };

  const getUserEmail = (reservation: Reservation) => {
    const user = users[reservation.userId];
    return user?.email || "N/A";
  };

  const getBookTitle = (reservation: Reservation) => {
    const book = books[reservation.bookId];
    return book?.title || "Libro no encontrado";
  };

  const getBookAuthor = (reservation: Reservation) => {
    const book = books[reservation.bookId];
    return book?.author || "N/A";
  };

  const getDaysRemaining = (endDate: string) => {
    return differenceInDays(new Date(endDate), new Date());
  };

  const isExpiringSoon = (endDate: string, status: ReservationStatus) => {
    const days = getDaysRemaining(endDate);
    return status === "CONFIRMED" && days <= 3 && days >= 0;
  };

  const isOverdue = (endDate: string, status: ReservationStatus) => {
    const days = getDaysRemaining(endDate);
    return status === "CONFIRMED" && days < 0;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Cargando reservas...
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No se encontraron reservas
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Libro</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => {
              const expiring = isExpiringSoon(
                reservation.endDate,
                reservation.status,
              );
              const overdue = isOverdue(
                reservation.endDate,
                reservation.status,
              );
              const daysLeft = getDaysRemaining(reservation.endDate);
              const isCorrupted = reservation.status === "CORRUPTED";

              return (
                <TableRow
                  key={reservation._id}
                  className={`${
                    isCorrupted
                      ? "bg-destructive/5 border-l-4 border-l-destructive"
                      : overdue
                        ? "bg-orange-50 border-l-4 border-l-orange-500"
                        : expiring
                          ? "bg-yellow-50 border-l-4 border-l-yellow-500"
                          : ""
                  }`}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {getUserName(reservation)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getUserEmail(reservation)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {getBookTitle(reservation)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getBookAuthor(reservation)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <div>{formatDate(reservation.startDate)}</div>
                        <div className="text-xs text-muted-foreground">
                          hasta {formatDate(reservation.endDate)}
                        </div>
                      </div>
                      {/* Indicadores de urgencia */}
                      {expiring && !overdue && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs"
                        >
                          <AlertTriangle size={10} className="mr-1" />
                          Vence en {daysLeft} día{daysLeft !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      {overdue && (
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-800 border-orange-300 text-xs"
                        >
                          <AlertTriangle size={10} className="mr-1" />
                          Vencida ({Math.abs(daysLeft)} día
                          {Math.abs(daysLeft) !== 1 ? "s" : ""})
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className={`${
                          RESERVATION_STATUS_COLORS[
                            reservation.status as ReservationStatus
                          ].badge
                        } ${
                          isCorrupted
                            ? "bg-destructive text-destructive-foreground border-destructive"
                            : ""
                        }`}
                      >
                        {isCorrupted && (
                          <AlertTriangle size={12} className="mr-1" />
                        )}
                        {
                          RESERVATION_STATUSES[
                            reservation.status as ReservationStatus
                          ]
                        }
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Creada: {formatDate(reservation.createdAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <ReservationActions
                      reservation={reservation}
                      onConfirm={onConfirm}
                      onComplete={onComplete}
                      onEdit={onEdit}
                      onCancel={onCancel}
                      onDelete={onDelete}
                      onViewDetails={onViewDetails}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {reservations.map((reservation) => {
          const expiring = isExpiringSoon(
            reservation.endDate,
            reservation.status,
          );
          const overdue = isOverdue(reservation.endDate, reservation.status);
          const daysLeft = getDaysRemaining(reservation.endDate);
          const isCorrupted = reservation.status === "CORRUPTED";

          return (
            <div
              key={reservation._id}
              className={`bg-card rounded-lg border p-4 space-y-3 ${
                isCorrupted
                  ? "border-l-4 border-l-destructive bg-destructive/5"
                  : overdue
                    ? "border-l-4 border-l-orange-500 bg-orange-50"
                    : expiring
                      ? "border-l-4 border-l-yellow-500 bg-yellow-50"
                      : ""
              }`}
            >
              {/* Usuario */}
              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">
                  Usuario
                </div>
                <div className="font-medium">{getUserName(reservation)}</div>
                <div className="text-xs text-muted-foreground">
                  {getUserEmail(reservation)}
                </div>
              </div>

              {/* Libro */}
              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">
                  Libro
                </div>
                <div className="font-medium">{getBookTitle(reservation)}</div>
                <div className="text-xs text-muted-foreground">
                  {getBookAuthor(reservation)}
                </div>
              </div>

              {/* Fechas */}
              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">
                  Fechas
                </div>
                <div className="text-sm">
                  <div>{formatDate(reservation.startDate)}</div>
                  <div className="text-xs text-muted-foreground">
                    hasta {formatDate(reservation.endDate)}
                  </div>
                </div>
                {/* Indicadores de urgencia */}
                {expiring && !overdue && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs mt-1"
                  >
                    <AlertTriangle size={10} className="mr-1" />
                    Vence en {daysLeft} día{daysLeft !== 1 ? "s" : ""}
                  </Badge>
                )}
                {overdue && (
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 border-orange-300 text-xs mt-1"
                  >
                    <AlertTriangle size={10} className="mr-1" />
                    Vencida ({Math.abs(daysLeft)} día
                    {Math.abs(daysLeft) !== 1 ? "s" : ""})
                  </Badge>
                )}
              </div>

              {/* Estado */}
              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">
                  Estado
                </div>
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className={`${
                      RESERVATION_STATUS_COLORS[
                        reservation.status as ReservationStatus
                      ].badge
                    } ${
                      isCorrupted
                        ? "bg-destructive text-destructive-foreground border-destructive"
                        : ""
                    }`}
                  >
                    {isCorrupted && (
                      <AlertTriangle size={12} className="mr-1" />
                    )}
                    {
                      RESERVATION_STATUSES[
                        reservation.status as ReservationStatus
                      ]
                    }
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Creada: {formatDate(reservation.createdAt)}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="pt-2 border-t">
                <ReservationActions
                  reservation={reservation}
                  onConfirm={onConfirm}
                  onComplete={onComplete}
                  onEdit={onEdit}
                  onCancel={onCancel}
                  onDelete={onDelete}
                  onViewDetails={onViewDetails}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ReservationsTable;
