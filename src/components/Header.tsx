"use client";

import { useState } from "react";
import { Menu, X, Search, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-craft-gradient rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-primary">
                Nó de Duas
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Crochê Artesanal
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-foreground hover:text-primary transition-colors"
            >
              Início
            </a>
            <a
              href="#produtos"
              className="text-foreground hover:text-primary transition-colors"
            >
              Produtos
            </a>
            <a
              href="#sobre"
              className="text-foreground hover:text-primary transition-colors"
            >
              Sobre
            </a>
            <a
              href="#contato"
              className="text-foreground hover:text-primary transition-colors"
            >
              Contato
            </a>
          </nav>

          {/* Desktop Search & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10 w-64 bg-background border-border"
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push("/admin/login")}
              className="cursor-pointer"
            >
              <User className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10 w-full bg-background border-border"
              />
            </div>
            <nav className="space-y-2">
              <a
                href="#"
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                Início
              </a>
              <a
                href="#produtos"
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                Produtos
              </a>
              <a
                href="#sobre"
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                Sobre
              </a>
              <a
                href="#contato"
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                Contato
              </a>
            </nav>
            <div className="flex items-center space-x-4 pt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/admin/login")}
                className="cursor-pointer"
              >
                <User className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
