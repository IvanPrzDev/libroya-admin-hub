import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconBgColor?: string;
}

const MetricCard = ({ 
  icon: Icon, 
  value, 
  label, 
  change, 
  changeType = "positive",
  iconBgColor = "bg-libroya-green/10"
}: MetricCardProps) => {
  const changeColors = {
    positive: "text-libroya-success",
    negative: "text-libroya-error",
    neutral: "text-muted-foreground",
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBgColor)}>
          <Icon size={24} className="text-libroya-green" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {change && (
              <span className={cn("text-sm font-medium", changeColors[changeType])}>
                {change}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
