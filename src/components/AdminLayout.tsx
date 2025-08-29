"use client";

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Package2,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
}

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Produtos',
    href: '/admin/products',
    icon: Package,
  },
  {
    label: 'Promoções',
    href: '/admin/promotions',
    icon: Tag,
  },
  {
    label: 'Financeiro',
    href: '/admin/financial',
    icon: DollarSign,
  },
  {
    label: 'Materiais',
    href: '/admin/materials',
    icon: Package2,
  },
];

export const AdminLayout = ({ children, title, showBackButton = false }: AdminLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Admin', href: '/admin/dashboard', isLast: false },
    ];

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[pathSegments.length - 1];
      const pageLabels: Record<string, string> = {
        dashboard: 'Dashboard',
        products: 'Produtos',
        promotions: 'Promoções',
        financial: 'Financeiro',
        materials: 'Materiais',
      };

      breadcrumbs.push({
        label: pageLabels[currentPage] || currentPage,
        href: pathname,
        isLast: true,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">CraftAdmin</span>
              </div>

              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => [
                    (
                      <BreadcrumbItem key={`item-${index}`}>
                        {breadcrumb.isLast ? (
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    ),
                    !breadcrumb.isLast && (
                      <BreadcrumbSeparator key={`sep-${index}`} />
                    ),
                  ])}
                </BreadcrumbList>
              </Breadcrumb>
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

      {/* Navigation */}
      <nav className="border-b bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex h-12 items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="h-8"
                >
                  <Link href={item.href} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};