import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Users,
  BookOpen,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import MetricCard from "@/components/MetricCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import * as reservationsService from "@/services/reservationsService";
import * as usersService from "@/services/usersService";
import * as booksService from "@/services/booksService";
import { Reservation, User, Book } from "@/types";
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_COLORS,
} from "@/utils/constants";
import { getErrorMessage } from "@/services/api";
import {
  format,
  differenceInDays,
  differenceInHours,
  subDays,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [books, setBooks] = useState<Record<string, Book>>({});
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Cargar todos los datos en paralelo
      const [reservationsData, usersData, booksData] = await Promise.all([
        reservationsService.getAllReservations(),
        usersService.getAllUsers(),
        booksService.getAllBooks(),
      ]);

      setReservations(reservationsData);
      setAllUsers(usersData);
      setAllBooks(booksData);

      // Crear diccionarios para acceso rápido
      const userIds = [...new Set(reservationsData.map((r) => r.userId))];
      const bookIds = [...new Set(reservationsData.map((r) => r.bookId))];

      const [usersDetails, booksDetails] = await Promise.all([
        Promise.all(userIds.map((id) => usersService.getUserById(id))),
        Promise.all(bookIds.map((id) => booksService.getBookById(id))),
      ]);

      setUsers(Object.fromEntries(usersDetails.map((u) => [u._id, u])));
      setBooks(Object.fromEntries(booksDetails.map((b) => [b._id, b])));
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    document.title = "Dashboard | LibroYa Admin";
    loadData();
  }, [loadData]);

  const totalReservations = reservations.length;
  const totalUsers = allUsers.length;
  const totalBooks = allBooks.length;
  const activeUsers = allUsers.filter((u) => u.isActive).length;
  const availableBooks = allBooks.filter((b) => b.available).length;

  const pendingReservations = reservations.filter(
    (r) => r.status === "PENDING"
  );
  const confirmedReservations = reservations.filter(
    (r) => r.status === "CONFIRMED"
  );
  const completedReservations = reservations.filter(
    (r) => r.status === "COMPLETED"
  );
  const corruptedReservations = reservations.filter(
    (r) => r.status === "CORRUPTED"
  );

  const pendingAboutToExpire = pendingReservations.filter((r) => {
    const hoursSinceCreated = differenceInHours(
      new Date(),
      new Date(r.createdAt)
    );
    return hoursSinceCreated >= 20;
  });

  const expiringSoon = confirmedReservations.filter((r) => {
    const daysUntilReturn = differenceInDays(new Date(r.endDate), new Date());
    return daysUntilReturn >= 0 && daysUntilReturn <= 3;
  });

  // Últimas 6 reservas
  const recentReservations = [...reservations]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  // Top 3 libros más reservados
  const bookReservationCount = reservations.reduce((acc, r) => {
    acc[r.bookId] = (acc[r.bookId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBooks = Object.entries(bookReservationCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([bookId, count]) => ({ bookId, count }));

  // Top 3 usuarios más activos
  const userReservationCount = reservations.reduce((acc, r) => {
    acc[r.userId] = (acc[r.userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topUsers = Object.entries(userReservationCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([userId, count]) => ({ userId, count }));

  // Datos para gráfico de dona (distribución por estado)
  const pieData = [
    {
      name: "Pendientes",
      value: pendingReservations.length,
      color: "hsl(var(--libroya-yellow))",
    },
    {
      name: "Confirmadas",
      value: confirmedReservations.length,
      color: "hsl(var(--libroya-green))",
    },
    {
      name: "Completadas",
      value: completedReservations.length,
      color: "hsl(var(--libroya-success))",
    },
    {
      name: "Corruptas",
      value: corruptedReservations.length,
      color: "hsl(var(--libroya-error))",
    },
  ].filter((item) => item.value > 0);

  // Datos para gráfico de barras (últimos 7 días)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = startOfDay(subDays(new Date(), 5 - i));

    const count = reservations.filter((r) => {
      const createdDate = new Date(r.createdAt);
      return createdDate >= dayStart && createdDate < dayEnd;
    }).length;

    return {
      day: format(date, "EEE", { locale: es }),
      date: format(date, "dd MMM", { locale: es }),
      reservas: count,
    };
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM, yyyy", { locale: es });
  };

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Panel de Administración" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-libroya-green" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Panel de Administración" />

      <div className="flex-1 overflow-auto p-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={CalendarCheck}
            value={totalReservations}
            label="Reservas Totales"
            change={`${confirmedReservations.length} activas`}
            changeType="positive"
          />
          <MetricCard
            icon={Users}
            value={totalUsers}
            label="Usuarios"
            change={`${activeUsers} activos`}
            changeType="positive"
          />
          <MetricCard
            icon={BookOpen}
            value={totalBooks}
            label="Libros"
            change={`${availableBooks} disponibles`}
            changeType="positive"
          />
          <MetricCard
            icon={Clock}
            value={pendingReservations.length}
            label="Pendientes"
            change={
              pendingAboutToExpire.length > 0
                ? `${pendingAboutToExpire.length} por expirar`
                : "Todo bien"
            }
            changeType={
              pendingAboutToExpire.length > 0 ? "negative" : "positive"
            }
          />
        </div>

        {/* Alertas */}
        {(pendingAboutToExpire.length > 0 ||
          expiringSoon.length > 0 ||
          corruptedReservations.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {pendingAboutToExpire.length > 0 && (
              <Alert className="border-libroya-warning bg-libroya-warning/10">
                <AlertTriangle className="h-4 w-4 text-libroya-warning" />
                <AlertTitle>Reservas por Expirar</AlertTitle>
                <AlertDescription>
                  {pendingAboutToExpire.length} reservas PENDING con más de 20h
                  sin confirmar
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto ml-2"
                    onClick={() => navigate("/reservations")}
                  >
                    Ver todas
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {expiringSoon.length > 0 && (
              <Alert className="border-libroya-yellow bg-libroya-yellow/10">
                <Clock className="h-4 w-4 text-libroya-yellow" />
                <AlertTitle>Próximas a Vencer</AlertTitle>
                <AlertDescription>
                  {expiringSoon.length} reservas vencen en ≤3 días
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto ml-2"
                    onClick={() => navigate("/reservations")}
                  >
                    Ver todas
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {corruptedReservations.length > 0 && (
              <Alert className="border-libroya-error bg-libroya-error/10">
                <AlertCircle className="h-4 w-4 text-libroya-error" />
                <AlertTitle>Reservas Corruptas</AlertTitle>
                <AlertDescription>
                  {corruptedReservations.length} reservas necesitan atención
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto ml-2"
                    onClick={() => navigate("/reservations")}
                  >
                    Ver todas
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Gráfico de Actividad Semanal */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabla de Últimas Reservas */}
          <div className="lg:col-span-2">
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
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar derecho */}
          <div className="space-y-6">
            {/* Distribución por Estado */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Distribución por Estado
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pieData.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                      {pieData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {item.name}: {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No hay datos de distribución
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Top 3 Libros Más Reservados */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-libroya-green" />
                  <CardTitle className="text-lg font-semibold">
                    Libros Más Reservados
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {topBooks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay datos suficientes
                  </p>
                ) : (
                  topBooks.map((item, index) => {
                    const book = books[item.bookId];
                    return (
                      <div
                        key={item.bookId}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors animate-slide-in-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-libroya-green/20 flex items-center justify-center font-semibold text-libroya-green">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {book?.title || "Cargando..."}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {book?.author || ""}
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

            {/* Top 3 Usuarios Más Activos */}
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
                              {user
                                ? `${user.firstName[0]}${user.lastName[0]}`
                                : "?"}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
