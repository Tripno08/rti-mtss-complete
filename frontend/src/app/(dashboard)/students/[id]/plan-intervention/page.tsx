'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { 
  ArrowLeft,
  Loader2,
  Target,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react';
import { api } from '@/lib/utils/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Enums
enum NivelRTI {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
}

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
  dificuldades: LearningDifficulty[];
}

interface LearningDifficulty {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  nivelRisco: string;
}

interface Intervention {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  nivelRTI: NivelRTI;
  tempoSessao: string;
  frequenciaSemanal: number;
  duracaoSemanas: number;
  tamanhoGrupo: string;
}

interface Goal {
  id: string;
  descricao: string;
  criterioSucesso: string;
  prazo: string;
  status: StatusMeta;
}

// Store Zustand
interface PlanStore {
  student: Student | null;
  selectedDifficulty: string | null;
  recommendedInterventions: Intervention[];
  isLoading: boolean;
  error: string | null;
  fetchStudent: (id: string) => Promise<void>;
  fetchRecommendedInterventions: (difficultyId: string) => Promise<void>;
  setSelectedDifficulty: (id: string | null) => void;
}

const usePlanStore = create<PlanStore>((set) => ({
  student: null,
  selectedDifficulty: null,
  recommendedInterventions: [],
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
  fetchRecommendedInterventions: async (difficultyId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/interventions/recommended/${difficultyId}`);
      set({ recommendedInterventions: response.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: 'Erro ao carregar intervenções recomendadas', isLoading: false });
    }
  },
  setSelectedDifficulty: (id: string | null) => set({ selectedDifficulty: id }),
}));

// Schema de validação para o formulário de plano de intervenção
const formSchema = z.object({
  dificuldadeId: z.string({
    required_error: "Selecione uma dificuldade",
  }),
  intervencaoId: z.string({
    required_error: "Selecione uma intervenção",
  }),
  dataInicio: z.string({
    required_error: "Selecione uma data de início",
  }),
  frequenciaSemanal: z.number({
    required_error: "Informe a frequência semanal",
  }).min(1),
  duracaoSemanas: z.number({
    required_error: "Informe a duração em semanas",
  }).min(1),
  observacoes: z.string().optional(),
  metas: z.array(z.object({
    descricao: z.string({
      required_error: "Informe a descrição da meta",
    }),
    criterioSucesso: z.string({
      required_error: "Informe o critério de sucesso",
    }),
    prazo: z.string({
      required_error: "Selecione um prazo",
    }),
  })).min(1, "Adicione pelo menos uma meta"),
});

export default function PlanInterventionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [goals, setGoals] = useState<{ id: string; descricao: string; criterioSucesso: string; prazo: string }[]>([]);

  const { 
    student, 
    selectedDifficulty,
    recommendedInterventions,
    isLoading,
    error,
    fetchStudent,
    fetchRecommendedInterventions,
    setSelectedDifficulty
  } = usePlanStore();

  // Carregar dados do estudante ao montar o componente
  useState(() => {
    fetchStudent(params.id);
  });

  // Configurar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dificuldadeId: '',
      intervencaoId: '',
      dataInicio: format(new Date(), 'yyyy-MM-dd'),
      frequenciaSemanal: 2,
      duracaoSemanas: 8,
      observacoes: '',
      metas: [],
    },
  });

  // Função para adicionar uma nova meta
  const addGoal = () => {
    const newGoal = {
      id: Math.random().toString(36).substr(2, 9),
      descricao: '',
      criterioSucesso: '',
      prazo: format(new Date(), 'yyyy-MM-dd'),
    };
    setGoals([...goals, newGoal]);
  };

  // Função para remover uma meta
  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  // Função para criar o plano de intervenção
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await api.post('/intervention-plans', {
        ...values,
        estudanteId: params.id,
      });
      toast.success('Plano de intervenção criado com sucesso');
      router.push(`/students/${params.id}`);
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      toast.error('Erro ao criar plano de intervenção');
    }
  };

  // Função para formatar o nome da categoria
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Função para obter a cor do badge de nível de risco
  const getRiskBadgeColor = (risk: string) => {
    const colors: Record<string, string> = {
      BAIXO: 'bg-green-100 text-green-800',
      MODERADO: 'bg-yellow-100 text-yellow-800',
      ALTO: 'bg-orange-100 text-orange-800',
      MUITO_ALTO: 'bg-red-100 text-red-800',
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  // Função para obter a cor do badge de nível RTI
  const getRTIBadgeColor = (level: NivelRTI) => {
    const colors: Record<NivelRTI, string> = {
      [NivelRTI.TIER_1]: 'bg-green-100 text-green-800',
      [NivelRTI.TIER_2]: 'bg-yellow-100 text-yellow-800',
      [NivelRTI.TIER_3]: 'bg-red-100 text-red-800',
    };
    return colors[level];
  };

  // Função para formatar o nível RTI
  const formatRTILevel = (level: NivelRTI) => {
    const names: Record<NivelRTI, string> = {
      [NivelRTI.TIER_1]: 'Tier 1 - Universal',
      [NivelRTI.TIER_2]: 'Tier 2 - Direcionado',
      [NivelRTI.TIER_3]: 'Tier 3 - Intensivo',
    };
    return names[level];
  };

  // Renderizar tela de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando dados...</span>
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
          onClick={() => router.push(`/students/${params.id}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Planejar Intervenção</h1>
          <p className="text-gray-500">
            {student.name} ({student.grade})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Dificuldades Identificadas</CardTitle>
              <CardDescription>
                Selecione a dificuldade alvo para a intervenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.dificuldades.map((dificuldade) => (
                  <Card
                    key={dificuldade.id}
                    className={`cursor-pointer transition-colors ${
                      selectedDifficulty === dificuldade.id
                        ? 'border-primary'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedDifficulty(dificuldade.id);
                      fetchRecommendedInterventions(dificuldade.id);
                      form.setValue('dificuldadeId', dificuldade.id);
                    }}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{dificuldade.nome}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {dificuldade.descricao}
                          </p>
                        </div>
                        <Badge className={getRiskBadgeColor(dificuldade.nivelRisco)}>
                          {dificuldade.nivelRisco}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline">
                          {formatCategoryName(dificuldade.categoria)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {selectedDifficulty && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Intervenções Recomendadas</CardTitle>
                      <CardDescription>
                        Selecione a intervenção mais adequada para a dificuldade selecionada
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="intervencaoId"
                        render={({ field }) => (
                          <FormItem>
                            <div className="space-y-4">
                              {recommendedInterventions.map((intervencao) => (
                                <Card
                                  key={intervencao.id}
                                  className={`cursor-pointer transition-colors ${
                                    field.value === intervencao.id
                                      ? 'border-primary'
                                      : 'hover:border-gray-300'
                                  }`}
                                  onClick={() => field.onChange(intervencao.id)}
                                >
                                  <CardContent className="pt-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-medium">{intervencao.nome}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {intervencao.descricao}
                                        </p>
                                      </div>
                                      <Badge className={getRTIBadgeColor(intervencao.nivelRTI)}>
                                        {formatRTILevel(intervencao.nivelRTI)}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                        {intervencao.tempoSessao}
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        {intervencao.frequenciaSemanal}x/semana
                                      </div>
                                      <div className="flex items-center">
                                        <Target className="h-4 w-4 mr-2 text-gray-500" />
                                        {intervencao.duracaoSemanas} semanas
                                      </div>
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                                        {intervencao.tamanhoGrupo}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configuração do Plano</CardTitle>
                      <CardDescription>
                        Configure os detalhes da aplicação da intervenção
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="dataInicio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Início</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="frequenciaSemanal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequência Semanal</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Número de sessões por semana
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="duracaoSemanas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duração (Semanas)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Duração total da intervenção
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Observações adicionais sobre a intervenção..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Metas SMART</CardTitle>
                          <CardDescription>
                            Defina metas específicas, mensuráveis, alcançáveis, relevantes e temporais
                          </CardDescription>
                        </div>
                        <Button type="button" variant="outline" onClick={addGoal}>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Meta
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {goals.map((goal, index) => (
                          <Card key={goal.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-medium">Meta {index + 1}</h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeGoal(goal.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              
                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name={`metas.${index}.descricao`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Descrição</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="Ex: Aumentar a fluência de leitura..."
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`metas.${index}.criterioSucesso`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Critério de Sucesso</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="Ex: Ler 60 palavras por minuto..."
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`metas.${index}.prazo`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Prazo</FormLabel>
                                      <FormControl>
                                        <Input type="date" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {goals.length === 0 && (
                          <div className="text-center py-6 text-gray-500">
                            Nenhuma meta definida. Clique em "Adicionar Meta" para começar.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg">
                      Criar Plano de Intervenção
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
} 