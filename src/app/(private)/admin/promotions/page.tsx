"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Percent, Tag, Calendar, MoreHorizontal } from "lucide-react";
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
import { format } from "date-fns";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_hero_promotion: boolean;
  product_id: string;
  products?: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
}

const promotionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  discount_percentage: z.number().min(1, "Mínimo 1%").max(100, "Máximo 100%"),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().optional(),
  product_id: z.string().min(1, "Produto é obrigatório"),
  is_active: z.boolean(),
  is_hero_promotion: z.boolean(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "Bolsa Crochê Aurora" },
  { id: "p2", name: "Chapéu Praia Brisa" },
  { id: "p3", name: "Cachecol Inverno Doce" },
];

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "promo1",
    title: "Promo de Inverno",
    description: "Descontos para aquecer o inverno",
    discount_percentage: 15,
    start_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    end_date: "",
    is_active: true,
    is_hero_promotion: true,
    product_id: "p1",
    products: { name: "Bolsa Crochê Aurora" },
  },
  {
    id: "promo2",
    title: "Semana da Moda Praia",
    description: "Ofertas especiais para praia",
    discount_percentage: 20,
    start_date: new Date().toISOString(),
    end_date: "",
    is_active: true,
    is_hero_promotion: false,
    product_id: "p2",
    products: { name: "Chapéu Praia Brisa" },
  },
];

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"start_date" | "title" | "discount_percentage">("start_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: "",
      description: "",
      discount_percentage: 10,
      start_date: "",
      end_date: "",
      product_id: "",
      is_active: true,
      is_hero_promotion: false,
    },
  });

  const loadPromotions = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setPromotions(INITIAL_PROMOTIONS);
    setLoading(false);
  }, []);

  const loadProducts = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 200));
    setProducts(INITIAL_PRODUCTS);
  }, []);

  useEffect(() => {
    loadPromotions();
    loadProducts();
  }, [loadPromotions, loadProducts]);

  const onSubmit = async (values: PromotionFormValues) => {
    try {
      if (editingPromotion) {
        const updated: Promotion = {
          ...editingPromotion,
          ...values,
          products: { name: products.find((p) => p.id === values.product_id)?.name || "" },
        };
        setPromotions((prev) =>
          prev.map((p) => (p.id === editingPromotion.id ? updated : p))
        );
        toast.success("Promoção atualizada com sucesso!");
      } else {
        const newPromotion: Promotion = {
          id: `promo-${Date.now()}`,
          title: values.title,
          description: values.description || "",
          discount_percentage: values.discount_percentage,
          start_date: values.start_date,
          end_date: values.end_date || "",
          is_active: values.is_active,
          is_hero_promotion: values.is_hero_promotion,
          product_id: values.product_id,
          products: { name: products.find((p) => p.id === values.product_id)?.name || "" },
        };
        setPromotions((prev) => [newPromotion, ...prev]);
        toast.success("Promoção criada com sucesso!");
      }

      setDialogOpen(false);
      setEditingPromotion(null);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar a promoção.");
    }
  };

  const togglePromotionStatus = async (promotion: Promotion) => {
    try {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === promotion.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      toast.success(
        `Promoção ${!promotion.is_active ? "ativada" : "desativada"} com sucesso!`
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar promoção");
    }
  };

  const editPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset({
      title: promotion.title,
      description: promotion.description || "",
      discount_percentage: promotion.discount_percentage,
      start_date: promotion.start_date,
      end_date: promotion.end_date || "",
      product_id: promotion.product_id,
      is_active: promotion.is_active,
      is_hero_promotion: promotion.is_hero_promotion,
    });
    setDialogOpen(true);
  };

  const handleSort = (key: "start_date" | "title" | "discount_percentage") => {
    setSortBy((prev) => (prev === key ? prev : key));
    setSortDir((prev) => (sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
  };

  const filteredPromotions = promotions
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "title") {
        const r = a.title.localeCompare(b.title);
        return sortDir === "asc" ? r : -r;
      }
      if (sortBy === "start_date") {
        const r = new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        return sortDir === "asc" ? r : -r;
      }
      const r = a.discount_percentage - b.discount_percentage;
      return sortDir === "asc" ? r : -r;
    });

  const activePromotions = promotions.filter((p) => p.is_active).length;
  const heroPromotions = promotions.filter(
    (p) => p.is_hero_promotion && p.is_active
  ).length;
  const averageDiscount =
    promotions.length > 0
      ? promotions.reduce((acc, p) => acc + p.discount_percentage, 0) /
        promotions.length
      : 0;

  return (
    <AdminLayout title="Promoções">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Promoções
              </CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promoções Ativas
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePromotions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promoções Hero
              </CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{heroPromotions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Desconto Médio
              </CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageDiscount.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Gerenciar Promoções</h2>
            <p className="text-sm text-muted-foreground">
              Crie e gerencie promoções para seus produtos
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Promoção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPromotion ? "Editar Promoção" : "Nova Promoção"}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Promoção de Inverno"
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
                            placeholder="Descrição da promoção..."
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
                      name="product_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Produto</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o produto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
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
                      name="discount_percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desconto (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Fim (opcional)</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
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
                            <FormLabel>Promoção Ativa</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              A promoção estará visível no site
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
                      name="is_hero_promotion"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Promoção Hero</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Será exibida em destaque na página inicial
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
                        setEditingPromotion(null);
                        form.reset();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingPromotion ? "Atualizar" : "Criar"}
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
            <CardTitle>Lista de Promoções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4 gap-2">
              <Input
                placeholder="Buscar promoções..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              {loading && (
                <span className="text-sm text-muted-foreground">Carregando...</span>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                    Título
                  </TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("discount_percentage")}>
                    Desconto
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("start_date")}>
                    Início
                  </TableHead>
                  <TableHead>Fim</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.title}</span>
                        {item.is_hero_promotion && (
                          <Badge variant="secondary">Hero</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.products?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {item.discount_percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(item.start_date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      {item.end_date ? format(new Date(item.end_date), "dd/MM/yyyy") : "Indefinido"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Ativa" : "Inativa"}
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
                          <DropdownMenuItem onClick={() => editPromotion(item)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePromotionStatus(item)}>
                            {item.is_active ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filteredPromotions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                      Nenhuma promoção encontrada.
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
