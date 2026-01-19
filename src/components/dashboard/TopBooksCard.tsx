import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Book {
  title: string;
  author: string;
}

interface TopBook {
  bookId: string;
  count: number;
}

interface TopBooksCardProps {
  topBooks: TopBook[];
  books: Record<string, Book>;
}

export default function TopBooksCard({ topBooks, books }: TopBooksCardProps) {
  return (
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
  );
}
