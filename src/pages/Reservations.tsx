import { useState } from "react";
import { Search, Filter, Download, Plus, MoreHorizontal } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import StatusBadge from "@/components/StatusBadge";
import ActionButton from "@/components/ActionButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const mockReservations = [
  { id: 1, user: { name: "Juan Perez", email: "juan@email.com", avatar: "https://i.pravatar.cc/150?u=1" }, book: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565" }, date: "Apr 15, 2024", dueDate: "Apr 29, 2024", status: "pending" as const },
  { id: 2, user: { name: "Maria Lopez", email: "maria@email.com", avatar: "https://i.pravatar.cc/150?u=2" }, book: { title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292" }, date: "Apr 14, 2024", dueDate: "Apr 28, 2024", status: "pending" as const },
  { id: 3, user: { name: "Andres Castillo", email: "andres@email.com", avatar: "https://i.pravatar.cc/150?u=3" }, book: { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0060935467" }, date: "Apr 14, 2024", dueDate: "Apr 28, 2024", status: "approved" as const },
  { id: 4, user: { name: "Laura Gómez", email: "laura@email.com", avatar: "https://i.pravatar.cc/150?u=4" }, book: { title: "1984", author: "George Orwell", isbn: "978-0451524935" }, date: "Apr 13, 2024", dueDate: "Apr 27, 2024", status: "approved" as const },
  { id: 5, user: { name: "Daniel Vega", email: "daniel@email.com", avatar: "https://i.pravatar.cc/150?u=5" }, book: { title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "978-0316769488" }, date: "Apr 13, 2024", dueDate: "Apr 27, 2024", status: "rejected" as const },
  { id: 6, user: { name: "Cristina Ruiz", email: "cristina@email.com", avatar: "https://i.pravatar.cc/150?u=6" }, book: { title: "Dune", author: "Frank Herbert", isbn: "978-0441172719" }, date: "Apr 12, 2024", dueDate: "Apr 26, 2024", status: "rejected" as const },
  { id: 7, user: { name: "Pedro Martinez", email: "pedro@email.com", avatar: "https://i.pravatar.cc/150?u=7" }, book: { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "978-0547928227" }, date: "Apr 11, 2024", dueDate: "Apr 25, 2024", status: "pending" as const },
  { id: 8, user: { name: "Ana García", email: "ana@email.com", avatar: "https://i.pravatar.cc/150?u=8" }, book: { title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0141439518" }, date: "Apr 10, 2024", dueDate: "Apr 24, 2024", status: "approved" as const },
];

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filteredReservations = mockReservations.filter((reservation) => {
    const matchesSearch = 
      reservation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: number) => {
    toast({
      title: "Reservation Approved",
      description: "The reservation has been successfully approved.",
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Reservation Rejected",
      description: "The reservation has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <>
      <AdminHeader title="Reservations" />
      
      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">All Reservations</CardTitle>
              <Button className="gap-2 bg-libroya-green hover:bg-libroya-green-light">
                <Plus size={16} />
                New Reservation
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search by user or book..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download size={16} />
                Export
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Book</TableHead>
                  <TableHead className="font-semibold">Request Date</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation, index) => (
                  <TableRow 
                    key={reservation.id} 
                    className="animate-fade-in hover:bg-secondary/30 transition-colors"
                    style={{ animationDelay: `${index * 30}ms` }}
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
                    <TableCell className="text-muted-foreground">{reservation.dueDate}</TableCell>
                    <TableCell>
                      <StatusBadge status={reservation.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {reservation.status === "pending" && (
                          <>
                            <ActionButton variant="approve" onClick={() => handleApprove(reservation.id)} />
                            <ActionButton variant="reject" onClick={() => handleReject(reservation.id)} />
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredReservations.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No reservations found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Reservations;
