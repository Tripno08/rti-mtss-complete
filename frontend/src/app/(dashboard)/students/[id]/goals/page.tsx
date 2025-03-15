'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Loader2,
  Target,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  Plus,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  BarChart
} from 'lucide-react';
import { api } from '@/lib/utils/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Enums
enum StatusMeta {
  NAO_INICIADA = 'NAO_INICIADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

// Interfaces
interface Student {
  id: string;
  name: string;
  grade: string;
}

interface Goal {
  id: string;
  descricao: string;
  criterioSucesso: string;
  prazo: string;
  status: StatusMeta;
  progresso: number;
  observacoes: string | null;
  intervencao?: {
    id: string;
    nome: string;
  };
  historico: {
    id: string;
    data: string;
    status: StatusMeta;
    progresso: number;
    observacoes: string | null;
  }[];
}

// Store Zustand
interface GoalsStore {
  student: Student | null;
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  fetchStudent: (id: string) => Promise<void>;
  fetchGoals: (studentId: string) => Promise<void>;
  updateGoalProgress: (goalId: string, progress: number, observacoes?: string) => Promise<void>;
  cancelGoal: (goalId: string, observacoes: string) => Promise<void>;
}

const useGoalsStore = create<GoalsStore>((set) => ({
  student: null,
  goals: [],
  isLoading: false,
  error: null,
  fetchStudent: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/students/${id}`);
      set({ student: response.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: 'Erro ao carregar dados do estudante', isLoading: false });
    }
  },
  fetchGoals: async (studentId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/goals?estudanteId=${studentId}`);
      set({ goals: response.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: 'Erro ao carregar metas', isLoading: false });
    }
  },
  updateGoalProgress: async (goalId: string, progress: number, observacoes?: string) => {
    try {
      await api.patch(`/goals/${goalId}/progress`, { progresso: progress, observacoes });
      const response = await api.get(`/goals/${goalId}`);
      set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === goalId ? response.data : goal
        ),
      }));
      toast.success('Progresso atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar progresso');
    }
  },
  cancelGoal: async (goalId: string, observacoes: string) => {
    try {
      await api.post(`/goals/${goalId}/cancel`, { observacoes });
      const response = await api.get(`/goals/${goalId}`);
      set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === goalId ? response.data : goal
        ),
      }));
      toast.success('Meta cancelada com sucesso');
    } catch (error) {
      toast.error('Erro ao cancelar meta');
    }
  },
}));

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentGoalsPage({ params }: PageProps) {
  const { id } = await params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const { 
    student, 
    goals,
    isLoading,
    error,
    fetchStudent,
    fetchGoals,
    updateGoalProgress,
    cancelGoal
  } = useGoalsStore();

  // Carregar dados do estudante e metas
  useState(() => {
    fetchStudent(id);
    fetchGoals(id);
  });

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para obter a cor do badge de status
  const getStatusBadgeColor = (status: StatusMeta) => {
    const colors: Record<StatusMeta, string> = {
      [StatusMeta.NAO_INICIADA]: 'bg-gray-100 text-gray-800',
      [StatusMeta.EM_ANDAMENTO]: 'bg-blue-100 text-blue-800',
      [StatusMeta.CONCLUIDA]: 'bg-green-100 text-green-800',
      [StatusMeta.CANCELADA]: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  // Função para formatar o nome do status
  const formatStatusName = (status: StatusMeta) => {
    const names: Record<StatusMeta, string> = {
      [StatusMeta.NAO_INICIADA]: 'Não Iniciada',
      [StatusMeta.EM_ANDAMENTO]: 'Em Andamento',
      [StatusMeta.CONCLUIDA]: 'Concluída',
      [StatusMeta.CANCELADA]: 'Cancelada',
    };
    return names[status];
  };

  // Função para obter o ícone do status
  const getStatusIcon = (status: StatusMeta) => {
    switch (status) {
      case StatusMeta.NAO_INICIADA:
        return <Clock className="h-4 w-4 mr-1" />;
      case StatusMeta.EM_ANDAMENTO:
        return <TrendingUp className="h-4 w-4 mr-1" />;
      case StatusMeta.CONCLUIDA:
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case StatusMeta.CANCELADA:
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <AlertTriangle className="h-4 w-4 mr-1" />;
    }
  };

  // Filtrar metas por status
  const filteredGoals = goals.filter((goal) => {
    switch (activeTab) {
      case 'active':
        return goal.status === StatusMeta.EM_ANDAMENTO || goal.status === StatusMeta.NAO_INICIADA;
      case 'completed':
        return goal.status === StatusMeta.CONCLUIDA;
      case 'cancelled':
        return goal.status === StatusMeta.CANCELADA;
      default:
        return true;
    }
  });

  // Preparar dados para o gráfico de progresso
  const prepareProgressChartData = (goal: Goal) => {
    return goal.historico.map((registro) => ({
      data: formatDate(registro.data),
      progresso: registro.progresso,
    }));
  };

  // Renderizar tela de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando metas...</span>
        </div>
      </div>
    );
  }

  // Renderizar mensagem de erro
  if (error || !student) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              {error || 'Erro ao carregar dados do estudante'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/students/${id}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Metas do Estudante</h1>
          <p className="text-gray-500">
            {student.name} ({student.grade})
          </p>
        </div>
        <Button onClick={() => router.push('/goals/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="active">
            Em Andamento
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídas
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Canceladas
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-6">
        {filteredGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{goal.descricao}</CardTitle>
                  <CardDescription>
                    Critério de Sucesso: {goal.criterioSucesso}
                  </CardDescription>
                </div>
                <Badge className={getStatusBadgeColor(goal.status)}>
                  <span className="flex items-center">
                    {getStatusIcon(goal.status)}
                    {formatStatusName(goal.status)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Prazo</h4>
                    <p>{formatDate(goal.prazo)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Progresso</h4>
                    <p className="text-2xl font-bold text-primary">
                      {goal.progresso}%
                    </p>
                  </div>
                  {goal.intervencao && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Intervenção</h4>
                      <p>{goal.intervencao.nome}</p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${goal.progresso}%` }}
                    />
                  </div>
                </div>

                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={prepareProgressChartData(goal)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="progresso"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {goal.status !== StatusMeta.CONCLUIDA && goal.status !== StatusMeta.CANCELADA && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const progress = prompt('Informe o novo progresso (0-100):');
                        if (progress && !isNaN(Number(progress))) {
                          updateGoalProgress(goal.id, Number(progress));
                        }
                      }}
                    >
                      Atualizar Progresso
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        const observacoes = prompt('Informe o motivo do cancelamento:');
                        if (observacoes) {
                          cancelGoal(goal.id, observacoes);
                        }
                      }}
                    >
                      Cancelar Meta
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-gray-500">
                    Ver histórico completo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Histórico da Meta</DialogTitle>
                    <DialogDescription>
                      Registro completo de atualizações
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {goal.historico.map((registro) => (
                      <div key={registro.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusBadgeColor(registro.status)}>
                              <span className="flex items-center">
                                {getStatusIcon(registro.status)}
                                {formatStatusName(registro.status)}
                              </span>
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {formatDate(registro.data)}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="text-sm">
                              Progresso: <span className="font-medium">{registro.progresso}%</span>
                            </div>
                            {registro.observacoes && (
                              <p className="text-sm text-gray-600 mt-1">
                                {registro.observacoes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}

        {filteredGoals.length === 0 && (
          <Card>
            <CardContent className="py-6">
              <div className="text-center text-gray-500">
                Nenhuma meta encontrada nesta categoria.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 