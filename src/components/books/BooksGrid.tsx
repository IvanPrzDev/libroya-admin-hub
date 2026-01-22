import {
  Loader2,
  MoreHorizontal,
  User,
  Tag,
  Calendar,
  BookOpen,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, BookGenre } from "@/types";
import { BOOK_GENRES } from "@/constants/books";

interface BooksGridProps {
  books: Book[];
  isLoading: boolean;
  bookReservationCounts: Record<string, { total: number; active: number }>;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onViewReservations: (bookId: string, bookTitle: string) => void;
}

const BooksGrid = ({
  books,
  isLoading,
  bookReservationCounts,
  onEdit,
  onDelete,
  onViewReservations,
}: BooksGridProps) => {
  const getAvailabilityColor = (available: boolean) => {
    return available
      ? "bg-libroya-success/15 text-libroya-success border-libroya-success/30"
      : "bg-libroya-error/15 text-libroya-error border-libroya-error/30";
  };

  const getAvailabilityText = (available: boolean) => {
    return available ? "Disponible" : "No disponible";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No se encontraron libros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book, index) => (
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
                  <DropdownMenuItem onClick={() => onEdit(book)}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(book)}
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
                    {bookReservationCounts[book._id].total !== 1 ? "s" : ""}
                    {bookReservationCounts[book._id].active > 0 && (
                      <span className="ml-1 text-xs">
                        ({bookReservationCounts[book._id].active} activa
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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">
                    {book.isbn || "Sin ISBN"}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs w-fit ${getAvailabilityColor(
                    book.available,
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
                  onClick={() => onViewReservations(book._id, book.title)}
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
  );
};

export default BooksGrid;
