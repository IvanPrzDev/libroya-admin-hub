import { api } from "./api";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types";

const BASE_PATH = "/admin/users";

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>(BASE_PATH);
  return data;
};

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await api.get<User>(`${BASE_PATH}/${id}`);
  return data;
};

export const createUser = async (user: CreateUserRequest): Promise<User> => {
  const { data } = await api.post<User>(BASE_PATH, user);
  return data;
};

export const updateUser = async (
  id: string,
  user: UpdateUserRequest
): Promise<User> => {
  const { data } = await api.patch<User>(`${BASE_PATH}/${id}`, user);
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`${BASE_PATH}/${id}`);
};
