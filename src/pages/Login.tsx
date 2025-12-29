import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8 animate-scale-in">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-libroya-green text-center mb-8">
            Iniciar Sesión
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary/30 border-border focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Contraseña
                </Label>
                <button
                  type="button"
                  className="text-sm text-libroya-yellow hover:text-libroya-yellow/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-secondary/30 border-border focus-visible:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-libroya-green hover:bg-libroya-green-light text-white font-semibold text-base rounded-xl transition-all duration-200"
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center mt-6 text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <button className="text-libroya-yellow hover:text-libroya-yellow/80 font-medium transition-colors">
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
