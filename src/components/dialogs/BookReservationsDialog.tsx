import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Reservation, User } from "@/types";
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_COLORS,
} from "@/constants/reservations";
import * as reservationsService from "@/services/reservationsService";
import * as usersService from "@/services/usersService";
import { formatDate } from "@/utils/dates";

interface BookReservationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string | null;
  bookTitle?: string;
}

const BookReservationsDialog = ({
  open,
  onOpenChange,
  bookId,
  bookTitle,
}: BookReservationsDialogProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadReservations = useCallback(async () => {
    if (!bookId) return;

    try {
      setIsLoading(true);
      const data = await reservationsService.getReservationsByBook(bookId);
      setReservations(data);

      // Cargar usuarios
      const userIds = [...new Set(data.map((r) => r.userId))];
      const usersData = await Promise.all(
        userIds.map((id) => usersService.getUserById(id)),
      );
      setUsers(Object.fromEntries(usersData.map((u) => [u._id, u])));
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (open && bookId) {
      loadReservations();
    }
  }, [open, bookId, loadReservations]);

  const getUserName = (reservation: Reservation) => {
    const user = users[reservation.userId];
    return user
      ? `${user.firstName} ${user.lastName}`
      : "Usuario no encontrado";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservas de "{bookTitle || "Libro"}"</DialogTitle>
          <DialogDescription>
            Historial completo de reservas del libro
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Este libro no tiene reservas
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation._id}>
                    <TableCell>
                      <div className="font-medium">
                        {getUserName(reservation)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(reservation.startDate)}</div>
                        <div className="text-xs text-muted-foreground">
                          hasta {formatDate(reservation.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          RESERVATION_STATUS_COLORS[reservation.status].badge
                        }`}
                      >
                        {RESERVATION_STATUSES[reservation.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookReservationsDialog;
