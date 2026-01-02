import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  BookOpen,
  User,
  Calendar,
  Tag,
  Loader2,
  List,
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import BookFormDialog from "@/components/forms/BookFormDialog";
import BookReservationsDialog from "@/components/dialogs/BookReservationsDialog";
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
import * as booksService from "@/services/booksService";
import * as reservationsService from "@/services/reservationsService";
import { Book, BookGenre, CreateBookRequest, UpdateBookRequest } from "@/types";
import { BOOK_GENRES } from "@/utils/constants";
import { getErrorMessage } from "@/services/api";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [reservationsDialogBook, setReservationsDialogBook] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [bookReservationCounts, setBookReservationCounts] = useState<
    Record<string, { total: number; active: number }>
  >({});
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const loadBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await booksService.getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error al cargar libros:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Cargar libros al montar el componente
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const loadReservationCounts = useCallback(async () => {
    try {
      const counts: Record<string, { total: number; active: number }> = {};

      // Cargar reservas para cada libro
      await Promise.all(
        books.map(async (book) => {
          try {
            const reservations =
              await reservationsService.getReservationsByBook(book._id);
            counts[book._id] = {
              total: reservations.length,
              active: reservations.filter(
                (r) => r.status === "PENDING" || r.status === "CONFIRMED"
              ).length,
            };
          } catch (error) {
            counts[book._id] = { total: 0, active: 0 };
          }
        })
      );

      setBookReservationCounts(counts);
    } catch (error) {
      console.error("Error al cargar conteos de reservas:", error);
    }
  }, [books]);

  // Cargar conteos de reservas cuando cambien los libros
  useEffect(() => {
    if (books.length > 0) {
      loadReservationCounts();
    }
  }, [books, loadReservationCounts]);

  // Filtrar libros localmente
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === "all" || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  // Handlers para crear/editar
  const handleOpenForm = (book?: Book) => {
    setSelectedBook(book || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedBook(null);
  };

  const handleSubmit = async (data: CreateBookRequest | UpdateBookRequest) => {
    try {
      setIsFormLoading(true);

      if (selectedBook) {
        await booksService.updateBook(
          selectedBook._id,
          data as UpdateBookRequest
        );
        toast({
          title: "Libro actualizado",
          description: "Los cambios se guardaron correctamente.",
        });
      } else {
        await booksService.createBook(data as CreateBookRequest);
        toast({
          title: "Libro creado",
          description: "El libro se agregó correctamente.",
        });
      }

      handleCloseForm();
      await loadBooks();
    } catch (error) {
      console.error("Error al guardar libro:", error);
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
    if (!bookToDelete) return;

    try {
      setIsDeleting(true);
      await booksService.deleteBook(bookToDelete._id);
      toast({
        title: "Libro eliminado",
        description: "El libro se eliminó correctamente.",
      });
      setBookToDelete(null);
      await loadBooks();
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getAvailabilityColor = (available: boolean) => {
    return available
      ? "bg-libroya-success/15 text-libroya-success border-libroya-success/30"
      : "bg-libroya-error/15 text-libroya-error border-libroya-error/30";
  };

  const getAvailabilityText = (available: boolean) => {
    return available ? "Disponible" : "No disponible";
  };

  return (
    <>
      <AdminHeader title="Libros" />

      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Catálogo de Libros
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {isLoading
                    ? "Cargando..."
                    : `${books.length} libros en la biblioteca`}
                </p>
              </div>
              <Button
                onClick={() => handleOpenForm()}
                className="gap-2 bg-libroya-green hover:bg-libroya-green-light"
              >
                <Plus size={16} />
                Agregar Libro
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Buscar por título, autor o ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-44">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Géneros</SelectItem>
                  {Object.entries(BOOK_GENRES).map(([key, label]) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBooks.map((book, index) => (
                  <Card
                    key={book._id}
                    className="border shadow-sm hover:shadow-card transition-all duration-300 overflow-hidden animate-fade-in group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative h-40 overflow-hidden bg-secondary">
                      <img
                        src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-white/90 hover:bg-white"
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenForm(book)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setBookToDelete(book)}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                        {book.title}
                      </h3>

                      <div className="space-y-1.5 text-sm mb-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User size={14} />
                          <span className="truncate">{book.author}</span>
                        </div>
                        {book.genre && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Tag size={14} />
                            <span>{BOOK_GENRES[book.genre as BookGenre]}</span>
                          </div>
                        )}
                        {book.publishedYear && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={14} />
                            <span>{book.publishedYear}</span>
                          </div>
                        )}
                        {bookReservationCounts[book._id]?.total > 0 && (
                          <div className="flex items-center gap-2">
                            <List size={14} className="text-libroya-green" />
                            <span className="text-libroya-green font-medium">
                              {bookReservationCounts[book._id].total} reserva
                              {bookReservationCounts[book._id].total !== 1
                                ? "s"
                                : ""}
                              {bookReservationCounts[book._id].active > 0 && (
                                <span className="ml-1 text-xs">
                                  ({bookReservationCounts[book._id].active}{" "}
                                  activa
                                  {bookReservationCounts[book._id].active !== 1
                                    ? "s"
                                    : ""}
                                  )
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen
                              size={14}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-muted-foreground truncate">
                              {book.isbn || "Sin ISBN"}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getAvailabilityColor(
                              book.available
                            )}`}
                          >
                            {getAvailabilityText(book.available)}
                          </Badge>
                        </div>

                        {/* Botón Ver Historial */}
                        {bookReservationCounts[book._id]?.total > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={() =>
                              setReservationsDialogBook({
                                id: book._id,
                                title: book.title,
                              })
                            }
                          >
                            <List size={14} />
                            Ver Historial
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredBooks.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No se encontraron libros
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Formulario de crear/editar */}
      <BookFormDialog
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        book={selectedBook}
        onSubmit={handleSubmit}
        isLoading={isFormLoading}
      />

      {/* Confirmación de eliminación */}
      <AlertDialog
        open={!!bookToDelete}
        onOpenChange={() => setBookToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el libro "
              {bookToDelete?.title}". Esta acción no se puede deshacer.
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

      {/* Dialog de reservas del libro */}
      <BookReservationsDialog
        open={!!reservationsDialogBook}
        onOpenChange={() => setReservationsDialogBook(null)}
        bookId={reservationsDialogBook?.id || null}
        bookTitle={reservationsDialogBook?.title}
      />
    </>
  );
};

export default BooksPage;
