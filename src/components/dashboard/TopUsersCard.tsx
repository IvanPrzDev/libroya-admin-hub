import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface TopUser {
  userId: string;
  count: number;
}

interface TopUsersCardProps {
  topUsers: TopUser[];
  users: Record<string, User>;
}

export default function TopUsersCard({ topUsers, users }: TopUsersCardProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-libroya-yellow" />
          <CardTitle className="text-lg font-semibold">
            Usuarios Más Activos
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay datos suficientes
          </p>
        ) : (
          topUsers.map((item, index) => {
            const user = users[item.userId];
            return (
              <div
                key={item.userId}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors animate-slide-in-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-libroya-yellow/20 text-libroya-yellow text-xs">
                      {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : "Cargando..."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
