import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types";
import { BOOK_GENRES } from "@/constants/books";
import { Button } from "@/components/ui/button";
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
import { bookSchema, type BookFormValues } from "@/validations/book";

interface BookFormProps {
  book?: Book | null;
  onSubmit: (data: CreateBookRequest | UpdateBookRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  isOpen: boolean;
}

const BookForm = ({
  book,
  onSubmit,
  onCancel,
  isLoading,
  isOpen,
}: BookFormProps) => {
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

  useEffect(() => {
    if (isOpen) {
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
  }, [book, isOpen, form]);

  const handleSubmit = async (values: BookFormValues) => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            {isLoading
              ? "Guardando..."
              : isEditing
                ? "Guardar Cambios"
                : "Crear Libro"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
