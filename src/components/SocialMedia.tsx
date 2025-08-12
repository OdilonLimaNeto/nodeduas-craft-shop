import { Instagram, MessageCircle, Facebook, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    handle: "@nodeduascrochet",
    description: "Veja nossos trabalhos em andamento, dicas de crochê e bastidores da criação.",
    url: "https://instagram.com/nodeduascrochet",
    gradient: "from-pink-500 to-purple-600",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    handle: "Fale Conosco",
    description: "Entre em contato direto para encomendas personalizadas e dúvidas.",
    url: "https://wa.me/5511999999999",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    name: "Facebook",
    icon: Facebook,
    handle: "Nó de Duas",
    description: "Conecte-se com nossa comunidade e acompanhe novidades e promoções.",
    url: "https://facebook.com/nodeduascrochet",
    gradient: "from-blue-600 to-blue-800",
  },
];

export const SocialMedia = () => {
  return (
    <section className="py-16 bg-craft-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-craft-coral" />
            <h2 className="text-3xl md:text-4xl font-bold text-craft-dark">
              Conecte-se Conosco
            </h2>
            <Heart className="w-6 h-6 text-craft-coral" />
          </div>
          <p className="text-lg text-craft-muted max-w-2xl mx-auto">
            Siga-nos nas redes sociais e faça parte da nossa comunidade artesanal.
            Compartilhamos dicas, inspirações e muito amor pelo crochê!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <div
                key={index}
                className="craft-card p-8 text-center hover-lift group"
              >
                <div className="mb-6">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${social.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-craft-dark mb-2">
                  {social.name}
                </h3>
                <p className="text-craft-coral font-medium mb-4">
                  {social.handle}
                </p>
                <p className="text-craft-muted text-sm leading-relaxed mb-6">
                  {social.description}
                </p>

                <Button
                  asChild
                  className="w-full bg-craft-sage hover:bg-craft-sage/90"
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    Seguir
                  </a>
                </Button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="craft-card p-6 inline-block">
            <p className="text-craft-muted">
              <span className="font-semibold">Hashtags:</span>{" "}
              #NóDeDuas #CrochêArtesanal #FeitoComAmor #ArtesanatoBrasil
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};