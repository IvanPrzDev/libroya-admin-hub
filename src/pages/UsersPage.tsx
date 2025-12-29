import { useState } from "react";
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, Calendar } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mockUsers = [
  { id: 1, name: "Juan Perez", email: "juan@email.com", phone: "+1 234 567 890", avatar: "https://i.pravatar.cc/150?u=1", role: "member", joinedDate: "Jan 15, 2024", reservations: 5, status: "active" },
  { id: 2, name: "Maria Lopez", email: "maria@email.com", phone: "+1 234 567 891", avatar: "https://i.pravatar.cc/150?u=2", role: "member", joinedDate: "Feb 20, 2024", reservations: 12, status: "active" },
  { id: 3, name: "Andres Castillo", email: "andres@email.com", phone: "+1 234 567 892", avatar: "https://i.pravatar.cc/150?u=3", role: "premium", joinedDate: "Mar 10, 2024", reservations: 8, status: "active" },
  { id: 4, name: "Laura Gómez", email: "laura@email.com", phone: "+1 234 567 893", avatar: "https://i.pravatar.cc/150?u=4", role: "member", joinedDate: "Jan 5, 2024", reservations: 3, status: "inactive" },
  { id: 5, name: "Daniel Vega", email: "daniel@email.com", phone: "+1 234 567 894", avatar: "https://i.pravatar.cc/150?u=5", role: "premium", joinedDate: "Dec 12, 2023", reservations: 20, status: "active" },
  { id: 6, name: "Cristina Ruiz", email: "cristina@email.com", phone: "+1 234 567 895", avatar: "https://i.pravatar.cc/150?u=6", role: "member", joinedDate: "Apr 1, 2024", reservations: 1, status: "active" },
  { id: 7, name: "Pedro Martinez", email: "pedro@email.com", phone: "+1 234 567 896", avatar: "https://i.pravatar.cc/150?u=7", role: "admin", joinedDate: "Nov 1, 2023", reservations: 0, status: "active" },
  { id: 8, name: "Ana García", email: "ana@email.com", phone: "+1 234 567 897", avatar: "https://i.pravatar.cc/150?u=8", role: "member", joinedDate: "Feb 28, 2024", reservations: 7, status: "active" },
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-libroya-error/15 text-libroya-error border-libroya-error/30";
      case "premium":
        return "bg-libroya-yellow/15 text-libroya-yellow border-libroya-yellow/30";
      default:
        return "bg-libroya-green/15 text-libroya-green border-libroya-green/30";
    }
  };

  const getStatusClass = (status: string) => {
    return status === "active" 
      ? "bg-libroya-success text-white" 
      : "bg-muted-foreground text-white";
  };

  return (
    <>
      <AdminHeader title="Users" />
      
      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">All Users</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{mockUsers.length} registered users</p>
              </div>
              <Button className="gap-2 bg-libroya-green hover:bg-libroya-green-light">
                <Plus size={16} />
                Add User
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search by name or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user, index) => (
                <Card 
                  key={user.id} 
                  className="border shadow-sm hover:shadow-card transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-libroya-green/20 text-libroya-green">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <Badge variant="outline" className={`text-xs ${getRoleBadgeClass(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Reservations</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail size={14} />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} />
                        <span>Joined {user.joinedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Reservations: </span>
                        <span className="font-semibold text-foreground">{user.reservations}</span>
                      </div>
                      <Badge className={`${getStatusClass(user.status)} text-xs`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UsersPage;
