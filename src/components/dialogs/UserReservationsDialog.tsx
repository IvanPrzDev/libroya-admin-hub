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
import { Reservation, Book } from "@/types";
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_COLORS,
} from "@/utils/constants";
import * as reservationsService from "@/services/reservationsService";
import * as booksService from "@/services/booksService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserReservationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  userName?: string;
}

const UserReservationsDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
}: UserReservationsDialogProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [books, setBooks] = useState<Record<string, Book>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadReservations = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const data = await reservationsService.getReservationsByUser(userId);
      setReservations(data);

      // Cargar libros
      const bookIds = [...new Set(data.map((r) => r.bookId))];
      const booksData = await Promise.all(
        bookIds.map((id) => booksService.getBookById(id))
      );
      setBooks(Object.fromEntries(booksData.map((b) => [b._id, b])));
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open && userId) {
      loadReservations();
    }
  }, [open, userId, loadReservations]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM, yyyy", { locale: es });
  };

  const getBookTitle = (reservation: Reservation) => {
    const book = books[reservation.bookId];
    return book?.title || "Libro no encontrado";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservas de {userName || "Usuario"}</DialogTitle>
          <DialogDescription>
            Historial completo de reservas del usuario
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Este usuario no tiene reservas
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libro</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation._id}>
                    <TableCell>
                      <div className="font-medium">
                        {getBookTitle(reservation)}
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

export default UserReservationsDialog;
