'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
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

// Interfaces
interface Student {
  id: string;
  name: string;
  grade: string;
}

interface Intervention {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
}

// Schema de validação para o formulário de meta
const formSchema = z.object({
  estudanteId: z.string({
    required_error: "Selecione um estudante",
  }),
  intervencaoId: z.string().optional(),
  descricao: z.string({
    required_error: "Informe a descrição da meta",
  }).min(10, "A descrição deve ter pelo menos 10 caracteres"),
  criterioSucesso: z.string({
    required_error: "Informe o critério de sucesso",
  }).min(10, "O critério deve ter pelo menos 10 caracteres"),
  prazo: z.string({
    required_error: "Selecione um prazo",
  }),
  observacoes: z.string().optional(),
});

// Dicas SMART
const smartTips = {
  specific: {
    title: 'Específica',
    description: 'A meta deve ser clara e específica, respondendo às perguntas: O quê? Por quê? Como?',
    examples: [
      'Ruim: "Melhorar a leitura"',
      'Bom: "Aumentar a fluência de leitura para 90 palavras por minuto"',
    ],
  },
  measurable: {
    title: 'Mensurável',
    description: 'A meta deve ter critérios mensuráveis para acompanhar o progresso',
    examples: [
      'Ruim: "Ler melhor"',
      'Bom: "Ler com precisão de 95% em textos do nível escolar"',
    ],
  },
  achievable: {
    title: 'Alcançável',
    description: 'A meta deve ser desafiadora, mas realista e alcançável',
    examples: [
      'Ruim: "Dominar todas as matérias em uma semana"',
      'Bom: "Melhorar a nota de matemática de 5 para 7 em dois meses"',
    ],
  },
  relevant: {
    title: 'Relevante',
    description: 'A meta deve ser relevante para as necessidades do estudante',
    examples: [
      'Ruim: "Aprender algo novo"',
      'Bom: "Desenvolver estratégias de organização para completar tarefas no prazo"',
    ],
  },
  timely: {
    title: 'Temporal',
    description: 'A meta deve ter um prazo definido para conclusão',
    examples: [
      'Ruim: "Algum dia"',
      'Bom: "Até o final do semestre (dd/mm/aaaa)"',
    ],
  },
} as const;

// Definindo um tipo para as chaves de smartTips
type SmartTipKey = keyof typeof smartTips;

export default function CreateGoalPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Configurar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estudanteId: '',
      intervencaoId: '',
      descricao: '',
      criterioSucesso: '',
      prazo: format(new Date(), 'yyyy-MM-dd'),
      observacoes: '',
    },
  });

  // Carregar estudantes e intervenções
  useState(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, interventionsResponse] = await Promise.all([
          api.get('/students'),
          api.get('/interventions'),
        ]);
        setStudents(studentsResponse.data);
        setInterventions(interventionsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      }
    };
    fetchData();
  });

  // Função para criar a meta
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await api.post('/goals', values);
      toast.success('Meta criada com sucesso');
      router.push('/goals');
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      toast.error('Erro ao criar meta');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para validar se a meta é SMART
  const validateSmart = (values: z.infer<typeof formSchema>) => {
    const checks = {
      specific: values.descricao.length >= 20,
      measurable: values.criterioSucesso.includes('%') || /\d+/.test(values.criterioSucesso),
      achievable: true, // Subjetivo, depende do contexto
      relevant: values.descricao.toLowerCase().includes('para') || values.descricao.toLowerCase().includes('objetivo'),
      timely: values.prazo !== '',
    };

    return checks;
  };

  // Preview da meta
  const GoalPreview = ({ values }: { values: z.infer<typeof formSchema> }) => {
    const smartChecks = validateSmart(values);
    const student = students.find(s => s.id === values.estudanteId);
    const intervention = values.intervencaoId ? 
      interventions.find(i => i.id === values.intervencaoId) : null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Preview da Meta</CardTitle>
          <CardDescription>
            Visualize como a meta ficará antes de salvar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Critérios SMART</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(smartChecks).map(([key, value]) => (
                <Badge
                  key={key}
                  variant={value ? 'default' : 'outline'}
                  className={value ? 'bg-green-100 text-green-800' : 'text-gray-500'}
                >
                  {value ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-1" />
                  )}
                  {smartTips[key as SmartTipKey].title}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Estudante</h4>
              <p>{student?.name} ({student?.grade})</p>
            </div>

            {intervention && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Intervenção</h4>
                <p>{intervention.nome}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-500">Descrição</h4>
              <p>{values.descricao || 'Não definida'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Critério de Sucesso</h4>
              <p>{values.criterioSucesso || 'Não definido'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Prazo</h4>
              <p>{values.prazo ? format(new Date(values.prazo), 'dd/MM/yyyy', { locale: ptBR }) : 'Não definido'}</p>
            </div>

            {values.observacoes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Observações</h4>
                <p>{values.observacoes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/goals')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Meta SMART</h1>
          <p className="text-gray-500">
            Crie uma meta específica, mensurável, alcançável, relevante e temporal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Definição da Meta</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para criar uma meta SMART
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="estudanteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estudante</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um estudante" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {students.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.grade})
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
                    name="intervencaoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intervenção (Opcional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma intervenção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Nenhuma</SelectItem>
                            {interventions.map((intervention) => (
                              <SelectItem key={intervention.id} value={intervention.id}>
                                {intervention.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Associe esta meta a uma intervenção existente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Descrição
                          <HoverCard>
                            <HoverCardTrigger>
                              <Info className="h-4 w-4 text-gray-500" />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">Dicas para uma boa descrição</h4>
                                <p className="text-sm">{smartTips.specific.description}</p>
                                <div className="pt-2">
                                  <p className="text-sm font-medium">Exemplos:</p>
                                  <ul className="text-sm list-disc list-inside">
                                    {smartTips.specific.examples.map((example, index) => (
                                      <li key={index}>{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o objetivo específico da meta..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Seja específico sobre o que deseja alcançar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="criterioSucesso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Critério de Sucesso
                          <HoverCard>
                            <HoverCardTrigger>
                              <Info className="h-4 w-4 text-gray-500" />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">Dicas para critérios mensuráveis</h4>
                                <p className="text-sm">{smartTips.measurable.description}</p>
                                <div className="pt-2">
                                  <p className="text-sm font-medium">Exemplos:</p>
                                  <ul className="text-sm list-disc list-inside">
                                    {smartTips.measurable.examples.map((example, index) => (
                                      <li key={index}>{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Defina como o sucesso será medido..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use números, porcentagens ou critérios objetivos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prazo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Prazo
                          <HoverCard>
                            <HoverCardTrigger>
                              <Info className="h-4 w-4 text-gray-500" />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">Dicas para definir prazos</h4>
                                <p className="text-sm">{smartTips.timely.description}</p>
                                <div className="pt-2">
                                  <p className="text-sm font-medium">Exemplos:</p>
                                  <ul className="text-sm list-disc list-inside">
                                    {smartTips.timely.examples.map((example, index) => (
                                      <li key={index}>{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Defina uma data limite realista
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Observações adicionais sobre a meta..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Criar Meta
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <GoalPreview values={form.getValues()} />

          <Card>
            <CardHeader>
              <CardTitle>Critérios SMART</CardTitle>
              <CardDescription>
                Verifique se sua meta atende a todos os critérios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(smartTips).map(([key, tip]) => (
                  <div key={key}>
                    <h4 className="font-medium flex items-center gap-2">
                      {tip.title}
                      <Badge variant="outline">
                        {key.toUpperCase()}
                      </Badge>
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {tip.description}
                    </p>
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Exemplos:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {tip.examples.map((example, index) => (
                          <li 
                            key={index}
                            className={index === 0 ? 'text-red-500' : 'text-green-500'}
                          >
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 