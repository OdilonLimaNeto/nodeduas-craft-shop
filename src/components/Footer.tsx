import { Heart, Instagram, Facebook, MessageCircle, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-craft-coral rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">Nó de Duas</h3>
                <p className="text-sm text-primary-foreground/80">Crochê Artesanal</p>
              </div>
            </div>
            <p className="text-primary-foreground/90 leading-relaxed">
              Criamos peças únicas de crochê artesanal com amor, 
              qualidade e atenção aos detalhes para tornar seu dia mais especial.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <nav className="space-y-2">
              <a href="#" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Início
              </a>
              <a href="#produtos" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Produtos
              </a>
              <a href="#sobre" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Sobre Nós
              </a>
              <a href="#contato" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Contato
              </a>
              <a href="#" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </a>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categorias</h4>
            <nav className="space-y-2">
              <a href="#" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Bolsas & Acessórios
              </a>
              <a href="#" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Roupas & Vestuário
              </a>
              <a href="#" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Baby & Kids
              </a>
              <a href="#" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Casa & Decoração
              </a>
              <a href="#" className="block text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Presentes Especiais
              </a>
            </nav>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Fique por Dentro</h4>
            <p className="text-primary-foreground/90 text-sm">
              Receba novidades sobre nossos produtos e promoções exclusivas.
            </p>
            
            <div className="space-y-3">
              <Input 
                type="email"
                placeholder="Seu e-mail"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="w-full bg-craft-coral hover:bg-craft-coral/90 text-white">
                Inscrever-se
              </Button>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/90">
                <Mail className="h-4 w-4" />
                <span>contato@nodeduaus.com.br</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/90">
                <MessageCircle className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/90">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-primary-foreground/80 text-sm">
              © 2024 Nó de Duas. Todos os direitos reservados.
            </div>
            <div className="flex items-center space-x-1 text-primary-foreground/80 text-sm">
              <span>Feito com</span>
              <Heart className="h-4 w-4 fill-craft-coral text-craft-coral" />
              <span>para você</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};