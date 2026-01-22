import { CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartsProps {
  last7Days: { day: string; reservas: number }[];
}

export default function DashboardCharts({ last7Days }: DashboardChartsProps) {
  return (
    <Card className="shadow-card mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CalendarCheck size={18} className="text-libroya-green" />
          <CardTitle className="text-lg font-semibold">
            Actividad de los Últimos 7 Días
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last7Days}>
            <XAxis
              dataKey="day"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar
              dataKey="reservas"
              fill="hsl(var(--libroya-green))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
