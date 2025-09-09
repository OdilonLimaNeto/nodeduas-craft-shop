"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCardCarousel } from "@/components/ProductCardCarousel";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { findAllProducts } from "@/services/products-service";
import toast from "react-hot-toast";
import { Product } from "@/interfaces/product";

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const perPage = 6;

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await findAllProducts();
      if (!data) throw new Error("Produtos não encontrados");
      setAllProducts(data);
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return allProducts.slice(start, start + perPage);
  }, [page, allProducts]);

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
            Explore nossa coleção artesanal. Feito com carinho e atenção aos
            detalhes.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading &&
            Array.from({ length: perPage }).map((_, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCardSkeleton />
              </div>
            ))}

          {!isLoading &&
            paginated.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <ProductCardCarousel product={product} />
              </div>
            ))}

          {!isLoading && allProducts.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              Nenhum produto encontrado.
            </div>
          )}
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
