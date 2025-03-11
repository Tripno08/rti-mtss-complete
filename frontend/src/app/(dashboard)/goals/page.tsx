'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Plus, Search, FileText, Target, Calendar, ArrowUpRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Tipos
enum StatusMeta {
  NAO_INICIADA = 'NAO_INICIADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

interface Goal {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  status: StatusMeta;
  progresso: number;
  estudanteId: string;
  estudanteNome: string;
  intervencaoId?: string;
  intervencaoNome?: string;
  categoria: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
}

// Dados simulados
const mockGoals: Goal[] = [
  {
    id: '1',
    titulo: 'Melhorar fluência de leitura',
    descricao: 'Aumentar a velocidade de leitura para 90 palavras por minuto com precisão de 95%',
    dataInicio: '2025-02-01',
    dataFim: '2025-04-30',
    status: StatusMeta.EM_ANDAMENTO,
    progresso: 65,
    estudanteId: '1',
    estudanteNome: 'João Silva',
    intervencaoId: '1',
    intervencaoNome: 'Programa de Fluência de Leitura',
    categoria: 'Leitura',
    prioridade: 'ALTA',
  },
  {
    id: '2',
    titulo: 'Desenvolver habilidades de resolução de problemas matemáticos',
    descricao: 'Resolver problemas matemáticos de múltiplos passos com 80% de precisão',
    dataInicio: '2025-01-15',
    dataFim: '2025-05-15',
    status: StatusMeta.EM_ANDAMENTO,
    progresso: 40,
    estudanteId: '2',
    estudanteNome: 'Ana Pereira',
    intervencaoId: '2',
    intervencaoNome: 'Intervenção em Matemática',
    categoria: 'Matemática',
    prioridade: 'MEDIA',
  },
  {
    id: '3',
    titulo: 'Melhorar comportamento em sala de aula',
    descricao: 'Reduzir interrupções em sala de aula para menos de 2 por dia',
    dataInicio: '2025-02-10',
    dataFim: '2025-03-10',
    status: StatusMeta.CONCLUIDA,
    progresso: 100,
    estudanteId: '3',
    estudanteNome: 'Lucas Mendes',
    categoria: 'Comportamento',
    prioridade: 'ALTA',
  },
  {
    id: '4',
    titulo: 'Desenvolver habilidades de escrita',
    descricao: 'Escrever parágrafos coesos com introdução, desenvolvimento e conclusão',
    dataInicio: '2025-03-01',
    dataFim: '2025-06-30',
    status: StatusMeta.NAO_INICIADA,
    progresso: 0,
    estudanteId: '4',
    estudanteNome: 'Mariana Souza',
    intervencaoId: '3',
    intervencaoNome: 'Programa de Escrita Estruturada',
    categoria: 'Escrita',
    prioridade: 'MEDIA',
  },
  {
    id: '5',
    titulo: 'Melhorar habilidades sociais',
    descricao: 'Participar de atividades em grupo de forma cooperativa',
    dataInicio: '2025-01-05',
    dataFim: '2025-02-28',
    status: StatusMeta.CANCELADA,
    progresso: 30,
    estudanteId: '5',
    estudanteNome: 'Gabriel Santos',
    categoria: 'Socioemocional',
    prioridade: 'BAIXA',
  },
];

export default function GoalsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all-statuses');
  const [categoryFilter, setCategoryFilter] = useState('all-categories');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadgeColor = (status: StatusMeta) => {
    switch (status) {
      case StatusMeta.NAO_INICIADA:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case StatusMeta.EM_ANDAMENTO:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case StatusMeta.CONCLUIDA:
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case StatusMeta.CANCELADA:
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusLabel = (status: StatusMeta) => {
    switch (status) {
      case StatusMeta.NAO_INICIADA:
        return 'Não Iniciada';
      case StatusMeta.EM_ANDAMENTO:
        return 'Em Andamento';
      case StatusMeta.CONCLUIDA:
        return 'Concluída';
      case StatusMeta.CANCELADA:
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getPriorityBadgeColor = (priority: Goal['prioridade']) => {
    switch (priority) {
      case 'BAIXA':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'ALTA':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: Goal['prioridade']) => {
    switch (priority) {
      case 'BAIXA':
        return 'Baixa';
      case 'MEDIA':
        return 'Média';
      case 'ALTA':
        return 'Alta';
      default:
        return priority;
    }
  };

  // Filtrar metas
  const filteredGoals = mockGoals.filter((goal) => {
    const matchesSearch =
      goal.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.estudanteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goal.intervencaoNome && goal.intervencaoNome.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all-statuses' || goal.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'all-categories' || goal.categoria === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Obter categorias únicas para o filtro
  const uniqueCategories = Array.from(
    new Set(mockGoals.map((goal) => goal.categoria))
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Metas</h1>
        <Button onClick={() => router.push('/goals/create')}>
          <Plus className="mr-2 h-4 w-4" /> Nova Meta
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as metas por status, categoria ou use a busca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, estudante ou intervenção..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">Todos os Status</SelectItem>
                  <SelectItem value={StatusMeta.NAO_INICIADA}>Não Iniciada</SelectItem>
                  <SelectItem value={StatusMeta.EM_ANDAMENTO}>Em Andamento</SelectItem>
                  <SelectItem value={StatusMeta.CONCLUIDA}>Concluída</SelectItem>
                  <SelectItem value={StatusMeta.CANCELADA}>Cancelada</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="all-categories">Todas as Categorias</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGoals.length > 0 ? (
                filteredGoals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">
                      {goal.titulo}
                    </TableCell>
                    <TableCell>{goal.estudanteNome}</TableCell>
                    <TableCell>{goal.categoria}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(goal.dataInicio)} - {formatDate(goal.dataFim)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeColor(goal.status)}
                        variant="outline"
                      >
                        {getStatusLabel(goal.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Progress value={goal.progresso} className="h-2" />
                        <span className="text-xs text-gray-500">{goal.progresso}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getPriorityBadgeColor(goal.prioridade)}
                        variant="outline"
                      >
                        {getPriorityLabel(goal.prioridade)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/goals/${goal.id}`)}
                        >
                          <FileText className="h-4 w-4 mr-1" /> Detalhes
                        </Button>
                        {goal.intervencaoId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/interventions/${goal.intervencaoId}`)}
                          >
                            <ArrowUpRight className="h-4 w-4 mr-1" /> Intervenção
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Nenhuma meta encontrada com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 