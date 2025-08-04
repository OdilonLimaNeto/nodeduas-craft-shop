import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import crochetBag1 from "@/assets/crochet-bag-1.jpg";
import crochetScarf1 from "@/assets/crochet-scarf-1.jpg";
import crochetHat1 from "@/assets/crochet-hat-1.jpg";

const featuredProducts = [
  {
    id: "1",
    name: "Bolsa Artesanal Premium",
    price: 89.90,
    originalPrice: 120.00,
    image: crochetBag1,
    rating: 4.8,
    reviewCount: 24,
    category: "Bolsas & Acessórios",
    isNew: true,
    isFavorite: false
  },
  {
    id: "2",
    name: "Cachecol Elegante",
    price: 65.00,
    image: crochetScarf1,
    rating: 4.9,
    reviewCount: 18,
    category: "Acessórios",
    isNew: false,
    isFavorite: true
  },
  {
    id: "3",
    name: "Touca Baby Delicada",
    price: 35.00,
    originalPrice: 45.00,
    image: crochetHat1,
    rating: 5.0,
    reviewCount: 12,
    category: "Baby & Kids",
    isNew: true,
    isFavorite: false
  }
];

export const FeaturedProducts = () => {
  const handleToggleFavorite = (productId: string) => {
    console.log("Toggle favorito:", productId);
    // Aqui você implementaria a lógica de favoritos
  };

  return (
    <section id="produtos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção especial de peças artesanais, 
            cada uma criada com carinho e atenção aos detalhes.
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
              <ProductCard
                product={product}
                onToggleFavorite={handleToggleFavorite}
              />
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border">
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-craft-coral mb-2">50+</div>
            <div className="text-muted-foreground">Modelos Únicos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-craft-coral mb-2">24h</div>
            <div className="text-muted-foreground">Envio Rápido</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-craft-coral mb-2">100%</div>
            <div className="text-muted-foreground">Artesanal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-craft-coral mb-2">⭐ 4.9</div>
            <div className="text-muted-foreground">Avaliação</div>
          </div>
        </div>
      </div>
    </section>
  );
};