import { Book, Zap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "sidebar";
}

const Logo = ({ size = "md", showText = true, variant = "default" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  const isLight = variant === "sidebar";

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <div className={`absolute inset-0 rounded-lg ${isLight ? "bg-white/20" : "bg-libroya-green"} flex items-center justify-center`}>
          <Book 
            size={iconSizes[size]} 
            className={isLight ? "text-white" : "text-white"} 
            strokeWidth={2.5}
          />
        </div>
        <Zap 
          size={iconSizes[size] * 0.6} 
          className="absolute text-libroya-yellow fill-libroya-yellow z-10"
          style={{ 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}
        />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tight`}>
          <span className={isLight ? "text-white" : "text-libroya-green"}>Libro</span>
          <span className="text-libroya-yellow">Ya</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
