import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente para o dashboard sem autenticação
    const timer = setTimeout(() => {
      navigate('/admin/dashboard');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleDirectAccess = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary">Painel Administrativo</h1>
          <p className="text-muted-foreground">Acesso ao sistema de gestão</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Acesso Direto</CardTitle>
            <CardDescription>
              Clique no botão abaixo para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDirectAccess} 
              className="w-full"
              size="lg"
            >
              Acessar Dashboard
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              Redirecionamento automático em 1 segundo...
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Voltar à página inicial
          </Button>
        </div>
      </div>
    </div>
  );
}