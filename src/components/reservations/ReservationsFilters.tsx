import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RESERVATION_STATUSES } from "@/constants/reservations";

interface ReservationsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  showExpiringSoon: boolean;
  onExpiringSoonChange: (value: boolean) => void;
  showCorruptedOnly: boolean;
  onCorruptedOnlyChange: (value: boolean) => void;
}

const ReservationsFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  showExpiringSoon,
  onExpiringSoonChange,
  showCorruptedOnly,
  onCorruptedOnlyChange,
}: ReservationsFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = [
    statusFilter !== "all",
    showExpiringSoon,
    showCorruptedOnly,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y botón de filtros */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Buscar por usuario, email o libro..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter size={18} className="mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-libroya-green text-white h-5 w-5 p-0 flex items-center justify-center rounded-full"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Panel de filtros desplegable */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg border animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Filtro por estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(RESERVATION_STATUSES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por próximas a vencer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Urgencia</label>
            <Button
              variant={showExpiringSoon ? "default" : "outline"}
              onClick={() => onExpiringSoonChange(!showExpiringSoon)}
              className={`w-full justify-start ${
                showExpiringSoon
                  ? "bg-libroya-yellow text-white hover:bg-libroya-yellow/90"
                  : ""
              }`}
            >
              Próximas a vencer (≤3 días)
            </Button>
          </div>

          {/* Filtro por corruptas */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado especial</label>
            <Button
              variant={showCorruptedOnly ? "default" : "outline"}
              onClick={() => onCorruptedOnlyChange(!showCorruptedOnly)}
              className={`w-full justify-start ${
                showCorruptedOnly
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : ""
              }`}
            >
              Solo corruptas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsFilters;
