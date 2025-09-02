import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
        <span className="text-primary-foreground font-bold">404</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
        Página não encontrada
      </h1>
      <p className="text-muted-foreground mb-8 max-w-prose">
        A página que você procura pode ter sido removida, teve o nome alterado ou está temporariamente indisponível.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/#produtos">Ver produtos</Link>
        </Button>
      </div>
    </div>
  )
}


