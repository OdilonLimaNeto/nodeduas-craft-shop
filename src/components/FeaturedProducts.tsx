"use client";

import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const featuredProducts = [
  {
    id: "1",
    name: "Bolsa Artesanal Premium",
    price: 89.9,
    originalPrice: 120.0,
    images: [
      "/img/crochet-bag-1.jpg",
      "https://images.unsplash.com/photo-unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400",
    ],
    rating: 4.8,
    reviewCount: 24,
    category: "Bolsas & Acessórios",
    isNew: true,
    isFavorite: false,
  },
  {
    id: "2",
    name: "Cachecol Elegante",
    price: 65.0,
    images: [
      "/img/crochet-scarf-1.jpg",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400",
    ],
    rating: 4.9,
    reviewCount: 18,
    category: "Acessórios",
    isNew: false,
    isFavorite: true,
  },
  {
    id: "3",
    name: "Touca Baby Delicada",
    price: 35.0,
    originalPrice: 45.0,
    images: [
      "/img/crochet-hat-1.jpg",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400",
    ],
    rating: 5.0,
    reviewCount: 12,
    category: "Baby & Kids",
    isNew: true,
    isFavorite: false,
  },
];

export const FeaturedProducts = () => {
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
