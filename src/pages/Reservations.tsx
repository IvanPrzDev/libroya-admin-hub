import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";
import ReservationFormDialog from "@/components/dialogs/ReservationFormDialog";
import QrConfirmDialog from "@/components/dialogs/QrConfirmDialog";
import CancelReservationDialog from "@/components/dialogs/CancelReservationDialog";
import ReservationDetailsDialog from "@/components/dialogs/ReservationDetailsDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import ReservationsFilters from "@/components/reservations/ReservationsFilters";
import ReservationsTable from "@/components/reservations/ReservationsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as reservationsService from "@/services/reservationsService";
import * as usersService from "@/services/usersService";
import * as booksService from "@/services/booksService";
import { Reservation, UpdateReservationRequest, User, Book } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { differenceInDays } from "date-fns";

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [books, setBooks] = useState<Record<string, Book>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);
  const [showCorruptedOnly, setShowCorruptedOnly] = useState(false);

  // Estados para dialogs
  const [detailsReservation, setDetailsReservation] =
    useState<Reservation | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isQrLoading, setIsQrLoading] = useState(false);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReservation, setCancelReservation] =
    useState<Reservation | null>(null);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const [reservationToComplete, setReservationToComplete] =
    useState<Reservation | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const loadReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reservationsService.getAllReservations();
      setReservations(data);

      // Obtener IDs únicos de usuarios y libros
      const userIds = [...new Set(data.map((r) => r.userId))];
      const bookIds = [...new Set(data.map((r) => r.bookId))];

      // Cargar usuarios y libros en paralelo
      const [usersData, booksData] = await Promise.all([
        Promise.all(userIds.map((id) => usersService.getUserById(id))),
        Promise.all(bookIds.map((id) => booksService.getBookById(id))),
      ]);

      // Convertir a diccionarios para acceso rápido
      setUsers(Object.fromEntries(usersData.map((u) => [u._id, u])));
      setBooks(Object.fromEntries(booksData.map((b) => [b._id, b])));
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Cargar reservas al montar
  useEffect(() => {
    document.title = "Reservas | LibroYa Admin";
    loadReservations();
  }, [loadReservations]);

  const filteredReservations = reservations.filter((reservation) => {
    const user = users[reservation.userId];
    const book = books[reservation.bookId];

    const matchesSearch =
      (user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (book?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;

    const matchesExpiringSoon =
      !showExpiringSoon ||
      (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(reservation.endDate);
        endDate.setHours(0, 0, 0, 0);
        const daysUntilReturn = differenceInDays(endDate, today);
        return daysUntilReturn >= 0 && daysUntilReturn <= 3;
      })();

    const matchesCorrupted =
      !showCorruptedOnly || reservation.status === "CORRUPTED";

    return (
      matchesSearch && matchesStatus && matchesExpiringSoon && matchesCorrupted
    );
  });

  // Handlers
  const handleOpenEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (data: UpdateReservationRequest) => {
    if (!selectedReservation) return;

    try {
      setIsFormLoading(true);
      await reservationsService.updateReservation(
        selectedReservation._id,
        data,
      );
      toast({
        title: "Reserva actualizada",
        description: "Los cambios se guardaron correctamente.",
      });
      setIsEditOpen(false);
      await loadReservations();
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleOpenQr = () => {
    setIsQrOpen(true);
  };

  const handleQrConfirm = async (qrData: string) => {
    try {
      setIsQrLoading(true);
      await reservationsService.confirmReservationByQr(qrData.trim());
      toast({
        title: "Reserva confirmada",
        description: "La reserva se confirmó exitosamente.",
      });
      setIsQrOpen(false);
      await loadReservations();
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsQrLoading(false);
    }
  };

  const handleOpenCancel = (reservation: Reservation) => {
    setCancelReservation(reservation);
    setIsCancelOpen(true);
  };

  const handleCancelSubmit = async (reason: string) => {
    if (!cancelReservation) return;

    try {
      setIsCancelLoading(true);
      await reservationsService.cancelReservation(
        cancelReservation._id,
        reason,
      );
      toast({
        title: "Reserva cancelada",
        description: "La reserva se canceló correctamente.",
      });
      setIsCancelOpen(false);
      await loadReservations();
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsCancelLoading(false);
    }
  };

  const handleComplete = (reservation: Reservation) => {
    setReservationToComplete(reservation);
  };

  const handleConfirmComplete = async () => {
    if (!reservationToComplete) return;

    try {
      setIsCompleting(true);
      await reservationsService.completeReservation(reservationToComplete._id);
      toast({
        title: "Reserva completada",
        description: "La reserva se marcó como completada.",
      });
      setReservationToComplete(null);
      await loadReservations();
    } catch (error) {
      console.error("Error al completar reserva:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!reservationToDelete) return;

    try {
      setIsDeleting(true);
      await reservationsService.deleteReservation(reservationToDelete._id);
      toast({
        title: "Reserva eliminada",
        description: "La reserva se eliminó correctamente.",
      });
      setReservationToDelete(null);
      await loadReservations();
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      toast({
        title: "Error al eliminar",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getUserName = (reservation: Reservation) => {
    const user = users[reservation.userId];
    return user
      ? `${user.firstName} ${user.lastName}`
      : "Usuario no encontrado";
  };

  const getBookTitle = (reservation: Reservation) => {
    const book = books[reservation.bookId];
    return book?.title || "Libro no encontrado";
  };

  return (
    <>
      <AdminHeader title="Reservas" />

      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Todas las Reservas
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {isLoading
                    ? "Cargando..."
                    : `${reservations.length} reservas registradas`}
                </p>
              </div>
            </div>

            <ReservationsFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              showExpiringSoon={showExpiringSoon}
              onExpiringSoonChange={setShowExpiringSoon}
              showCorruptedOnly={showCorruptedOnly}
              onCorruptedOnlyChange={setShowCorruptedOnly}
            />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
              </div>
            ) : (
              <ReservationsTable
                reservations={filteredReservations}
                users={users}
                books={books}
                isLoading={isLoading}
                onConfirm={handleOpenQr}
                onComplete={handleComplete}
                onEdit={handleOpenEdit}
                onCancel={handleOpenCancel}
                onDelete={setReservationToDelete}
                onViewDetails={setDetailsReservation}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de edición */}
      {selectedReservation && (
        <ReservationFormDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          reservation={selectedReservation}
          onSubmit={handleEditSubmit}
          isLoading={isFormLoading}
        />
      )}

      {/* Dialog de confirmación por QR */}
      <QrConfirmDialog
        open={isQrOpen}
        onOpenChange={setIsQrOpen}
        onConfirm={handleQrConfirm}
        isLoading={isQrLoading}
      />

      {/* Dialog de cancelación */}
      {cancelReservation && (
        <CancelReservationDialog
          open={isCancelOpen}
          onOpenChange={setIsCancelOpen}
          onCancel={handleCancelSubmit}
          isLoading={isCancelLoading}
          reservationInfo={{
            bookTitle: getBookTitle(cancelReservation),
            userName: getUserName(cancelReservation),
          }}
        />
      )}

      {/* Confirmación de completar */}
      <ConfirmDialog
        open={!!reservationToComplete}
        onOpenChange={() => setReservationToComplete(null)}
        title="¿Completar reserva?"
        description="Esto marcará la reserva como completada y el libro volverá a estar disponible para nuevas reservas."
        confirmText="Completar"
        onConfirm={handleConfirmComplete}
        isLoading={isCompleting}
      />

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={!!reservationToDelete}
        onOpenChange={() => setReservationToDelete(null)}
        title="¿Estás seguro?"
        description="Esta acción eliminará permanentemente la reserva. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />

      {/* Dialog de detalles de reserva */}
      <ReservationDetailsDialog
        open={!!detailsReservation}
        onOpenChange={() => setDetailsReservation(null)}
        reservation={detailsReservation}
      />
    </>
  );
};

export default Reservations;
