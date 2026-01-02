import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Book, BookGenre, CreateBookRequest, UpdateBookRequest } from "@/types";
import { BOOK_GENRES } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Schema de validación
const bookSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  author: z.string().min(1, "El autor es obligatorio"),
  isbn: z.string().optional(),
  publishedYear: z.coerce
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1)
    .optional()
    .or(z.literal("")),
  genre: z.string().optional(),
  description: z.string().optional(),
  available: z.boolean().default(true),
  availabilityReason: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

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

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      publishedYear: "" as number | "",
      genre: "",
      description: "",
      available: true,
      availabilityReason: "",
    },
  });

  // Resetear el formulario cuando cambia el libro o se abre el diálogo
  useEffect(() => {
    if (open) {
      form.reset({
        title: book?.title || "",
        author: book?.author || "",
        isbn: book?.isbn || "",
        publishedYear: (book?.publishedYear || "") as number | "",
        genre: book?.genre || "",
        description: book?.description || "",
        available: book?.available ?? true,
        availabilityReason: book?.availabilityReason || "",
      });
    }
  }, [book, open, form]);

  const handleSubmit = async (values: BookFormValues) => {
    // Limpiar valores vacíos
    const cleanedData: Record<string, unknown> = {
      title: values.title,
      author: values.author,
    };

    if (values.isbn) cleanedData.isbn = values.isbn;
    if (values.publishedYear)
      cleanedData.publishedYear = Number(values.publishedYear);
    if (values.genre) cleanedData.genre = values.genre;
    if (values.description) cleanedData.description = values.description;
    cleanedData.available = values.available;
    if (!values.available && values.availabilityReason) {
      cleanedData.availabilityReason = values.availabilityReason;
    }

    await onSubmit(cleanedData as CreateBookRequest | UpdateBookRequest);
    form.reset();
  };

  const watchAvailable = form.watch("available");

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Título */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="El Gran Gatsby" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Autor */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Autor *</FormLabel>
                    <FormControl>
                      <Input placeholder="F. Scott Fitzgerald" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ISBN */}
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="978-0743273565" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Año */}
              <FormField
                control={form.control}
                name="publishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año de Publicación</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1925" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Género */}
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(BOOK_GENRES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descripción */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción del libro..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Disponible */}
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Disponible</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        ¿El libro está disponible para reservar?
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Razón de no disponibilidad */}
              {!watchAvailable && (
                <FormField
                  control={form.control}
                  name="availabilityReason"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Razón de No Disponibilidad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: En reparación, Extraviado, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-libroya-green hover:bg-libroya-green-light"
              >
                {isLoading
                  ? "Guardando..."
                  : isEditing
                  ? "Guardar Cambios"
                  : "Crear Libro"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookFormDialog;
