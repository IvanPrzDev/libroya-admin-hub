import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reservation, User, Book } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_COLORS,
} from "@/constants/reservations";
import * as usersService from "@/services/usersService";
import * as booksService from "@/services/booksService";
import { formatDate, formatDateTime } from "@/utils/dates";
import {
  Calendar,
  Clock,
  User as UserIcon,
  BookOpen,
  Loader2,
} from "lucide-react";

interface ReservationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
}

const ReservationDetailsDialog = ({
  open,
  onOpenChange,
  reservation,
}: ReservationDetailsDialogProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!reservation || !open) return;

      try {
        setIsLoading(true);
        const [userData, bookData] = await Promise.all([
          usersService.getUserById(reservation.userId),
          booksService.getBookById(reservation.bookId),
        ]);
        setUser(userData);
        setBook(bookData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [reservation, open]);

  if (!reservation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles de la Reserva</DialogTitle>
          <DialogDescription>
            Información completa de la reserva
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* ID de la reserva */}
            <div>
              <h3 className="text-sm font-medium mb-2">ID de la Reserva</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {reservation._id}
              </code>
            </div>

            {/* Estado */}
            <div>
              <h3 className="text-sm font-medium mb-2">Estado</h3>
              <Badge
                variant="outline"
                className={`${
                  RESERVATION_STATUS_COLORS[reservation.status].badge
                }`}
              >
                {RESERVATION_STATUSES[reservation.status]}
              </Badge>
            </div>

            {/* Usuario */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <UserIcon size={16} />
                Usuario
              </h3>
              <div className="bg-muted rounded-lg p-4">
                {user ? (
                  <>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Cargando usuario...
                  </p>
                )}
              </div>
            </div>

            {/* Libro */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <BookOpen size={16} />
                Libro
              </h3>
              <div className="bg-muted rounded-lg p-4">
                {book ? (
                  <>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Por {book.author}
                    </p>
                    {book.isbn && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ISBN: {book.isbn}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Cargando libro...
                  </p>
                )}
              </div>
            </div>

            {/* Fechas de reserva */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Período de Reserva
              </h3>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Desde:</span>
                  <span className="text-sm font-medium">
                    {formatDate(reservation.startDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hasta:</span>
                  <span className="text-sm font-medium">
                    {formatDate(reservation.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Fechas del sistema */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Clock size={16} />
                Registro del Sistema
              </h3>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Creada:</span>
                  <span className="text-sm font-medium">
                    {formatDateTime(reservation.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Actualizada:
                  </span>
                  <span className="text-sm font-medium">
                    {formatDateTime(reservation.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetailsDialog;
