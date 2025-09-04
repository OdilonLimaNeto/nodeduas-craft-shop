"use client";

import { Product } from "@/interfaces/product";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/services/products-service";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const FeaturedProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProductList, setFeaturedProductList] = useState<Product[]>([]);

  const fetchFeaturedProducts = async () => {
    try {
      setIsLoading(true);

      const data = await getFeaturedProducts();

      if (!data) throw new Error("Produtos em destaque não encontrados");

      setFeaturedProductList(data);
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <section id="produtos" className="scroll-mt-24 py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção especial de peças artesanais, cada uma criada
            com carinho e atenção aos detalhes.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="craft-button group">
            Ver Todos os Produtos
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
