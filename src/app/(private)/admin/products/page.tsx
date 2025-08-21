"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Star, TrendingUp, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  original_price: number;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
}

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  price: z.number().min(0.01, "Preço deve ser maior que zero"),
  original_price: z.number().min(0).optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  rating: z.number().min(0).max(5).optional(),
  review_count: z.number().min(0).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categories = [
  "Bolsas",
  "Chapéus",
  "Cachecóis",
  "Blusas",
  "Acessórios",
  "Decoração",
  "Outros",
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Bolsa Crochê Aurora",
    description: "Bolsa artesanal em crochê, cor terracota",
    category: "Bolsas",
    price: 149.9,
    original_price: 179.9,
    is_active: true,
    is_featured: true,
    rating: 4.7,
    review_count: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "p2",
    name: "Chapéu Praia Brisa",
    description: "Chapéu em crochê, tamanho único",
    category: "Chapéus",
    price: 89.9,
    original_price: 0,
    is_active: true,
    is_featured: false,
    rating: 4.4,
    review_count: 9,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: "p3",
    name: "Cachecol Inverno Doce",
    description: "Cachecol macio, fio premium",
    category: "Cachecóis",
    price: 129.0,
    original_price: 0,
    is_active: false,
    is_featured: false,
    rating: 4.9,
    review_count: 27,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "name" | "price" | "rating">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0.01,
      original_price: 0,
      is_active: true,
      is_featured: false,
      rating: 0,
      review_count: 0,
    },
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setProducts(INITIAL_PRODUCTS);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (editingProduct) {
        const updated: Product = {
          ...editingProduct,
          ...values,
        };
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
        toast.success("Produto atualizado com sucesso!");
      } else {
        const newProduct: Product = {
          id: `p-${Date.now()}`,
          name: values.name,
          description: values.description || "",
          category: values.category,
          price: values.price,
          original_price: values.original_price || 0,
          is_active: values.is_active ?? true,
          is_featured: values.is_featured ?? false,
          rating: values.rating || 0,
          review_count: values.review_count || 0,
          created_at: new Date().toISOString(),
        };
        setProducts((prev) => [newProduct, ...prev]);
        toast.success("Produto criado com sucesso!");
      }

      setDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar produto");
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      toast.success(
        `Produto ${!product.is_active ? "ativado" : "desativado"} com sucesso!`
      );
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar produto");
    }
  };

  const toggleFeaturedStatus = async (product: Product) => {
    try {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, is_featured: !p.is_featured }
            : p
        )
      );
      toast.success(
        `Produto ${
          !product.is_featured ? "destacado" : "removido dos destaques"
        } com sucesso!`
      );
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar produto");
    }
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price,
      original_price: product.original_price || 0,
      is_active: product.is_active,
      is_featured: product.is_featured,
      rating: product.rating || 0,
      review_count: product.review_count || 0,
    });
    setDialogOpen(true);
  };

  const handleSort = (key: "created_at" | "name" | "price" | "rating") => {
    setSortBy((prev) => (prev === key ? prev : key));
    setSortDir((prev) => (sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        const r = a.name.localeCompare(b.name);
        return sortDir === "asc" ? r : -r;
      }
      if (sortBy === "created_at") {
        const r = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortDir === "asc" ? r : -r;
      }
      const left = sortBy === "price" ? a.price : a.rating;
      const right = sortBy === "price" ? b.price : b.rating;
      const r = left - right;
      return sortDir === "asc" ? r : -r;
    });

  const activeProducts = products.filter((p) => p.is_active).length;
  const featuredProducts = products.filter(
    (p) => p.is_featured && p.is_active
  ).length;
  const averagePrice =
    products.length > 0
      ? products.reduce((acc, p) => acc + p.price, 0) / products.length
      : 0;

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <AdminLayout title="Produtos">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Produtos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Produtos Ativos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Produtos em Destaque
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {averagePrice.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Gerenciar Produtos</h2>
            <p className="text-sm text-muted-foreground">
              Crie e gerencie produtos do seu catálogo
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Bolsa de Crochê Artesanal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descrição detalhada do produto..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="original_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço Original (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avaliação (0-5)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="review_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº Avaliações</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Produto Ativo</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              O produto estará visível no site
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Produto em Destaque</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Será exibido na seção de produtos destacados
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditingProduct(null);
                        form.reset();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingProduct ? "Atualizar" : "Criar"} Produto
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista / Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4 gap-2">
              <Input
                placeholder="Pesquisar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              {loading && <span className="text-sm text-muted-foreground">Carregando...</span>}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Nome
                  </TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    Preço
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("rating")}
                  >
                    Avaliação
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {item.is_featured && (
                          <Badge variant="secondary">Destaque</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono">R$ {item.price.toFixed(2)}</span>
                        {item.original_price && item.original_price > item.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {item.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating?.toFixed(1) || "0.0"}</span>
                        <span className="text-muted-foreground">({item.review_count || 0})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => editProduct(item)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleProductStatus(item)}>
                            {item.is_active ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFeaturedStatus(item)}>
                            {item.is_featured ? "Remover Destaque" : "Destacar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
