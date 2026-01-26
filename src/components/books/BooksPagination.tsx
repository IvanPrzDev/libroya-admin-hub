import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationMeta } from "@/types";

interface BooksPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const BooksPagination = ({
  meta,
  onPageChange,
  onLimitChange,
}: BooksPaginationProps) => {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = meta;

  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(page - 1);
  const handleNextPage = () => onPageChange(page + 1);
  const handleLastPage = () => onPageChange(totalPages);

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Mostrando {startItem}-{endItem} de {total} libros
        </span>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Mostrar</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="hidden sm:inline">por página</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleFirstPage}
          disabled={!hasPrevPage}
          className="h-8 w-8"
        >
          <ChevronsLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={!hasPrevPage}
          className="h-8 w-8"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-1 px-2 text-sm">
          <span className="text-muted-foreground">Página</span>
          <span className="font-semibold">{page}</span>
          <span className="text-muted-foreground">de</span>
          <span className="font-semibold">{totalPages || 1}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className="h-8 w-8"
        >
          <ChevronRight size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleLastPage}
          disabled={!hasNextPage}
          className="h-8 w-8"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default BooksPagination;
