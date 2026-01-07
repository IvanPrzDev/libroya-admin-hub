import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Check,
  QrCode,
  Edit,
  Trash2,
  Loader2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import ReservationFormDialog from "@/components/forms/ReservationFormDialog";
import QrConfirmDialog from "@/components/dialogs/QrConfirmDialog";
import CancelReservationDialog from "@/components/dialogs/CancelReservationDialog";
import ReservationDetailsDialog from "@/components/dialogs/ReservationDetailsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import * as reservationsService from "@/services/reservationsService";
import * as usersService from "@/services/usersService";
import * as booksService from "@/services/booksService";
import {
  Reservation,
  ReservationStatus,
  UpdateReservationRequest,
  User,
  Book,
} from "@/types";
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_COLORS,
} from "@/utils/constants";
import { getErrorMessage } from "@/services/api";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [books, setBooks] = useState<Record<string, Book>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);
  const [showCorruptedOnly, setShowCorruptedOnly] = useState(false);

  // Estado para dialog de detalles
  const [detailsReservation, setDetailsReservation] =
    useState<Reservation | null>(null);

  // Estados para dialogs
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrReservation, setQrReservation] = useState<Reservation | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(false);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReservation, setCancelReservation] =
    useState<Reservation | null>(null);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [confirmAction, setConfirmAction] = useState<{
    reservation: Reservation;
    action: "complete";
  } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

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

  // Handlers para edición
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
        data
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

  // Handler para confirmar por QR
  const handleOpenQr = (reservation: Reservation) => {
    setQrReservation(reservation);
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

  // Handler para cancelar
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
        reason
      );
      toast({
        title: "Reserva cancelada",
        description: "La reserva se canceló correctamente.",
      });
      setIsCancelOpen(false);
      await loadReservations();
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      const axiosError = error as { response?: { data?: unknown } };
      console.error("Backend response:", axiosError.response?.data);
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
    setConfirmAction({ reservation, action: "complete" });
  };

  const handleConfirmComplete = async () => {
    if (!confirmAction) return;

    try {
      setIsActionLoading(true);
      await reservationsService.completeReservation(
        confirmAction.reservation._id
      );
      toast({
        title: "Reserva completada",
        description: "La reserva se marcó como completada.",
      });
      setConfirmAction(null);
      await loadReservations();
    } catch (error) {
      console.error("Error al completar reserva:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
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
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      console.error("Error al eliminar reserva:", error);
      toast({
        title: "Error al eliminar",
        description:
          axiosError.response?.data?.message || getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM, yyyy", { locale: es });
  };

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

  const canConfirm = (status: ReservationStatus) => status === "PENDING";
  const canComplete = (status: ReservationStatus) => status === "CONFIRMED";
  const canCancel = (status: ReservationStatus) =>
    status === "PENDING" || status === "CONFIRMED";

  // Calcular días restantes y estado de urgencia
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

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    placeholder="Buscar por usuario o libro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Estados</SelectItem>
                    {Object.entries(RESERVATION_STATUSES).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtros adicionales */}
              <div className="flex items-center gap-4">
                <Button
                  variant={showExpiringSoon ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowExpiringSoon(!showExpiringSoon)}
                  className={
                    showExpiringSoon ? "bg-orange-500 hover:bg-orange-600" : ""
                  }
                >
                  <AlertTriangle size={14} className="mr-2" />
                  Solo próximas a vencer
                </Button>
                <Button
                  variant={showCorruptedOnly ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setShowCorruptedOnly(!showCorruptedOnly)}
                >
                  <AlertTriangle size={14} className="mr-2" />
                  Solo corrompidas
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
              </div>
            ) : (
              <div className="rounded-md border">
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
                    {filteredReservations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No se encontraron reservas
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReservations.map((reservation) => {
                        const expiring = isExpiringSoon(
                          reservation.endDate,
                          reservation.status
                        );
                        const overdue = isOverdue(
                          reservation.endDate,
                          reservation.status
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
                                    Vence en {daysLeft} día
                                    {daysLeft !== 1 ? "s" : ""}
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
                              <div className="flex items-center justify-end gap-2">
                                {/* Confirmar por QR */}
                                {canConfirm(reservation.status) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenQr(reservation)}
                                    className="gap-1"
                                  >
                                    <QrCode size={14} />
                                    Confirmar
                                  </Button>
                                )}

                                {/* Completar */}
                                {canComplete(reservation.status) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleComplete(reservation)}
                                    className="gap-1 text-libroya-success border-libroya-success hover:bg-libroya-success/10"
                                  >
                                    <CheckCircle size={14} />
                                    Completar
                                  </Button>
                                )}

                                {/* Menú de opciones */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal size={16} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setDetailsReservation(reservation)
                                      }
                                    >
                                      <Eye size={14} className="mr-2" />
                                      Ver Detalles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleOpenEdit(reservation)
                                      }
                                    >
                                      <Edit size={14} className="mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    {canCancel(reservation.status) && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleOpenCancel(reservation)
                                        }
                                        className="text-destructive"
                                      >
                                        <XCircle size={14} className="mr-2" />
                                        Cancelar
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setReservationToDelete(reservation)
                                      }
                                      className="text-destructive"
                                    >
                                      <Trash2 size={14} className="mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
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
      <CancelReservationDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        onCancel={handleCancelSubmit}
        isLoading={isCancelLoading}
        reservationInfo={
          cancelReservation
            ? {
                bookTitle: getBookTitle(cancelReservation),
                userName: getUserName(cancelReservation),
              }
            : undefined
        }
      />

      {/* Confirmación de completar */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Completar reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto marcará la reserva como completada y el libro volverá a estar
              disponible para nuevas reservas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmComplete}
              disabled={isActionLoading}
              className="bg-libroya-green hover:bg-libroya-green-light"
            >
              {isActionLoading ? "Completando..." : "Completar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmación de eliminación */}
      <AlertDialog
        open={!!reservationToDelete}
        onOpenChange={() => setReservationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la reserva. Esta acción no
              se puede deshacer.
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
