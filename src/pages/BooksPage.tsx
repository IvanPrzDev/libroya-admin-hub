import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";
import BookFormDialog from "@/components/dialogs/BookFormDialog";
import BookReservationsDialog from "@/components/dialogs/BookReservationsDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import BooksFilters from "@/components/books/BooksFilters";
import BooksGrid from "@/components/books/BooksGrid";
import BooksPagination from "@/components/books/BooksPagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useBooks } from "@/hooks/queries/booksHooks";
import * as booksService from "@/services/booksService";
import * as reservationsService from "@/services/reservationsService";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";

const BooksPage = () => {
  // Paginación
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filtros locales (en frontend hasta que se implemente en backend)
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");

  // Query para obtener libros paginados
  const { data, isLoading, refetch } = useBooks(page, limit);
  const books = useMemo(() => data?.data || [], [data?.data]);
  const paginationMeta = data?.meta;

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

  // Configurar título al montar
  useEffect(() => {
    document.title = "Libros | LibroYa Admin";
  }, []);

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
                (r) => r.status === "PENDING" || r.status === "CONFIRMED",
              ).length,
            };
          } catch (error) {
            counts[book._id] = { total: 0, active: 0 };
          }
        }),
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
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = genreFilter === "all" || book.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [books, searchTerm, genreFilter]);

  // Handlers de paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

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
          data as UpdateBookRequest,
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
      await refetch();
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
      await refetch();
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
                    : `${paginationMeta?.total || 0} libros en la biblioteca`}
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

            <div className="mt-4">
              <BooksFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                genreFilter={genreFilter}
                onGenreFilterChange={setGenreFilter}
              />
            </div>
          </CardHeader>

          <CardContent>
            <BooksGrid
              books={filteredBooks}
              isLoading={isLoading}
              bookReservationCounts={bookReservationCounts}
              onEdit={handleOpenForm}
              onDelete={setBookToDelete}
              onViewReservations={(bookId, bookTitle) =>
                setReservationsDialogBook({ id: bookId, title: bookTitle })
              }
            />

            {/* Componente de paginación */}
            {paginationMeta && !isLoading && (
              <BooksPagination
                meta={paginationMeta}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
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
      <ConfirmDialog
        open={!!bookToDelete}
        onOpenChange={() => setBookToDelete(null)}
        title="¿Estás seguro?"
        description={`Esta acción eliminará permanentemente el libro "${bookToDelete?.title}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />

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
