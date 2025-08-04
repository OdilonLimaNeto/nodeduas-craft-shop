import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  ShoppingBag,
  Users,
  TrendingUp,
  Settings,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  monthlyRevenue: number;
  materialsCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalSales: 0,
    monthlyRevenue: 0,
    materialsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Get products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get materials count
      const { count: materialsCount } = await supabase
        .from('materials')
        .select('*', { count: 'exact', head: true });

      // Get this month's sales
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      
      const { data: salesData } = await supabase
        .from('financial_records')
        .select('amount')
        .eq('type', 'entrada')
        .eq('category', 'venda')
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      const monthlyRevenue = salesData?.reduce((sum, record) => sum + parseFloat(record.amount.toString()), 0) || 0;
      const totalSales = salesData?.length || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalSales,
        monthlyRevenue,
        materialsCount: materialsCount || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };


  const menuItems = [
    {
      title: 'Promoções',
      description: 'Gerenciar produtos em destaque',
      icon: Package,
      href: '/admin/promotions',
      color: 'bg-blue-500',
    },
    {
      title: 'Financeiro',
      description: 'Controle de vendas e gastos',
      icon: DollarSign,
      href: '/admin/financial',
      color: 'bg-green-500',
    },
    {
      title: 'Materiais',
      description: 'Estoque de linhas e agulhas',
      icon: ShoppingBag,
      href: '/admin/materials',
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-craft-gradient rounded-lg mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-craft-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-primary">Nó de Duas</h1>
                <p className="text-xs text-muted-foreground">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Administrador</p>
                <Badge variant="secondary">Painel de Controle</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-primary mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Bem-vindo ao painel de controle do Nó de Duas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-craft-coral">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Total de produtos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-craft-coral">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">Vendas realizadas este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-craft-coral">
                R$ {stats.monthlyRevenue.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-muted-foreground">Faturamento do mês atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materiais</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-craft-coral">{stats.materialsCount}</div>
              <p className="text-xs text-muted-foreground">Tipos de materiais cadastrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <Card key={item.href} className="hover-lift transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={item.href}>
                  <Button className="w-full craft-button">Acessar</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/admin/promotions" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Nova Promoção
                </Button>
              </Link>
              <Link to="/admin/financial" className="flex-1">
                <Button variant="outline" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Registrar Venda
                </Button>
              </Link>
              <Link to="/admin/materials" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Adicionar Material
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Ver Site
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}