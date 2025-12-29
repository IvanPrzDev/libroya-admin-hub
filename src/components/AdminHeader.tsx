import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search anything here" 
            className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-libroya-error rounded-full" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50 rounded-lg px-2 py-1 transition-colors">
          <Avatar className="w-9 h-9">
            <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
            <AvatarFallback className="bg-libroya-green text-white text-sm">AG</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">Alfredo Gutierrez</span>
          <ChevronDown size={16} className="text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
