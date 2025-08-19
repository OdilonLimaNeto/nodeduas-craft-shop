import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-craft-gradient">
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-craft-coral text-craft-coral"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  +200 clientes satisfeitas
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-primary leading-tight">
                Crochê Artesanal
                <span className="block text-craft-coral">Feito com Amor</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Cada peça é única, criada à mão com técnicas tradicionais e
                materiais de qualidade. Descubra o aconchego e a beleza do
                crochê artesanal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="craft-button group">
                Ver Coleção
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Heart className="mr-2 h-4 w-4" />
                Sobre o Nó de Duas
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">
                  Peças Criadas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">
                  Anos de Arte
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-in">
            <div className="relative">
              <Image
                src="/img/hero-crochet.jpg"
                alt="Crochê artesanal - Nó de Duas"
                width={600}
                height={600}
                className="w-full h-[600px] object-cover rounded-2xl shadow-elegant"
              />

              {/* Floating Card */}
              <Link href="/produto/1" className="block">
                <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:bg-background transition-all hover:shadow-lg cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-primary">
                        Novo: Bolsa Artesanal
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Disponível em 3 cores
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-craft-coral">
                        R$ 89,90
                      </div>
                      <div className="text-xs text-muted-foreground line-through">
                        R$ 120,00
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-craft-coral/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-craft-sage/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
