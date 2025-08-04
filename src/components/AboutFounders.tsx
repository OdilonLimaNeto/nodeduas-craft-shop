import { Badge } from "@/components/ui/badge";

const founders = [
  {
    name: "Ana Kaleny",
    role: "Co-fundadora & Designer",
    description: "Apaixonada por crochê desde a adolescência, Ana traz criatividade e inovação para cada design. Com mais de 8 anos de experiência, ela é responsável pela criação dos padrões únicos que fazem do Nó de Duas uma marca especial.",
    specialties: ["Design de Padrões", "Técnicas Avançadas", "Inovação"],
  },
  {
    name: "Thayná Feitoza",
    role: "Co-fundadora & Artesã",
    description: "Com habilidades excepcionais no crochê e um olhar apurado para detalhes, Thayná garante que cada peça mantenha a qualidade artesanal que nossos clientes esperam. Sua dedicação é o coração da nossa produção.",
    specialties: ["Artesanato Fino", "Controle de Qualidade", "Técnicas Tradicionais"],
  },
];

export const AboutFounders = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-craft-dark mb-4">
            Conheça as Artesãs
          </h2>
          <p className="text-lg text-craft-muted max-w-2xl mx-auto">
            Duas amigas unidas pela paixão do crochê, criando peças únicas
            com muito amor e dedicação.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="craft-card p-8 text-center lg:text-left hover-lift"
            >
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto lg:mx-0 bg-craft-gradient rounded-full mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {founder.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-craft-dark mb-1">
                  {founder.name}
                </h3>
                <p className="text-craft-coral font-medium mb-4">
                  {founder.role}
                </p>
              </div>

              <p className="text-craft-muted leading-relaxed mb-6">
                {founder.description}
              </p>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {founder.specialties.map((specialty, specIndex) => (
                  <Badge
                    key={specIndex}
                    variant="secondary"
                    className="bg-craft-sage/10 text-craft-sage border-craft-sage/20"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="craft-card p-6 inline-block">
            <p className="text-craft-muted italic">
              "Juntas, transformamos fios em histórias e criamos peças que levam amor para cada lar."
            </p>
            <p className="text-craft-coral font-semibold mt-2">- Ana & Thayná</p>
          </div>
        </div>
      </div>
    </section>
  );
};