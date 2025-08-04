import { Scissors, Heart, CheckCircle, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Scissors,
    title: "Seleção de Materiais",
    description: "Escolhemos cuidadosamente fios de alta qualidade, priorizando texturas macias e cores vibrantes para cada peça única.",
  },
  {
    icon: Heart,
    title: "Técnica Artesanal",
    description: "Cada ponto é feito à mão com amor e dedicação, usando técnicas tradicionais de crochê passadas de geração em geração.",
  },
  {
    icon: CheckCircle,
    title: "Controle de Qualidade",
    description: "Inspecionamos cada detalhe com cuidado, garantindo que sua peça atenda aos nossos altos padrões de qualidade e durabilidade.",
  },
  {
    icon: Sparkles,
    title: "Toque Final",
    description: "Adicionamos os acabamentos especiais e embalamos com carinho, preparando sua peça artesanal para chegar até você.",
  },
];

export const CraftingProcess = () => {
  return (
    <section className="py-16 bg-craft-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-craft-dark mb-4">
            Como Nossos Produtos São Feitos
          </h2>
          <p className="text-lg text-craft-muted max-w-2xl mx-auto">
            Cada peça é criada com amor e dedicação, seguindo um processo artesanal
            que valoriza a qualidade e a tradição do crochê.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="craft-card p-6 text-center hover-lift group"
              >
                <div className="mb-4 relative">
                  <div className="w-16 h-16 mx-auto bg-craft-coral/10 rounded-full flex items-center justify-center group-hover:bg-craft-coral/20 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-craft-coral" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-craft-sage text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-craft-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-craft-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};