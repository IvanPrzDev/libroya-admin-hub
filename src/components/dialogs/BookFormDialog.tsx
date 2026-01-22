import { Book, CreateBookRequest, UpdateBookRequest } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BookForm from "@/components/forms/BookForm";

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  onSubmit: (data: CreateBookRequest | UpdateBookRequest) => Promise<void>;
  isLoading: boolean;
}

const BookFormDialog = ({
  open,
  onOpenChange,
  book,
  onSubmit,
  isLoading,
}: BookFormDialogProps) => {
  const isEditing = !!book;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Libro" : "Agregar Nuevo Libro"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del libro"
              : "Completa los datos del nuevo libro"}
          </DialogDescription>
        </DialogHeader>

        <BookForm
          book={book}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          isOpen={open}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookFormDialog;
