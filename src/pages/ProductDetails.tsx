import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2, ShoppingCart } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          <span>/</span>
          <span>Produto</span>
        </div>

        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar para a loja
        </Link>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-craft-sage/20 flex items-center justify-center">
              <span className="text-muted-foreground">Imagem do Produto</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                Bolsa Artesanal
              </h1>
              <p className="text-muted-foreground">
                Categoria: Bolsas e Acessórios
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-craft-coral">R$ 89,90</span>
                <span className="text-lg text-muted-foreground line-through">R$ 120,00</span>
                <span className="bg-craft-coral/20 text-craft-coral px-2 py-1 rounded text-sm font-medium">
                  25% OFF
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Em até 3x de R$ 29,97 sem juros
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bolsa artesanal feita à mão com fio de algodão de alta qualidade. 
                Design único e resistente, perfeita para o dia a dia. Cada peça é 
                cuidadosamente confeccionada pelas nossas artesãs, garantindo 
                exclusividade e qualidade.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Especificações</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Material: 100% algodão</li>
                <li>• Dimensões: 30cm x 25cm x 10cm</li>
                <li>• Cores disponíveis: 3 opções</li>
                <li>• Fecho: Zíper resistente</li>
                <li>• Alças reforçadas</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-6">
              <Button className="craft-button flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Entrar em Contato
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;