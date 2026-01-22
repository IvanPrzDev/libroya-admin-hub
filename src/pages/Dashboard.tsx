import { useState, useEffect, useCallback } from "react";
import { CalendarCheck, Users, BookOpen, Clock, Loader2 } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";
import MetricCard from "@/components/core/MetricCard";
import DashboardAlerts from "@/components/dashboard/DashboardAlerts";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentReservationsTable from "@/components/dashboard/RecentReservationsTable";
import StatusDistributionCard from "@/components/dashboard/StatusDistributionCard";
import TopBooksCard from "@/components/dashboard/TopBooksCard";
import TopUsersCard from "@/components/dashboard/TopUsersCard";
import { useToast } from "@/hooks/use-toast";
import * as reservationsService from "@/services/reservationsService";
import * as usersService from "@/services/usersService";
import * as booksService from "@/services/booksService";
import { Reservation, User, Book } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { formatDate } from "@/utils/dates";
import { format, differenceInDays, differenceInHours, subDays } from "date-fns";

const Dashboard = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [books, setBooks] = useState<Record<string, Book>>({});
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
    (r) => r.status === "PENDING",
  );
  const confirmedReservations = reservations.filter(
    (r) => r.status === "CONFIRMED",
  );
  const completedReservations = reservations.filter(
    (r) => r.status === "COMPLETED",
  );
  const corruptedReservations = reservations.filter(
    (r) => r.status === "CORRUPTED",
  );

  const pendingAboutToExpire = pendingReservations.filter((r) => {
    const hoursSinceCreated = differenceInHours(
      new Date(),
      new Date(r.createdAt),
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
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  // Top 3 libros más reservados
  const bookReservationCount = reservations.reduce(
    (acc, r) => {
      acc[r.bookId] = (acc[r.bookId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topBooks = Object.entries(bookReservationCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([bookId, count]) => ({ bookId, count }));

  // Top 3 usuarios más activos
  const userReservationCount = reservations.reduce(
    (acc, r) => {
      acc[r.userId] = (acc[r.userId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

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
    const date = subDays(new Date(), i);
    const reservationsOnDay = reservations.filter(
      (r) =>
        format(new Date(r.createdAt), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd"),
    );
    return {
      day: format(date, "dd/MM"),
      reservas: reservationsOnDay.length,
    };
  }).reverse();

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
        <DashboardAlerts
          pendingAboutToExpire={pendingAboutToExpire}
          expiringSoon={expiringSoon}
          corruptedReservations={corruptedReservations}
        />

        {/* Gráficos */}
        <DashboardCharts last7Days={last7Days} />

        {/* Tablas y Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <RecentReservationsTable
              recentReservations={recentReservations}
              users={users}
              books={books}
              formatDate={formatDate}
            />
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <StatusDistributionCard pieData={pieData} />
            <TopBooksCard topBooks={topBooks} books={books} />
            <TopUsersCard topUsers={topUsers} users={users} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
