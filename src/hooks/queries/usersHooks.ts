import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as usersService from "@/services/usersService";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types";

// Query Keys
export const USERS_KEYS = {
  all: ["users"] as const,
  lists: () => [...USERS_KEYS.all, "list"] as const,
  list: (filters?: string) => [...USERS_KEYS.lists(), { filters }] as const,
  details: () => [...USERS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USERS_KEYS.details(), id] as const,
};

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_KEYS.lists(),
    queryFn: () => usersService.getAllUsers(),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: USERS_KEYS.detail(id),
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserRequest>({
    mutationFn: (user: CreateUserRequest) => usersService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; data: UpdateUserRequest }>({
    mutationFn: ({ id, data }) => usersService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: USERS_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() });
    },
  });
};
