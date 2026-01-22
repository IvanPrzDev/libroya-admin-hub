import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BOOK_GENRES } from "@/constants/books";

interface BooksFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  genreFilter: string;
  onGenreFilterChange: (value: string) => void;
}

const BooksFilters = ({
  searchTerm,
  onSearchChange,
  genreFilter,
  onGenreFilterChange,
}: BooksFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Buscar por título, autor o ISBN..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={genreFilter} onValueChange={onGenreFilterChange}>
        <SelectTrigger className="w-44">
          <Filter size={16} className="mr-2" />
          <SelectValue placeholder="Género" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los Géneros</SelectItem>
          {Object.entries(BOOK_GENRES).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BooksFilters;
