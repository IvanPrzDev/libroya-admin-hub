import { CalendarCheck, Users, BookOpen, Clock, UserPlus, CheckCircle, BookPlus, KeyRound, Filter, Download, Plus, Settings2 } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import ActionButton from "@/components/ActionButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockReservations = [
  { id: 1, user: { name: "Juan Pérez", email: "juan@email.com", avatar: "https://i.pravatar.cc/150?u=1" }, book: { title: "El Gran Gatsby", author: "F. Scott Fitzgerald" }, date: "15 Abr, 2024", status: "pending" as const },
  { id: 2, user: { name: "María López", email: "maria@email.com", avatar: "https://i.pravatar.cc/150?u=2" }, book: { title: "Hábitos Atómicos", author: "James Clear" }, date: "14 Abr, 2024", status: "pending" as const },
  { id: 3, user: { name: "Andrés Castillo", email: "andres@email.com", avatar: "https://i.pravatar.cc/150?u=3" }, book: { title: "Matar a un Ruiseñor", author: "Harper Lee" }, date: "14 Abr, 2024", status: "approved" as const },
  { id: 4, user: { name: "Laura Gómez", email: "laura@email.com", avatar: "https://i.pravatar.cc/150?u=4" }, book: { title: "1984", author: "George Orwell" }, date: "13 Abr, 2024", status: "approved" as const },
  { id: 5, user: { name: "Daniel Vega", email: "daniel@email.com", avatar: "https://i.pravatar.cc/150?u=5" }, book: { title: "El Guardián entre el Centeno", author: "J.D. Salinger" }, date: "13 Abr, 2024", status: "rejected" as const },
  { id: 6, user: { name: "Cristina Ruiz", email: "cristina@email.com", avatar: "https://i.pravatar.cc/150?u=6" }, book: { title: "Dune", author: "Frank Herbert" }, date: "12 Abr, 2024", status: "rejected" as const },
];

const pendingApprovals = [
  { id: 1, name: "Diego Morillo", book: "Seis de Cuervos", avatar: "https://i.pravatar.cc/150?u=10" },
  { id: 2, name: "Mariana Saavedra", book: "Un Mundo Feliz", avatar: "https://i.pravatar.cc/150?u=11" },
  { id: 3, name: "Raúl Jiménez", book: "Fortaleza Digital", avatar: "https://i.pravatar.cc/150?u=12" },
];

const recentActivity = [
  { id: 1, icon: UserPlus, text: "Nuevo usuario registrado: Raúl Jiménez", time: "Hace 2 horas", color: "text-libroya-green" },
  { id: 2, icon: CheckCircle, text: "Reserva de Laura Gómez confirmada", time: "Hace 3 horas", color: "text-libroya-success" },
  { id: 3, icon: BookPlus, text: "Cuatro libros nuevos añadidos", time: "Hace 2 horas", color: "text-libroya-yellow" },
  { id: 4, icon: KeyRound, text: "Alfredo Gutierrez cambió su contraseña", time: "Hace 16 horas", color: "text-libroya-error" },
];

const Dashboard = () => {
  return (
    <>
      <AdminHeader title="Panel de Administración" />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            icon={CalendarCheck} 
            value={128} 
            label="Reservas" 
            change="+46" 
            changeType="positive" 
          />
          <MetricCard 
            icon={Users} 
            value={732} 
            label="Usuarios" 
            change="+8" 
            changeType="positive" 
          />
          <MetricCard 
            icon={BookOpen} 
            value={380} 
            label="Libros" 
            change="+4 nuevos" 
            changeType="positive" 
          />
          <MetricCard 
            icon={Clock} 
            value={56} 
            label="Pendientes" 
            change="+12 nuevos" 
            changeType="positive" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Reservas de Libros</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter size={14} />
                      Todas las Reservas
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download size={14} />
                      Exportar
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Todas las Reservas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las Reservas</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="approved">Aprobadas</SelectItem>
                      <SelectItem value="rejected">Rechazadas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon">
                    <Settings2 size={18} />
                  </Button>
                  <Button className="ml-auto gap-2 bg-libroya-green hover:bg-libroya-green-light">
                    <Plus size={16} />
                    Nueva Reserva
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/30">
                      <TableHead className="font-semibold">Usuario</TableHead>
                      <TableHead className="font-semibold">Libro</TableHead>
                      <TableHead className="font-semibold">Fecha</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReservations.map((reservation, index) => (
                      <TableRow 
                        key={reservation.id} 
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={reservation.user.avatar} />
                              <AvatarFallback className="bg-libroya-green/20 text-libroya-green text-sm">
                                {reservation.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{reservation.user.name}</p>
                              <p className="text-xs text-muted-foreground">{reservation.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{reservation.book.title}</p>
                            <p className="text-xs text-muted-foreground">{reservation.book.author}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{reservation.date}</TableCell>
                        <TableCell>
                          <StatusBadge status={reservation.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ActionButton variant="approve" />
                            {reservation.status !== "approved" && (
                              <ActionButton variant="reject" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pending Approvals */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Aprobaciones Pendientes</CardTitle>
                  <span className="text-3xl font-bold text-libroya-green">56</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full mt-2">
                  <div className="w-3/4 h-full bg-libroya-yellow rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingApprovals.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors animate-slide-in-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback className="bg-libroya-green/20 text-libroya-green text-xs">
                          {item.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.book}</p>
                      </div>
                    </div>
                    <ActionButton variant={index === 0 ? "approve" : "reject"} size="sm" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-3 animate-slide-in-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}>
                      <activity.icon size={16} className={activity.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
