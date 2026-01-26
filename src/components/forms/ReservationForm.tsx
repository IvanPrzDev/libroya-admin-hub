import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Reservation,
  ReservationStatus,
  User,
  Book,
  UpdateReservationRequest,
} from "@/types";
import { RESERVATION_STATUSES } from "@/constants/reservations";
import {
  reservationFormSchema,
  ReservationFormValues,
} from "@/validations/reservation";
import * as usersService from "@/services/usersService";
import * as booksService from "@/services/booksService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";

interface ReservationFormProps {
  reservation: Reservation;
  onSubmit: (data: UpdateReservationRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  isOpen: boolean;
}

const ReservationForm = ({
  reservation,
  onSubmit,
  onCancel,
  isLoading,
  isOpen,
}: ReservationFormProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      userId: "",
      bookId: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "PENDING",
    },
  });

  // Cargar usuarios y libros al abrir el diálogo
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Resetear el formulario cuando cambia la reserva
  useEffect(() => {
    if (isOpen && reservation) {
      form.reset({
        userId: reservation.userId,
        bookId: reservation.bookId,
        startDate: new Date(reservation.startDate),
        endDate: new Date(reservation.endDate),
        status: reservation.status,
      });
    }
  }, [reservation, isOpen, form]);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const [usersData, booksData] = await Promise.all([
        usersService.getAllUsers(),
        booksService.getAllBooks(),
      ]);
      setUsers(usersData);
      setBooks(booksData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (values: ReservationFormValues) => {
    const data: UpdateReservationRequest = {
      userId: values.userId,
      bookId: values.bookId,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      status: values.status as ReservationStatus,
    };

    await onSubmit(data);
  };

  if (isLoadingData) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Cargando datos...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Usuario */}
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Usuario *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Libro */}
          <FormField
            control={form.control}
            name="bookId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Libro *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un libro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book._id} value={book._id}>
                        <div className="flex items-center gap-2">
                          <span>
                            {book.title} - {book.author}
                          </span>
                          {!book.available && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-destructive/15 text-destructive"
                            >
                              No disponible
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {books.find((b) => b._id === field.value) &&
                    !books.find((b) => b._id === field.value)?.available && (
                      <span className="text-destructive flex items-center gap-1 text-xs">
                        <AlertCircle size={12} />
                        Este libro no está disponible:{" "}
                        {
                          books.find((b) => b._id === field.value)
                            ?.availabilityReason
                        }
                      </span>
                    )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de inicio */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de fin */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Fin *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estado */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Estado *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(RESERVATION_STATUSES).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Cambiar el estado manualmente puede afectar la disponibilidad
                  del libro.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-libroya-green hover:bg-libroya-green-light"
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReservationForm;
