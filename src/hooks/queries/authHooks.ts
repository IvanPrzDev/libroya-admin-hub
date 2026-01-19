import { useMutation } from "@tanstack/react-query";
import * as authService from "@/services/authService";
import { LoginRequest, LoginResponse } from "@/types";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
  });
};
