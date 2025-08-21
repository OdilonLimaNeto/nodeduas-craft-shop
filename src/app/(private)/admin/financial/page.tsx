"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinancialRecord {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: string;
  notes: string;
  payment_method: string;
  created_at: string;
}

const financialSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  date: z.string().min(1, "Data é obrigatória"),
  type: z.enum(["entrada", "saida"]),
  notes: z.string().optional(),
  payment_method: z.string().optional(),
});

const categories = [
  "Vendas",
  "Materiais",
  "Equipamentos",
  "Marketing",
  "Transporte",
  "Alimentação",
  "Outros",
];

const paymentMethods = [
  "Dinheiro",
  "PIX",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Transferência",
];

const INITIAL_RECORDS: FinancialRecord[] = [
  {
    id: "r1",
    description: "Venda: Bolsa Crochê Aurora",
    category: "Vendas",
    amount: 149.9,
    date: new Date().toISOString().split("T")[0],
    type: "entrada",
    notes: "Pagamento via PIX",
    payment_method: "PIX",
    created_at: new Date().toISOString(),
  },
  {
    id: "r2",
    description: "Compra de fios premium",
    category: "Materiais",
    amount: 85.0,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split("T")[0],
    type: "saida",
    notes: "Loja Tecelagem Central",
    payment_method: "Cartão de Débito",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "r3",
    description: "Venda: Chapéu Praia Brisa",
    category: "Vendas",
    amount: 89.9,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString().split("T")[0],
    type: "entrada",
    notes: "",
    payment_method: "Cartão de Crédito",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export default function AdminFinancial() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "description" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const form = useForm<z.infer<typeof financialSchema>>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      description: "",
      category: "",
      amount: 0.01,
      date: new Date().toISOString().split("T")[0],
      type: "entrada",
      notes: "",
      payment_method: "",
    },
  });

  const loadFinancialRecords = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setRecords(INITIAL_RECORDS);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFinancialRecords();
  }, [loadFinancialRecords]);

  const onSubmit = async (values: z.infer<typeof financialSchema>) => {
    try {
      const newRecord: FinancialRecord = {
        id: `rec-${Date.now()}`,
        description: values.description,
        category: values.category,
        amount: values.amount,
        date: values.date,
        type: values.type,
        notes: values.notes || "",
        payment_method: values.payment_method || "",
        created_at: new Date().toISOString(),
      };
      setRecords((prev) => [newRecord, ...prev]);
      toast.success("Registro criado com sucesso!");
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o registro financeiro.");
    }
  };

  const stats = useMemo(() => {
    const entradas = records.filter((r) => r.type === "entrada");
    const saidas = records.filter((r) => r.type === "saida");

    const totalEntradas = entradas.reduce(
      (acc, r) => acc + Number(r.amount),
      0
    );
    const totalSaidas = saidas.reduce((acc, r) => acc + Number(r.amount), 0);
    const saldo = totalEntradas - totalSaidas;

    // Estatísticas do mês atual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const recordsThisMonth = records.filter((r) => {
      const recordDate = new Date(r.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    const entradasMes = recordsThisMonth
      .filter((r) => r.type === "entrada")
      .reduce((acc, r) => acc + Number(r.amount), 0);
    const saidasMes = recordsThisMonth
      .filter((r) => r.type === "saida")
      .reduce((acc, r) => acc + Number(r.amount), 0);

    return {
      totalEntradas,
      totalSaidas,
      saldo,
      entradasMes,
      saidasMes,
      saldoMes: entradasMes - saidasMes,
    };
  }, [records]);

  const handleSort = (key: "date" | "description" | "amount") => {
    setSortBy((prev) => (prev === key ? prev : key));
    setSortDir((prev) => (sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
  };

  const filteredRecords = records
    .filter((r) =>
      [r.description, r.category, r.payment_method || ""].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === "description") {
        const r = a.description.localeCompare(b.description);
        return sortDir === "asc" ? r : -r;
      }
      if (sortBy === "date") {
        const r = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortDir === "asc" ? r : -r;
      }
      const r = a.amount - b.amount;
      return sortDir === "asc" ? r : -r;
    });

  return (
    <AdminLayout title="Financeiro">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="records">Registros</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards - Geral */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resumo Geral</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Entradas
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {stats.totalEntradas.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Saídas
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      R$ {stats.totalSaidas.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Saldo Total
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        stats.saldo >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      R$ {stats.saldo.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Registros
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{records.length}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats Cards - Mês Atual */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resumo do Mês</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Entradas do Mês
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {stats.entradasMes.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Saídas do Mês
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      R$ {stats.saidasMes.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Saldo do Mês
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        stats.saldoMes >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      R$ {stats.saldoMes.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            {/* Actions */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Registros Financeiros</h2>
                <p className="text-sm text-muted-foreground">
                  Gerencie entradas e saídas financeiras
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Registro
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Novo Registro Financeiro</DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="entrada">Entrada</SelectItem>
                                <SelectItem value="saida">Saída</SelectItem>
                              </SelectContent>
                            </Select>
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
                              <Input
                                placeholder="Ex: Venda de produtos"
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
                                    <SelectValue placeholder="Selecione" />
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
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor (R$)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0,00"
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

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="payment_method"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Método de Pagamento</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {paymentMethods.map((method) => (
                                    <SelectItem key={method} value={method}>
                                      {method}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Informações adicionais..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setDialogOpen(false);
                            form.reset();
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Lista / Tabela */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Registros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 gap-2">
                  <Input
                    placeholder="Buscar registros..."
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
                      <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                        Data
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                        Descrição
                      </TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                        Valor
                      </TableHead>
                      <TableHead>Método</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((row) => {
                      const isPositive = row.type === "entrada";
                      return (
                        <TableRow key={row.id}>
                          <TableCell>{format(new Date(row.date), "dd/MM/yyyy")}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{row.description}</div>
                              {row.notes && (
                                <div className="text-sm text-muted-foreground">{row.notes}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isPositive ? "default" : "destructive"}>
                              {isPositive ? "Entrada" : "Saída"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-mono font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                              {isPositive ? "+" : "-"}R$ {row.amount.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>{row.payment_method || "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                    {!loading && filteredRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                          Nenhum registro encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
