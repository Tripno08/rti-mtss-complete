'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Trash2,
  TrendingUp,
  BarChart,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { api } from '@/lib/utils/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Enums
enum StatusMeta {
  NAO_INICIADA = 'NAO_INICIADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

enum StatusSessao {
  REALIZADA = 'REALIZADA',
  CANCELADA = 'CANCELADA',
  NAO_REALIZADA = 'NAO_REALIZADA',
}

// Interfaces
interface InterventionPlan {
  id: string;
  dataInicio: string;
  frequenciaSemanal: number;
  duracaoSemanas: number;
  observacoes: string | null;
  estudante: {
    id: string;
    name: string;
    grade: string;
  };
  intervencao: {
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
    tempoSessao: string;
  };
  dificuldade: {
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
  };
  metas: Goal[];
  sessoes: Session[];
}

interface Goal {
  id: string;
  descricao: string;
  criterioSucesso: string;
  prazo: string;
  status: StatusMeta;
  progresso: number;
}

interface Session {
  id: string;
  data: string;
  status: StatusSessao;
  observacoes: string | null;
  progressoMetas: {
    metaId: string;
    valor: number;
  }[];
}

// Store Zustand
interface ProgressStore {
  plan: InterventionPlan | null;
  isLoading: boolean;
  error: string | null;
  fetchPlan: (id: string) => Promise<void>;
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  updateGoalProgress: (goalId: string, progress: number) => Promise<void>;
}

const useProgressStore = create<ProgressStore>((set, get) => ({
  plan: null,
  isLoading: false,
  error: null,
  fetchPlan: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/intervention-plans/${id}`);
      set({ plan: response.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: 'Erro ao carregar plano de intervenção', isLoading: false });
    }
  },
  addSession: async (session) => {
    const { plan } = get();
    if (!plan) return;
    
    try {
      const response = await api.post(`/intervention-plans/${plan.id}/sessions`, session);
      set((state) => ({
        plan: state.plan ? {
          ...state.plan,
          sessoes: [...state.plan.sessoes, response.data],
        } : null,
      }));
    } catch (error) {
      toast.error('Erro ao registrar sessão');
    }
  },
  updateGoalProgress: async (goalId: string, progress: number) => {
    const { plan } = get();
    if (!plan) return;
    
    try {
      await api.patch(`/intervention-plans/${plan.id}/goals/${goalId}`, { progresso: progress });
      set((state) => ({
        plan: state.plan ? {
          ...state.plan,
          metas: state.plan.metas.map((meta) =>
            meta.id === goalId ? { ...meta, progresso: progress } : meta
          ),
        } : null,
      }));
    } catch (error) {
      toast.error('Erro ao atualizar progresso da meta');
    }
  },
}));

// Schema de validação para o formulário de registro de sessão
const sessionFormSchema = z.object({
  data: z.string({
    required_error: "Selecione a data da sessão",
  }),
  status: z.nativeEnum(StatusSessao, {
    required_error: "Selecione o status da sessão",
  }),
  observacoes: z.string().optional(),
  progressoMetas: z.array(z.object({
    metaId: z.string(),
    valor: z.number().min(0).max(100),
  })),
});

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InterventionProgressPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const { 
    plan, 
    isLoading, 
    error, 
    fetchPlan,
    addSession,
    updateGoalProgress
  } = useProgressStore();

  // Carregar dados do plano ao montar o componente
  useState(() => {
    fetchPlan(params.id);
  });

  // Configurar o formulário de sessão
  const sessionForm = useForm<z.infer<typeof sessionFormSchema>>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      data: format(new Date(), 'yyyy-MM-dd'),
      status: StatusSessao.REALIZADA as StatusSessao,
      observacoes: '',
      progressoMetas: [],
    },
  });

  // Função para registrar uma nova sessão
  const onSubmitSession = async (values: z.infer<typeof sessionFormSchema>) => {
    await addSession({
      ...values,
      observacoes: values.observacoes || null,
    });
    sessionForm.reset();
    toast.success('Sessão registrada com sucesso');
  };

  // Função para atualizar o progresso de uma meta
  const handleUpdateGoalProgress = async (goalId: string, progress: number) => {
    await updateGoalProgress(goalId, progress);
    toast.success('Progresso atualizado com sucesso');
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para calcular o progresso geral
  const calculateOverallProgress = () => {
    if (!plan?.metas.length) return 0;
    const totalProgress = plan.metas.reduce((acc, meta) => acc + (meta.progresso || 0), 0);
    return Math.round(totalProgress / plan.metas.length);
  };

  // Função para calcular a aderência ao plano
  const calculateAdherence = () => {
    if (!plan?.sessoes.length) return 0;
    const realizadas = plan.sessoes.filter(s => s.status === StatusSessao.REALIZADA).length;
    return Math.round((realizadas / plan.sessoes.length) * 100);
  };

  // Função para obter a cor do badge de status da meta
  const getGoalStatusBadgeColor = (status: StatusMeta) => {
    const colors: Record<StatusMeta, string> = {
      [StatusMeta.NAO_INICIADA]: 'bg-gray-100 text-gray-800',
      [StatusMeta.EM_ANDAMENTO]: 'bg-blue-100 text-blue-800',
      [StatusMeta.CONCLUIDA]: 'bg-green-100 text-green-800',
      [StatusMeta.CANCELADA]: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  // Função para obter a cor do badge de status da sessão
  const getSessionStatusBadgeColor = (status: StatusSessao) => {
    const colors: Record<StatusSessao, string> = {
      [StatusSessao.REALIZADA]: 'bg-green-100 text-green-800',
      [StatusSessao.CANCELADA]: 'bg-red-100 text-red-800',
      [StatusSessao.NAO_REALIZADA]: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status];
  };

  // Função para formatar o nome do status da meta
  const formatGoalStatus = (status: StatusMeta) => {
    const names: Record<StatusMeta, string> = {
      [StatusMeta.NAO_INICIADA]: 'Não Iniciada',
      [StatusMeta.EM_ANDAMENTO]: 'Em Andamento',
      [StatusMeta.CONCLUIDA]: 'Concluída',
      [StatusMeta.CANCELADA]: 'Cancelada',
    };
    return names[status];
  };

  // Função para formatar o nome do status da sessão
  const formatSessionStatus = (status: StatusSessao) => {
    const names: Record<StatusSessao, string> = {
      [StatusSessao.REALIZADA]: 'Realizada',
      [StatusSessao.CANCELADA]: 'Cancelada',
      [StatusSessao.NAO_REALIZADA]: 'Não Realizada',
    };
    return names[status];
  };

  // Função para obter o ícone do status da meta
  const getGoalStatusIcon = (status: StatusMeta) => {
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

  // Preparar dados para o gráfico de progresso
  const prepareProgressChartData = () => {
    if (!plan) return [];
    
    return plan.sessoes.map((sessao) => {
      const data: any = {
        data: formatDate(sessao.data),
      };
      
      plan.metas.forEach((meta) => {
        const progresso = sessao.progressoMetas.find(p => p.metaId === meta.id);
        data[meta.descricao] = progresso?.valor || 0;
      });
      
      return data;
    });
  };

  // Renderizar tela de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando dados do plano...</span>
        </div>
      </div>
    );
  }

  // Renderizar mensagem de erro
  if (error || !plan) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              {error || 'Erro ao carregar dados do plano'}
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
          onClick={() => router.push('/interventions')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Monitor de Progresso</h1>
          <p className="text-gray-500">
            {plan.intervencao.nome} - {plan.estudante.name} ({plan.estudante.grade})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso Geral</CardTitle>
            <CardDescription>
              Média do progresso em todas as metas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {calculateOverallProgress()}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aderência ao Plano</CardTitle>
            <CardDescription>
              Percentual de sessões realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {calculateAdherence()}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessões Realizadas</CardTitle>
            <CardDescription>
              Total de sessões do plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {plan.sessoes.filter(s => s.status === StatusSessao.REALIZADA).length} / {plan.sessoes.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="goals">
            Metas
          </TabsTrigger>
          <TabsTrigger value="sessions">
            Sessões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Progresso ao Longo do Tempo</CardTitle>
              <CardDescription>
                Evolução do progresso em cada meta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareProgressChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="data" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {plan.metas.map((meta, index) => (
                      <Line
                        key={meta.id}
                        type="monotone"
                        dataKey={meta.descricao}
                        stroke={`hsl(${index * 360 / plan.metas.length}, 70%, 50%)`}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            {plan.metas.map((meta) => (
              <Card key={meta.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{meta.descricao}</CardTitle>
                      <CardDescription>
                        Critério de Sucesso: {meta.criterioSucesso}
                      </CardDescription>
                    </div>
                    <Badge className={getGoalStatusBadgeColor(meta.status)}>
                      <span className="flex items-center">
                        {getGoalStatusIcon(meta.status)}
                        {formatGoalStatus(meta.status)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Prazo: {formatDate(meta.prazo)}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {meta.progresso || 0}%
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${meta.progresso || 0}%` }}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const progress = prompt('Informe o novo progresso (0-100):');
                          if (progress && !isNaN(Number(progress))) {
                            handleUpdateGoalProgress(meta.id, Number(progress));
                          }
                        }}
                      >
                        Atualizar Progresso
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Sessão</CardTitle>
                <CardDescription>
                  Registre uma nova sessão de intervenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...sessionForm}>
                  <form onSubmit={sessionForm.handleSubmit(onSubmitSession)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={sessionForm.control}
                        name="data"
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
                        control={sessionForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(StatusSessao).map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {formatSessionStatus(status)}
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
                      control={sessionForm.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Observações sobre a sessão..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h4 className="font-medium">Progresso das Metas</h4>
                      {plan.metas.map((meta, index) => (
                        <FormField
                          key={meta.id}
                          control={sessionForm.control}
                          name={`progressoMetas.${index}.valor`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{meta.descricao}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  min={0}
                                  max={100}
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Progresso atual: {meta.progresso || 0}%
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <Button type="submit">
                      Registrar Sessão
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Sessões</CardTitle>
                <CardDescription>
                  Registro de todas as sessões realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progresso das Metas</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plan.sessoes.map((sessao) => (
                      <TableRow key={sessao.id}>
                        <TableCell>{formatDate(sessao.data)}</TableCell>
                        <TableCell>
                          <Badge className={getSessionStatusBadgeColor(sessao.status)}>
                            {formatSessionStatus(sessao.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {sessao.progressoMetas.map((progresso) => {
                              const meta = plan.metas.find(m => m.id === progresso.metaId);
                              return meta ? (
                                <div key={progresso.metaId} className="text-sm">
                                  {meta.descricao}: {progresso.valor}%
                                </div>
                              ) : null;
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{sessao.observacoes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 