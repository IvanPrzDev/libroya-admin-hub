import { AuthContextType, AuthProviderProps } from "@/types";
import { useAuthProvider } from "@/hooks/use-auth-provider";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthProvider();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
