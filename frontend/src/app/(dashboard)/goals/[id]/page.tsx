'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Calendar,
  Target,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Edit,
  BarChart,
  ArrowUpRight,
  History,
} from 'lucide-react';

// Tipos
enum StatusMeta {
  NAO_INICIADA = 'NAO_INICIADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

interface HistoricoMeta {
  id: string;
  data: string;
  status: StatusMeta;
  progresso: number;
  observacoes: string;
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
  criterioSucesso: string;
  observacoes: string;
  historico: HistoricoMeta[];
}

// Dados simulados
const mockGoal: Goal = {
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
  criterioSucesso: 'O aluno será capaz de ler um texto de nível adequado a sua série com velocidade de 90 palavras por minuto e precisão de 95%.',
  observacoes: 'O aluno tem demonstrado progresso consistente nas últimas semanas. Está mais confiante na leitura em voz alta.',
  historico: [
    {
      id: '1',
      data: '2025-02-01',
      status: StatusMeta.NAO_INICIADA,
      progresso: 0,
      observacoes: 'Meta criada',
    },
    {
      id: '2',
      data: '2025-02-15',
      status: StatusMeta.EM_ANDAMENTO,
      progresso: 25,
      observacoes: 'Iniciada intervenção. Aluno lendo 60 palavras por minuto com 80% de precisão.',
    },
    {
      id: '3',
      data: '2025-03-01',
      status: StatusMeta.EM_ANDAMENTO,
      progresso: 45,
      observacoes: 'Progresso contínuo. Aluno lendo 70 palavras por minuto com 85% de precisão.',
    },
    {
      id: '4',
      data: '2025-03-15',
      status: StatusMeta.EM_ANDAMENTO,
      progresso: 65,
      observacoes: 'Melhora significativa. Aluno lendo 80 palavras por minuto com 90% de precisão.',
    },
  ],
};

export default function GoalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Usar React.use para acessar os parâmetros da rota
  const resolvedParams = use(params);
  const goalId = resolvedParams.id;

  useEffect(() => {
    // Simulação de carregamento de dados
    setTimeout(() => {
      setGoal(mockGoal);
      setLoading(false);
    }, 500);
  }, [goalId]);

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

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando detalhes da meta...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold">Meta não encontrada</h2>
          <p className="mt-2 text-gray-500">A meta que você está procurando não existe ou foi removida.</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/goals')}
          >
            Voltar para Metas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/goals')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Detalhes da Meta</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{goal.titulo}</CardTitle>
                  <CardDescription className="mt-2">{goal.descricao}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/goals/${goal.id}/edit`)}>
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  {goal.intervencaoId && (
                    <Button variant="outline" size="sm" onClick={() => router.push(`/interventions/${goal.intervencaoId}`)}>
                      <ArrowUpRight className="h-4 w-4 mr-1" /> Ver Intervenção
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Período</p>
                      <p>{formatDate(goal.dataInicio)} - {formatDate(goal.dataFim)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estudante</p>
                      <p>{goal.estudanteNome}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Categoria</p>
                      <p>{goal.categoria}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge
                        className={getStatusBadgeColor(goal.status)}
                        variant="outline"
                      >
                        {getStatusLabel(goal.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Critério de Sucesso</h3>
                  <p className="text-gray-700">{goal.criterioSucesso}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Progresso</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{goal.progresso}% Completo</span>
                      <Badge
                        className={getPriorityBadgeColor(goal.prioridade)}
                        variant="outline"
                      >
                        Prioridade: {getPriorityLabel(goal.prioridade)}
                      </Badge>
                    </div>
                    <Progress value={goal.progresso} className="h-2" />
                  </div>
                </div>

                {goal.observacoes && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Observações</h3>
                    <p className="text-gray-700">{goal.observacoes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="historico">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="historico">
                <History className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="progresso">
                <BarChart className="h-4 w-4 mr-2" />
                Gráfico de Progresso
              </TabsTrigger>
            </TabsList>
            <TabsContent value="historico">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Atualizações</CardTitle>
                  <CardDescription>
                    Registro de todas as atualizações feitas nesta meta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {goal.historico.map((item, index) => (
                      <div key={item.id} className="relative pl-6 pb-6">
                        {index < goal.historico.length - 1 && (
                          <div className="absolute top-0 left-2 h-full w-0.5 bg-gray-200"></div>
                        )}
                        <div className="absolute top-0 left-0 rounded-full bg-primary w-4 h-4"></div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatDate(item.data)}</span>
                            <Badge
                              className={getStatusBadgeColor(item.status)}
                              variant="outline"
                            >
                              {getStatusLabel(item.status)}
                            </Badge>
                            <span className="text-sm text-gray-500">Progresso: {item.progresso}%</span>
                          </div>
                          <p className="text-gray-700">{item.observacoes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/goals/${goal.id}/update`)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Atualizar Progresso
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="progresso">
              <Card>
                <CardHeader>
                  <CardTitle>Gráfico de Progresso</CardTitle>
                  <CardDescription>
                    Visualização do progresso ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Gráfico de progresso seria exibido aqui</p>
                    <p className="text-sm">Implementação futura</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações do Estudante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                  <p>{goal.estudanteNome}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/students/${goal.estudanteId}`)}
                >
                  Ver Perfil do Estudante
                </Button>
              </div>
            </CardContent>
          </Card>

          {goal.intervencaoId && goal.intervencaoNome && (
            <Card>
              <CardHeader>
                <CardTitle>Intervenção Relacionada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                    <p>{goal.intervencaoNome}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/interventions/${goal.intervencaoId}`)}
                  >
                    Ver Detalhes da Intervenção
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 