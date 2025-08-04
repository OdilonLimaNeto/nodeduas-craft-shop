import { useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, MessageCircle } from "lucide-react";
import crochetBag1 from "@/assets/crochet-bag-1.jpg";
import crochetScarf1 from "@/assets/crochet-scarf-1.jpg";
import crochetHat1 from "@/assets/crochet-hat-1.jpg";

const productImages = [
  {
    id: "1",
    url: crochetBag1,
    alt: "Bolsa de crochê artesanal coral - vista frontal"
  },
  {
    id: "2", 
    url: crochetScarf1,
    alt: "Bolsa de crochê artesanal coral - vista lateral"
  },
  {
    id: "3",
    url: crochetHat1,
    alt: "Bolsa de crochê artesanal coral - detalhes"
  }
];

export const ProductShowcase = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState("coral");
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: "Bolsa Artesanal Premium",
    category: "Bolsas & Acessórios",
    price: 89.90,
    originalPrice: 120.00,
    description: "Uma bolsa única feita à mão com fios de alta qualidade. Perfeita para o dia a dia, combina estilo e funcionalidade. Cada peça é cuidadosamente confeccionada com amor e atenção aos detalhes.",
    features: [
      "100% feita à mão",
      "Fios de algodão premium",
      "Resistente e durável",
      "Design exclusivo",
      "Alça confortável"
    ],
    colors: [
      { name: "coral", label: "Coral", color: "bg-craft-coral" },
      { name: "sage", label: "Verde Musgo", color: "bg-craft-sage" },
      { name: "cream", label: "Creme", color: "bg-craft-cream" }
    ],
    rating: 4.8,
    reviewCount: 24
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse na ${product.name} na cor ${selectedColor}. Poderia me dar mais informações?`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-6">
            <ProductGallery images={productImages} />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-craft-coral text-white">Novo</Badge>
                <Badge className="bg-primary text-primary-foreground">-{discount}%</Badge>
              </div>
              
              <p className="text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-primary mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="text-3xl font-bold text-craft-coral">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-lg text-muted-foreground line-through">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Cores Disponíveis</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className={`relative w-10 h-10 rounded-full ${color.color} border-2 transition-all ${
                      selectedColor === color.name 
                        ? 'border-primary scale-110' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.label}
                  >
                    {selectedColor === color.name && (
                      <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Quantidade</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button className="flex-1 craft-button">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={isFavorite ? "text-craft-coral border-craft-coral" : ""}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Consultar via WhatsApp
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Características</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-craft-coral rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center space-y-2">
                <Truck className="w-6 h-6 text-craft-sage mx-auto" />
                <div className="text-xs text-muted-foreground">Entrega em todo Brasil</div>
              </div>
              <div className="text-center space-y-2">
                <Shield className="w-6 h-6 text-craft-sage mx-auto" />
                <div className="text-xs text-muted-foreground">Garantia de qualidade</div>
              </div>
              <div className="text-center space-y-2">
                <RotateCcw className="w-6 h-6 text-craft-sage mx-auto" />
                <div className="text-xs text-muted-foreground">7 dias para troca</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};