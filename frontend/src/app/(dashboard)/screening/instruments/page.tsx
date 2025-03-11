'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2,
  Loader2,
  FileText,
  BarChart
} from 'lucide-react';
import { api } from '@/lib/utils/api';
import { toast } from 'sonner';

// Enums
enum CategoriaInstrumento {
  ACADEMICO = 'ACADEMICO',
  COMPORTAMENTAL = 'COMPORTAMENTAL',
  SOCIOEMOCIONAL = 'SOCIOEMOCIONAL',
  COGNITIVO = 'COGNITIVO',
  LINGUAGEM = 'LINGUAGEM',
  MOTOR = 'MOTOR',
  ATENCAO = 'ATENCAO',
  OUTRO = 'OUTRO',
}

// Interfaces
interface ScreeningInstrument {
  id: string;
  nome: string;
  descricao: string;
  categoria: CategoriaInstrumento;
  faixaEtaria: string;
  tempoAplicacao: string;
  instrucoes: string;
  ativo: boolean;
  indicadores: ScreeningIndicator[];
  rastreios: Screening[];
}

interface ScreeningIndicator {
  id: string;
  nome: string;
  tipo: string;
}

interface Screening {
  id: string;
  dataAplicacao: string;
  status: string;
  estudante: {
    id: string;
    name: string;
    grade: string;
  };
}

export default function ScreeningInstrumentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Buscar instrumentos de rastreio
  const { data: instruments, isLoading, isError } = useQuery({
    queryKey: ['screening-instruments'],
    queryFn: async () => {
      const response = await api.get('/screening-instruments');
      return response.data;
    },
  });

  // Função para excluir um instrumento
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este instrumento de rastreio?')) {
      try {
        await api.delete(`/screening-instruments/${id}`);
        toast.success('Instrumento de rastreio excluído com sucesso');
        // Recarregar os dados
        window.location.reload();
      } catch (error) {
        console.error('Erro ao excluir instrumento:', error);
        toast.error('Erro ao excluir instrumento de rastreio');
      }
    }
  };

  // Filtrar instrumentos
  const filteredInstruments = instruments?.filter((instrument: ScreeningInstrument) => {
    const matchesSearch = instrument.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instrument.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchescategoryFilter = !categoryFilter || categoryFilter === "all-categoryFilters" || instrument.categoria === categoryFilter;
    const matchesActive = activeFilter === 'all' ? true : 
                         activeFilter === 'active' ? instrument.ativo : !instrument.ativo;
    return matchesSearch && matchesCategory && matchesActive;
  });

  // Função para formatar o nome da categoria
  const formatCategoryName = (category: CategoriaInstrumento) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Função para obter a cor do badge de categoria
  const getCategoryBadgeColor = (category: CategoriaInstrumento) => {
    const colors: Record<CategoriaInstrumento, string> = {
      [CategoriaInstrumento.ACADEMICO]: 'bg-blue-100 text-blue-800',
      [CategoriaInstrumento.COMPORTAMENTAL]: 'bg-red-100 text-red-800',
      [CategoriaInstrumento.SOCIOEMOCIONAL]: 'bg-purple-100 text-purple-800',
      [CategoriaInstrumento.COGNITIVO]: 'bg-yellow-100 text-yellow-800',
      [CategoriaInstrumento.LINGUAGEM]: 'bg-green-100 text-green-800',
      [CategoriaInstrumento.MOTOR]: 'bg-pink-100 text-pink-800',
      [CategoriaInstrumento.ATENCAO]: 'bg-orange-100 text-orange-800',
      [CategoriaInstrumento.OUTRO]: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Instrumentos de Rastreio</h1>
        <Button onClick={() => router.push('/screening/instruments/new')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Instrumento
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os instrumentos de rastreio por nome, categoria ou status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar por nome ou descrição..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">Todas as categorias</SelectItem>
                  {Object.values(CategoriaInstrumento).map((category) => (
                    <SelectItem key={category} value={category}>
                      {formatCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select
                value={activeFilter}
                onValueChange={setActiveFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando instrumentos de rastreio...</span>
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Erro ao carregar instrumentos de rastreio. Tente novamente mais tarde.
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Faixa Etária</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead className="text-center">Indicadores</TableHead>
                  <TableHead className="text-center">Aplicações</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstruments?.length > 0 ? (
                  filteredInstruments.map((instrument: ScreeningInstrument) => (
                    <TableRow key={instrument.id}>
                      <TableCell className="font-medium">{instrument.nome}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadgeColor(instrument.categoria)}>
                          {formatCategoryName(instrument.categoria)}
                        </Badge>
                      </TableCell>
                      <TableCell>{instrument.faixaEtaria}</TableCell>
                      <TableCell>{instrument.tempoAplicacao}</TableCell>
                      <TableCell className="text-center">
                        {instrument.indicadores?.length || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {instrument.rastreios?.length || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={instrument.ativo ? "default" : "outline"}>
                          {instrument.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/screening/instruments/${instrument.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/screening/instruments/${instrument.id}/edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/screening/instruments/${instrument.id}/indicators`)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/screening/instruments/${instrument.id}/stats`)}
                          >
                            <BarChart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(instrument.id)}
                            disabled={instrument.rastreios?.length > 0}
                            title={instrument.rastreios?.length > 0 ? "Não é possível excluir um instrumento com rastreios associados" : "Excluir instrumento"}
                          >
                            <Trash2 className={`h-4 w-4 ${instrument.rastreios?.length > 0 ? 'text-gray-400' : 'text-red-500'}`} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      Nenhum instrumento de rastreio encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 