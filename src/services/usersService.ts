import { api } from "@/config/axios";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types";
import { USERS_ENDPOINTS } from "@/constants/endpoints";

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>(USERS_ENDPOINTS.BASE);
  return data;
};

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await api.get<User>(USERS_ENDPOINTS.BY_ID(id));
  return data;
};

export const createUser = async (user: CreateUserRequest): Promise<User> => {
  const { data } = await api.post<User>(USERS_ENDPOINTS.BASE, user);
  return data;
};

export const updateUser = async (
  id: string,
  user: UpdateUserRequest,
): Promise<User> => {
  const { data } = await api.patch<User>(USERS_ENDPOINTS.BY_ID(id), user);
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(USERS_ENDPOINTS.BY_ID(id));
};
