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
  { id: 1, user: { name: "Juan Perez", email: "juan@email.com", avatar: "https://i.pravatar.cc/150?u=1" }, book: { title: "The Great Gatsby", author: "F. Scott Fitzgerald" }, date: "Apr 15, 2024", status: "pending" as const },
  { id: 2, user: { name: "Maria Lopez", email: "maria@email.com", avatar: "https://i.pravatar.cc/150?u=2" }, book: { title: "Atomic Habits", author: "James Clear" }, date: "Apr 14, 2024", status: "pending" as const },
  { id: 3, user: { name: "Andres Castillo", email: "andres@email.com", avatar: "https://i.pravatar.cc/150?u=3" }, book: { title: "To Kill a Mockingbird", author: "Harper Lee" }, date: "Apr 14, 2024", status: "approved" as const },
  { id: 4, user: { name: "Laura Gómez", email: "laura@email.com", avatar: "https://i.pravatar.cc/150?u=4" }, book: { title: "1984", author: "George Orwell" }, date: "Apr 13, 2024", status: "approved" as const },
  { id: 5, user: { name: "Daniel Vega", email: "daniel@email.com", avatar: "https://i.pravatar.cc/150?u=5" }, book: { title: "The Catcher in the Rye", author: "J.D. Salinger" }, date: "Apr 13, 2024", status: "rejected" as const },
  { id: 6, user: { name: "Cristina Ruiz", email: "cristina@email.com", avatar: "https://i.pravatar.cc/150?u=6" }, book: { title: "Dune", author: "Frank Herbert" }, date: "Apr 12, 2024", status: "rejected" as const },
];

const pendingApprovals = [
  { id: 1, name: "Diego Morillo", book: "Six of Crows", avatar: "https://i.pravatar.cc/150?u=10" },
  { id: 2, name: "Mariana Saavedra", book: "Brave New World", avatar: "https://i.pravatar.cc/150?u=11" },
  { id: 3, name: "Raul Jimenez", book: "Digital Fortress", avatar: "https://i.pravatar.cc/150?u=12" },
];

const recentActivity = [
  { id: 1, icon: UserPlus, text: "New user registered, Raul Jimenez", time: "2 hours ago", color: "text-libroya-green" },
  { id: 2, icon: CheckCircle, text: "Laura Gómez reservation confirmed", time: "3 hours ago", color: "text-libroya-success" },
  { id: 3, icon: BookPlus, text: "Four new books added to the library", time: "2 hours ago", color: "text-libroya-yellow" },
  { id: 4, icon: KeyRound, text: "Alfredo Gutierrez password changed", time: "16 hours ago", color: "text-libroya-error" },
];

const Dashboard = () => {
  return (
    <>
      <AdminHeader title="Admin Dashboard" />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            icon={CalendarCheck} 
            value={128} 
            label="Reservations" 
            change="+46" 
            changeType="positive" 
          />
          <MetricCard 
            icon={Users} 
            value={732} 
            label="Users" 
            change="+8" 
            changeType="positive" 
          />
          <MetricCard 
            icon={BookOpen} 
            value={380} 
            label="Books" 
            change="+4 added" 
            changeType="positive" 
          />
          <MetricCard 
            icon={Clock} 
            value={56} 
            label="Pending" 
            change="+12 new" 
            changeType="positive" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Book Reservations</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter size={14} />
                      All Reservations
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download size={14} />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Reservations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reservations</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon">
                    <Settings2 size={18} />
                  </Button>
                  <Button className="ml-auto gap-2 bg-libroya-green hover:bg-libroya-green-light">
                    <Plus size={16} />
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/30">
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Book</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
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
                  <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
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
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
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
