"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { getCookie, deleteCookie } from "cookies-next/client";
import { logout as logoutService } from "@/services/auth-service";

interface DashboardStats {
  totalProducts: number;
  activePromotions: number;
  totalRevenue: number;
  materialsCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activePromotions: 0,
    totalRevenue: 0,
    materialsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    // Simula carregamento e popula dados estáticos
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStats({
      totalProducts: 12,
      activePromotions: 3,
      totalRevenue: 1540,
      materialsCount: 27,
    });
    setLoading(false);
  };

  const menuItems = [
    {
      title: "Promoções",
      description: "Criar e gerenciar campanhas",
      icon: Tag,
      href: "/admin/promotions",
      stats: stats.activePromotions,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Financeiro",
      description: "Controle financeiro e relatórios",
      icon: DollarSign,
      href: "/admin/financial",
      stats: `R$ ${stats.totalRevenue}`,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      title: "Materiais",
      description: "Estoque de materiais e insumos",
      icon: Package,
      href: "/admin/materials",
      stats: stats.materialsCount,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
  ];

  const handleLogout = async () => {
    try {
      const refreshToken = getCookie("refresh_token");
      if (refreshToken) {
        try {
          await logoutService(String(refreshToken));
        } catch {}
      }
    } finally {
      deleteCookie("jwt");
      deleteCookie("refresh_token");
      deleteCookie("user");
      await signOut({ callbackUrl: "/admin/login" });
    }
  };

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
    <AdminLayout title="Dashboard Administrativo">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Gerencie seu negócio de artesanato de forma eficiente
          </p>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Produtos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promoções Ativas
              </CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePromotions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalRevenue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materiais</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.materialsCount}</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} href={item.href}>
                  <Card
                    className={`transition-all hover:shadow-md cursor-pointer group ${item.color}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Icon className="h-8 w-8" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{item.stats}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
