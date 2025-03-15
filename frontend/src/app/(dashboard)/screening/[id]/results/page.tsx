'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserPlus,
  FileText
} from 'lucide-react';
import { api } from '@/lib/utils/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Enums
enum StatusRastreio {
  AGENDADO = 'AGENDADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

enum NivelRisco {
  BAIXO = 'BAIXO',
  MODERADO = 'MODERADO',
  ALTO = 'ALTO',
  MUITO_ALTO = 'MUITO_ALTO',
}

// Interfaces
interface Screening {
  id: string;
  dataAplicacao: string;
  observacoes: string | null;
  status: StatusRastreio;
  estudante: {
    id: string;
    name: string;
    grade: string;
  };
  aplicador: {
    id: string;
    name: string;
    email: string;
  };
  instrumento: {
    id: string;
    nome: string;
    categoria: string;
    indicadores: ScreeningIndicator[];
  };
  resultados: ScreeningResult[];
}

interface ScreeningIndicator {
  id: string;
  nome: string;
  tipo: string;
  valorMinimo: number;
  valorMaximo: number;
  pontoCorte: number;
}

interface ScreeningResult {
  id: string;
  valor: number;
  nivelRisco: NivelRisco | null;
  observacoes: string | null;
  indicador: ScreeningIndicator;
}

// Schema de validação para o formulário de registro de resultados
const formSchema = z.object({
  resultados: z.array(
    z.object({
      indicadorId: z.string(),
      valor: z.number().min(0),
      nivelRisco: z.string().optional(),
      observacoes: z.string().optional(),
    })
  ),
});

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScreeningResultsPage({ params }: PageProps) {
  const { id } = await params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('results');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');

  // Buscar detalhes do rastreio
  const { 
    data: screening, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['screening', id],
    queryFn: async () => {
      const response = await api.get(`/screenings/${id}`);
      return response.data;
    },
  });

  // Configurar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resultados: [],
    },
  });

  // Mutação para registrar resultados
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return api.post(`/screening-results/batch/${id}`, values.resultados);
    },
    onSuccess: () => {
      toast.success('Resultados registrados com sucesso');
      // Recarregar os dados
      window.location.reload();
    },
    onError: (error) => {
      console.error('Erro ao registrar resultados:', error);
      toast.error('Erro ao registrar resultados');
    },
  });

  // Função para registrar resultados
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para obter a cor do badge de nível de risco
  const getRiskBadgeColor = (risk: NivelRisco | null) => {
    if (!risk) return 'bg-gray-100 text-gray-800';
    
    const colors: Record<NivelRisco, string> = {
      [NivelRisco.BAIXO]: 'bg-green-100 text-green-800',
      [NivelRisco.MODERADO]: 'bg-yellow-100 text-yellow-800',
      [NivelRisco.ALTO]: 'bg-orange-100 text-orange-800',
      [NivelRisco.MUITO_ALTO]: 'bg-red-100 text-red-800',
    };
    return colors[risk];
  };

  // Função para formatar o nome do nível de risco
  const formatRiskName = (risk: NivelRisco | null) => {
    if (!risk) return 'Não avaliado';
    
    const names: Record<NivelRisco, string> = {
      [NivelRisco.BAIXO]: 'Baixo',
      [NivelRisco.MODERADO]: 'Moderado',
      [NivelRisco.ALTO]: 'Alto',
      [NivelRisco.MUITO_ALTO]: 'Muito Alto',
    };
    return names[risk];
  };

  // Função para obter o ícone do nível de risco
  const getRiskIcon = (risk: NivelRisco | null) => {
    if (!risk) return <AlertCircle className="h-4 w-4 mr-1" />;
    
    switch (risk) {
      case NivelRisco.BAIXO:
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case NivelRisco.MODERADO:
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case NivelRisco.ALTO:
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case NivelRisco.MUITO_ALTO:
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1" />;
    }
  };

  // Preparar dados para os gráficos
  const prepareChartData = () => {
    if (!screening || !screening.resultados) return [];
    
    return screening.resultados.map((resultado: ScreeningResult) => ({
      name: resultado.indicador.nome,
      valor: resultado.valor,
      pontoCorte: resultado.indicador.pontoCorte,
      nivelRisco: resultado.nivelRisco,
    }));
  };

  // Preparar dados para o gráfico de pizza de distribuição de risco
  const prepareRiskDistributionData = () => {
    if (!screening || !screening.resultados) return [];
    
    const counts: Record<string, number> = {
      [NivelRisco.BAIXO]: 0,
      [NivelRisco.MODERADO]: 0,
      [NivelRisco.ALTO]: 0,
      [NivelRisco.MUITO_ALTO]: 0,
      'NAO_AVALIADO': 0,
    };
    
    screening.resultados.forEach((resultado: ScreeningResult) => {
      if (resultado.nivelRisco) {
        counts[resultado.nivelRisco]++;
      } else {
        counts['NAO_AVALIADO']++;
      }
    });
    
    return [
      { name: 'Baixo', value: counts[NivelRisco.BAIXO], color: '#10B981' },
      { name: 'Moderado', value: counts[NivelRisco.MODERADO], color: '#FBBF24' },
      { name: 'Alto', value: counts[NivelRisco.ALTO], color: '#F97316' },
      { name: 'Muito Alto', value: counts[NivelRisco.MUITO_ALTO], color: '#EF4444' },
      { name: 'Não Avaliado', value: counts['NAO_AVALIADO'], color: '#9CA3AF' },
    ].filter(item => item.value > 0);
  };

  // Filtrar resultados por nível de risco
  const filteredResults = screening?.resultados?.filter((resultado: ScreeningResult) => {
    if (selectedRiskLevel === 'all') return true;
    if (selectedRiskLevel === 'none') return !resultado.nivelRisco;
    return resultado.nivelRisco === selectedRiskLevel;
  });

  // Verificar se há estudantes em risco
  const hasStudentsAtRisk = screening?.resultados?.some(
    (resultado: ScreeningResult) => 
      resultado.nivelRisco === NivelRisco.ALTO || 
      resultado.nivelRisco === NivelRisco.MUITO_ALTO
  );

  // Renderizar tela de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando resultados do rastreio...</span>
        </div>
      </div>
    );
  }

  // Renderizar mensagem de erro
  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Erro ao carregar resultados do rastreio. Tente novamente mais tarde.
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
          onClick={() => router.push('/screening')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Resultados do Rastreio</h1>
          <p className="text-gray-500">
            {screening?.instrumento?.nome} - {screening?.estudante?.name} ({screening?.estudante?.grade}) - {formatDate(screening?.dataAplicacao)}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="results">
            Resultados
          </TabsTrigger>
          <TabsTrigger value="charts">
            Gráficos
          </TabsTrigger>
          <TabsTrigger value="actions">
            Ações Recomendadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resultados por Indicador</CardTitle>
                  <CardDescription>
                    Resultados obtidos para cada indicador do instrumento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Select
                      value={selectedRiskLevel}
                      onValueChange={setSelectedRiskLevel}
                    >
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue placeholder="Filtrar por nível de risco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os níveis</SelectItem>
                        <SelectItem value="none">Não avaliados</SelectItem>
                        {Object.values(NivelRisco).map((risk) => (
                          <SelectItem key={risk} value={risk}>
                            {formatRiskName(risk)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicador</TableHead>
                        <TableHead className="text-center">Valor</TableHead>
                        <TableHead className="text-center">Ponto de Corte</TableHead>
                        <TableHead className="text-center">Nível de Risco</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResults?.length > 0 ? (
                        filteredResults.map((resultado: ScreeningResult) => (
                          <TableRow key={resultado.id}>
                            <TableCell className="font-medium">
                              {resultado.indicador.nome}
                            </TableCell>
                            <TableCell className="text-center">
                              {resultado.valor}
                            </TableCell>
                            <TableCell className="text-center">
                              {resultado.indicador.pontoCorte}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={getRiskBadgeColor(resultado.nivelRisco)}>
                                <span className="flex items-center">
                                  {getRiskIcon(resultado.nivelRisco)}
                                  {formatRiskName(resultado.nivelRisco)}
                                </span>
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            Nenhum resultado encontrado com os filtros selecionados.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                  <CardDescription>
                    Resumo dos resultados do rastreio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Instrumento</h3>
                      <p>{screening?.instrumento?.nome}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Estudante</h3>
                      <p>{screening?.estudante?.name} ({screening?.estudante?.grade})</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Data de Aplicação</h3>
                      <p>{formatDate(screening?.dataAplicacao)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Aplicador</h3>
                      <p>{screening?.aplicador?.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Indicadores Avaliados</h3>
                      <p>{screening?.resultados?.length || 0} de {screening?.instrumento?.indicadores?.length || 0}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nível de Risco Predominante</h3>
                      {screening?.resultados?.length > 0 ? (
                        <Badge className={getRiskBadgeColor(
                          screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.MUITO_ALTO) ? NivelRisco.MUITO_ALTO :
                          screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.ALTO) ? NivelRisco.ALTO :
                          screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.MODERADO) ? NivelRisco.MODERADO :
                          NivelRisco.BAIXO
                        )}>
                          <span className="flex items-center">
                            {getRiskIcon(
                              screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.MUITO_ALTO) ? NivelRisco.MUITO_ALTO :
                              screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.ALTO) ? NivelRisco.ALTO :
                              screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.MODERADO) ? NivelRisco.MODERADO :
                              NivelRisco.BAIXO
                            )}
                            {formatRiskName(
                              screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.MUITO_ALTO) ? NivelRisco.MUITO_ALTO :
                              screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.ALTO) ? NivelRisco.ALTO :
                              screening.resultados.some((r: ScreeningResult) => r.nivelRisco === NivelRisco.MODERADO) ? NivelRisco.MODERADO :
                              NivelRisco.BAIXO
                            )}
                          </span>
                        </Badge>
                      ) : (
                        <span className="text-gray-500">Não avaliado</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Valores por Indicador</CardTitle>
                <CardDescription>
                  Comparação entre os valores obtidos e os pontos de corte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="valor" name="Valor Obtido" fill="#3B82F6" />
                      <Bar dataKey="pontoCorte" name="Ponto de Corte" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Níveis de Risco</CardTitle>
                <CardDescription>
                  Distribuição dos indicadores por nível de risco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareRiskDistributionData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareRiskDistributionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Ações Recomendadas</CardTitle>
              <CardDescription>
                Com base nos resultados do rastreio, recomendamos as seguintes ações
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasStudentsAtRisk ? (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Este estudante apresenta indicadores de alto risco que requerem atenção imediata.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Ações recomendadas:</h3>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <UserPlus className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Encaminhar para avaliação especializada</h4>
                        <p className="text-sm text-gray-500">
                          Encaminhe o estudante para uma avaliação mais detalhada com um especialista.
                        </p>
                        <Button className="mt-2" variant="outline" size="sm">
                          Criar encaminhamento
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Criar plano de intervenção</h4>
                        <p className="text-sm text-gray-500">
                          Desenvolva um plano de intervenção específico para as áreas identificadas como de risco.
                        </p>
                        <Button className="mt-2" variant="outline" size="sm">
                          Criar plano de intervenção
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <AlertCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Agendar reunião com equipe multidisciplinar</h4>
                        <p className="text-sm text-gray-500">
                          Agende uma reunião com a equipe multidisciplinar para discutir os resultados e definir estratégias.
                        </p>
                        <Button className="mt-2" variant="outline" size="sm">
                          Agendar reunião
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full">
                      Aplicar todas as ações recomendadas
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Este estudante não apresenta indicadores de alto risco que requeiram atenção imediata.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Ações recomendadas:</h3>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Monitoramento contínuo</h4>
                        <p className="text-sm text-gray-500">
                          Continue monitorando o progresso do estudante e realize novos rastreios periodicamente.
                        </p>
                        <Button className="mt-2" variant="outline" size="sm">
                          Agendar próximo rastreio
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 