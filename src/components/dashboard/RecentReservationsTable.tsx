import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_COLORS,
} from "@/constants/reservations";

interface Reservation {
  _id: string;
  userId: string;
  bookId: string;
  status: string;
  createdAt: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Book {
  title: string;
  author: string;
}

interface RecentReservationsTableProps {
  recentReservations: Reservation[];
  users: Record<string, User>;
  books: Record<string, Book>;
  formatDate: (date: string) => string;
}

export default function RecentReservationsTable({
  recentReservations,
  users,
  books,
  formatDate,
}: RecentReservationsTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Últimas Reservas
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/reservations")}
          >
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentReservations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay reservas registradas
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30">
                    <TableHead className="font-semibold">Usuario</TableHead>
                    <TableHead className="font-semibold">Libro</TableHead>
                    <TableHead className="font-semibold">Fecha</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReservations.map((reservation, index) => {
                    const user = users[reservation.userId];
                    const book = books[reservation.bookId];

                    return (
                      <TableRow
                        key={reservation._id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-libroya-green/20 text-libroya-green text-sm">
                                {user
                                  ? `${user.firstName[0]}${user.lastName[0]}`
                                  : "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {user
                                  ? `${user.firstName} ${user.lastName}`
                                  : "Cargando..."}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user?.email || ""}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {book?.title || "Cargando..."}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {book?.author || ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(reservation.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              RESERVATION_STATUS_COLORS[reservation.status]
                                .badge
                            }
                          >
                            {RESERVATION_STATUSES[reservation.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/reservations")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-3">
              {recentReservations.map((reservation, index) => {
                const user = users[reservation.userId];
                const book = books[reservation.bookId];

                return (
                  <div
                    key={reservation._id}
                    className="bg-secondary/30 rounded-lg p-4 space-y-3 animate-fade-in border"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Usuario */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-libroya-green/20 text-libroya-green text-sm">
                          {user
                            ? `${user.firstName[0]}${user.lastName[0]}`
                            : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground font-medium mb-0.5">
                          Usuario
                        </div>
                        <p className="font-medium text-foreground truncate">
                          {user
                            ? `${user.firstName} ${user.lastName}`
                            : "Cargando..."}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                    {/* Libro */}
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-1">
                        Libro
                      </div>
                      <p className="font-medium text-foreground">
                        {book?.title || "Cargando..."}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {book?.author || ""}
                      </p>
                    </div>

                    {/* Fecha y Estado */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground font-medium mb-1">
                          Fecha
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(reservation.createdAt)}
                        </p>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            RESERVATION_STATUS_COLORS[reservation.status].badge
                          }
                        >
                          {RESERVATION_STATUSES[reservation.status]}
                        </Badge>
                      </div>
                    </div>

                    {/* Acción */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/reservations")}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
