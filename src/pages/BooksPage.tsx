import { useState } from "react";
import { Search, Filter, Plus, MoreHorizontal, BookOpen, User, Calendar, Tag } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mockBooks = [
  { id: 1, title: "El Gran Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", category: "Ficción", year: 1925, copies: 5, available: 3, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200" },
  { id: 2, title: "Hábitos Atómicos", author: "James Clear", isbn: "978-0735211292", category: "Autoayuda", year: 2018, copies: 8, available: 2, cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200" },
  { id: 3, title: "Matar a un Ruiseñor", author: "Harper Lee", isbn: "978-0060935467", category: "Ficción", year: 1960, copies: 4, available: 4, cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200" },
  { id: 4, title: "1984", author: "George Orwell", isbn: "978-0451524935", category: "Distopía", year: 1949, copies: 6, available: 1, cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200" },
  { id: 5, title: "El Guardián entre el Centeno", author: "J.D. Salinger", isbn: "978-0316769488", category: "Ficción", year: 1951, copies: 3, available: 0, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200" },
  { id: 6, title: "Dune", author: "Frank Herbert", isbn: "978-0441172719", category: "Ciencia Ficción", year: 1965, copies: 7, available: 5, cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200" },
  { id: 7, title: "El Hobbit", author: "J.R.R. Tolkien", isbn: "978-0547928227", category: "Fantasía", year: 1937, copies: 10, available: 6, cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=200" },
  { id: 8, title: "Orgullo y Prejuicio", author: "Jane Austen", isbn: "978-0141439518", category: "Romance", year: 1813, copies: 4, available: 2, cover: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=200" },
];

const categories = ["Todas", "Ficción", "Autoayuda", "Distopía", "Ciencia Ficción", "Fantasía", "Romance"];

const BooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory = categoryFilter === "Todas" || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio === 0) return "bg-libroya-error/15 text-libroya-error border-libroya-error/30";
    if (ratio < 0.5) return "bg-libroya-yellow/15 text-libroya-yellow border-libroya-yellow/30";
    return "bg-libroya-success/15 text-libroya-success border-libroya-success/30";
  };

  const getAvailabilityText = (available: number) => {
    if (available === 0) return "No disponible";
    return `${available} disponible${available > 1 ? 's' : ''}`;
  };

  return (
    <>
      <AdminHeader title="Libros" />
      
      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Catálogo de Libros</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{mockBooks.length} libros en la biblioteca</p>
              </div>
              <Button className="gap-2 bg-libroya-green hover:bg-libroya-green-light">
                <Plus size={16} />
                Agregar Libro
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Buscar por título, autor o ISBN..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-44">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBooks.map((book, index) => (
                <Card 
                  key={book.id} 
                  className="border shadow-sm hover:shadow-card transition-all duration-300 overflow-hidden animate-fade-in group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-40 overflow-hidden bg-secondary">
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Ver Reservas</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{book.title}</h3>
                    
                    <div className="space-y-1.5 text-sm mb-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User size={14} />
                        <span className="truncate">{book.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag size={14} />
                        <span>{book.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} />
                        <span>{book.year}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {book.available}/{book.copies}
                        </span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getAvailabilityColor(book.available, book.copies)}`}>
                        {getAvailabilityText(book.available)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredBooks.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No se encontraron libros</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BooksPage;
