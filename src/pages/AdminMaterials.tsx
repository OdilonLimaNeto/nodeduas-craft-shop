import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Package2, AlertTriangle, DollarSign, Calendar, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Material {
  id: string;
  name: string;
  type: string;
  brand: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  supplier: string;
  purchase_date: string;
  notes: string;
  created_at: string;
}

const materialSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  brand: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().min(0, 'Quantidade deve ser maior ou igual a zero'),
  unit_price: z.number().min(0, 'Preço unitário deve ser maior ou igual a zero'),
  supplier: z.string().optional(),
  purchase_date: z.string().optional(),
  notes: z.string().optional(),
});

const materialTypes = [
  'Lã',
  'Linha',
  'Algodão',
  'Acrílico',
  'Agulha',
  'Gancho',
  'Botão',
  'Fecho',
  'Enchimento',
  'Outros'
];

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: '',
      type: '',
      brand: '',
      color: '',
      quantity: 0,
      unit_price: 0,
      supplier: '',
      purchase_date: '',
      notes: '',
    },
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      toast({
        title: 'Erro ao carregar materiais',
        description: 'Não foi possível carregar os materiais.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof materialSchema>) => {
    try {
      const materialData = {
        ...values,
        total_cost: values.quantity * values.unit_price,
      };

      if (editingMaterial) {
        const { error } = await supabase
          .from('materials')
          .update(materialData)
          .eq('id', editingMaterial.id);

        if (error) throw error;
        toast({ title: 'Material atualizado com sucesso!' });
      } else {
        const { error } = await supabase
          .from('materials')
          .insert([materialData as any]);

        if (error) throw error;
        toast({ title: 'Material criado com sucesso!' });
      }

      setDialogOpen(false);
      setEditingMaterial(null);
      form.reset();
      loadMaterials();
    } catch (error) {
      toast({
        title: 'Erro ao salvar material',
        description: 'Não foi possível salvar o material.',
        variant: 'destructive',
      });
    }
  };

  const editMaterial = (material: Material) => {
    setEditingMaterial(material);
    form.reset({
      name: material.name,
      type: material.type,
      brand: material.brand || '',
      color: material.color || '',
      quantity: material.quantity,
      unit_price: material.unit_price,
      supplier: material.supplier || '',
      purchase_date: material.purchase_date || '',
      notes: material.notes || '',
    });
    setDialogOpen(true);
  };

  const deleteMaterial = async (materialId: string) => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;
      
      toast({ title: 'Material excluído com sucesso!' });
      loadMaterials();
    } catch (error) {
      toast({
        title: 'Erro ao excluir material',
        variant: 'destructive',
      });
    }
  };

  const stats = useMemo(() => {
    const totalItems = materials.reduce((acc, m) => acc + m.quantity, 0);
    const totalValue = materials.reduce((acc, m) => acc + (m.total_cost || 0), 0);
    const lowStockItems = materials.filter(m => m.quantity <= 5).length;
    const uniqueTypes = new Set(materials.map(m => m.type)).size;

    return {
      totalItems,
      totalValue,
      lowStockItems,
      uniqueTypes,
      totalMaterials: materials.length,
    };
  }, [materials]);

  const lowStockMaterials = materials.filter(m => m.quantity <= 5);

  const columns: ColumnDef<Material>[] = [
    {
      accessorKey: 'name',
      header: 'Material',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.brand && `${row.original.brand} • `}
            {row.original.color}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.type}</Badge>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Estoque',
      cell: ({ row }) => {
        const quantity = row.original.quantity;
        const isLowStock = quantity <= 5;
        
        return (
          <div className="flex items-center space-x-2">
            <span className={`font-mono ${isLowStock ? 'text-red-600' : ''}`}>
              {quantity}
            </span>
            {isLowStock && (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'unit_price',
      header: 'Preço Unit.',
      cell: ({ row }) => (
        <span className="font-mono">
          R$ {Number(row.original.unit_price).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'total_cost',
      header: 'Valor Total',
      cell: ({ row }) => (
        <span className="font-mono font-medium">
          R$ {Number(row.original.total_cost || 0).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'supplier',
      header: 'Fornecedor',
      cell: ({ row }) => row.original.supplier || '-',
    },
    {
      accessorKey: 'purchase_date',
      header: 'Data Compra',
      cell: ({ row }) => 
        row.original.purchase_date 
          ? format(new Date(row.original.purchase_date), 'dd/MM/yyyy')
          : '-',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => editMaterial(row.original)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => deleteMaterial(row.original.id)}
              className="text-red-600"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout title="Materiais">
      <div className="space-y-6">
        {/* Low Stock Alert */}
        {lowStockMaterials.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{lowStockMaterials.length} materiais</strong> com estoque baixo (≤ 5 unidades): {' '}
              {lowStockMaterials.map(m => m.name).join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMaterials}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.totalValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.lowStockItems}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipos de Material</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueTypes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Controle de Estoque</h2>
            <p className="text-sm text-muted-foreground">
              Gerencie seus materiais e controle o estoque
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingMaterial ? 'Editar Material' : 'Novo Material'}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Lã Merino" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materialTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Círculo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Azul marinho" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unit_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço Unitário (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0"
                              placeholder="0,00"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purchase_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Compra</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Loja de Artesanato ABC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Informações adicionais sobre o material..."
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
                        setEditingMaterial(null);
                        form.reset();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingMaterial ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={materials}
          searchKey="name"
          searchPlaceholder="Buscar materiais..."
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
}