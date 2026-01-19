import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from "@/types";
import { USER_ROLES } from "@/constants/users";
import { userSchema, UserFormValues } from "@/validations/user";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  isOpen: boolean;
}

const UserForm = ({
  user,
  onSubmit,
  onCancel,
  isLoading,
  isOpen,
}: UserFormProps) => {
  const isEditing = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "user",
      isActive: true,
    },
  });

  // Resetear el formulario cuando cambia el usuario o se abre el diálogo
  useEffect(() => {
    if (isOpen) {
      form.reset({
        email: user?.email || "",
        password: "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        role: (user?.role || "user") as UserRole,
        isActive: user?.isActive ?? true,
      });
    }
  }, [user, isOpen, form]);

  const handleSubmit = async (values: UserFormValues) => {
    const cleanedData: Record<string, unknown> = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      role: values.role,
      isActive: values.isActive,
    };

    // Solo incluir password si se proporcionó
    if (values.password && values.password.length > 0) {
      cleanedData.password = values.password;
    }

    await onSubmit(cleanedData as CreateUserRequest | UpdateUserRequest);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contraseña */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>
                  Contraseña {isEditing ? "(dejar vacío para no cambiar)" : "*"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={
                      isEditing ? "Nueva contraseña (opcional)" : "Contraseña"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nombre */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido *</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rol */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Rol</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(USER_ROLES).map(([key, label]) => (
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

          {/* Usuario Activo */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Usuario Activo</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    ¿El usuario puede acceder al sistema?
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
                : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
