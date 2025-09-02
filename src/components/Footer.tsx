import { MessageCircle, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="text-muted-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="border-t border-muted-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-craft-coral rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold">Nó de Duas</h3>
                <p className="text-sm">Crochê Artesanal</p>
              </div>
            </div>

            <div className="text-sm">
              © 2024 Nó de Duas. Todos os direitos reservados.
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>contato@nodeduaus.com.br</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MessageCircle className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
