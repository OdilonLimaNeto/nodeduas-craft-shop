"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCardCarousel } from "@/components/ProductCardCarousel";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  isNew?: boolean;
}

const allProducts: Product[] = [
  {
    id: "1",
    name: "Bolsa Artesanal Premium",
    price: 89.9,
    originalPrice: 120,
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
    ],
    rating: 4.8,
    reviewCount: 24,
    category: "Bolsas & Acessórios",
    isNew: true,
  },
  {
    id: "2",
    name: "Cachecol Elegante",
    price: 65,
    images: [
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600",
    ],
    rating: 4.9,
    reviewCount: 18,
    category: "Acessórios",
  },
  {
    id: "3",
    name: "Touca Baby Delicada",
    price: 35,
    originalPrice: 45,
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600",
    ],
    rating: 5,
    reviewCount: 12,
    category: "Baby & Kids",
    isNew: true,
  },
  {
    id: "4",
    name: "Almofada Tramada",
    price: 49.9,
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600",
    ],
    rating: 4.6,
    reviewCount: 10,
    category: "Casa & Decoração",
  },
  {
    id: "5",
    name: "Cesta Organizadora",
    price: 59.9,
    images: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600",
    ],
    rating: 4.7,
    reviewCount: 8,
    category: "Organização",
  },
  {
    id: "6",
    name: "Manta Aconchego",
    price: 120,
    originalPrice: 150,
    images: [
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600",
    ],
    rating: 4.9,
    reviewCount: 30,
    category: "Casa & Decoração",
  },
  {
    id: "7",
    name: "Tapete Artesanal",
    price: 199.9,
    images: [
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600",
    ],
    rating: 4.5,
    reviewCount: 14,
    category: "Casa & Decoração",
  },
  {
    id: "8",
    name: "Amigurumi Urso",
    price: 79.9,
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    ],
    rating: 5,
    reviewCount: 22,
    category: "Amigurumi",
    isNew: true,
  },
  {
    id: "9",
    name: "Porta Copos Rústico",
    price: 29.9,
    images: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    ],
    rating: 4.2,
    reviewCount: 6,
    category: "Casa & Decoração",
  },
];

export default function ProductsPage() {
  const [page, setPage] = useState<number>(1);
  const perPage = 6;

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return allProducts.slice(start, start + perPage);
  }, [page]);

  const pageCount = Math.ceil(allProducts.length / perPage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-3">
            Todos os Produtos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore nossa coleção artesanal. Feito com carinho e atenção aos detalhes.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginated.map((product, index) => (
            <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 120}ms` }}>
              <ProductCardCarousel product={product} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-border"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <div className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground">
            Página {page} de {pageCount}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="border-border"
          >
            Próxima
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}


