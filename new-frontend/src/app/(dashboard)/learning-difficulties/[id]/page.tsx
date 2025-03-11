'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Definindo o tipo de severidade
type Severity = 'MILD' | 'MODERATE' | 'SEVERE';

// Interface para dificuldade de aprendizagem
interface LearningDifficulty {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: Severity;
  studentId: string;
  student?: {
    id: string;
    name: string;
    grade: string;
  };
  identifiedDate: string;
}

// Dados simulados
const mockDifficulties: LearningDifficulty[] = [
  {
    id: '1',
    name: 'Dislexia',
    description: 'Dificuldade na leitura e interpretação de textos',
    category: 'Leitura',
    severity: 'MODERATE',
    studentId: '1',
    student: {
      id: '1',
      name: 'João Silva',
      grade: '3º Ano'
    },
    identifiedDate: '2025-01-15'
  },
  {
    id: '2',
    name: 'Discalculia',
    description: 'Dificuldade em compreender e trabalhar com números e conceitos matemáticos',
    category: 'Matemática',
    severity: 'MILD',
    studentId: '2',
    student: {
      id: '2',
      name: 'Ana Souza',
      grade: '2º Ano'
    },
    identifiedDate: '2025-02-10'
  },
  {
    id: '3',
    name: 'TDAH',
    description: 'Transtorno de Déficit de Atenção e Hiperatividade',
    category: 'Comportamental',
    severity: 'SEVERE',
    studentId: '3',
    student: {
      id: '3',
      name: 'Pedro Santos',
      grade: '4º Ano'
    },
    identifiedDate: '2025-01-05'
  },
  {
    id: '4',
    name: 'Disgrafia',
    description: 'Dificuldade na escrita e coordenação motora fina',
    category: 'Escrita',
    severity: 'MODERATE',
    studentId: '4',
    student: {
      id: '4',
      name: 'Mariana Costa',
      grade: '1º Ano'
    },
    identifiedDate: '2025-03-01'
  }
];

const mockStudents = [
  { id: '1', name: 'João Silva', grade: '3º Ano' },
  { id: '2', name: 'Ana Souza', grade: '2º Ano' },
  { id: '3', name: 'Pedro Santos', grade: '4º Ano' },
  { id: '4', name: 'Mariana Costa', grade: '1º Ano' },
  { id: '5', name: 'Lucas Oliveira', grade: '5º Ano' }
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }),
  category: z.string().min(1, {
    message: 'Selecione uma categoria.',
  }),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE'])
    .refine(val => val, {
      message: 'Selecione um nível de severidade.',
    }),
  studentId: z.string().min(1, {
    message: 'Selecione um estudante.',
  }),
  identifiedDate: z.string().min(1, {
    message: 'Selecione uma data.',
  }),
});

interface PageProps {
  params: {
    id: string;
  };
}

export default function LearningDifficultyPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  const isNew = id === 'new';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [difficulty, setDifficulty] = useState<LearningDifficulty | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      severity: 'MODERATE',
      studentId: '',
      identifiedDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    setIsClient(true);
    
    // Simular carregamento de dados
    setTimeout(() => {
      if (!isNew) {
        const foundDifficulty = mockDifficulties.find((d: LearningDifficulty) => d.id === id);
        if (foundDifficulty) {
          setDifficulty(foundDifficulty);
          form.reset({
            name: foundDifficulty.name,
            description: foundDifficulty.description,
            category: foundDifficulty.category,
            severity: foundDifficulty.severity,
            studentId: foundDifficulty.studentId,
            identifiedDate: foundDifficulty.identifiedDate,
          });
        } else {
          toast.error('Dificuldade de aprendizagem não encontrada');
          router.push('/learning-difficulties');
        }
      }
      setIsLoading(false);
    }, 500);
  }, [id, isNew, form, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simular envio de dados
    setTimeout(() => {
      try {
        // Simulação de sucesso
        toast.success(isNew 
          ? 'Dificuldade de aprendizagem criada com sucesso!' 
          : 'Dificuldade de aprendizagem atualizada com sucesso!'
        );
        
        // Redirecionar após sucesso
        router.push('/learning-difficulties');
      } catch (error) {
        console.error('Erro ao salvar:', error);
        toast.error('Erro ao salvar. Esta é uma versão de demonstração com dados simulados.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'MILD': return 'Leve';
      case 'MODERATE': return 'Moderada';
      case 'SEVERE': return 'Severa';
      default: return severity;
    }
  };

  // Se não estamos no cliente, renderizar um placeholder
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/learning-difficulties')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isNew ? 'Nova Dificuldade de Aprendizagem' : 'Editar Dificuldade de Aprendizagem'}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Preencha as informações sobre a dificuldade de aprendizagem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Dislexia" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome da dificuldade de aprendizagem
                      </FormDescription>
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
                        <Textarea 
                          placeholder="Descreva a dificuldade de aprendizagem" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Descrição detalhada da dificuldade
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Leitura, Matemática" {...field} />
                        </FormControl>
                        <FormDescription>
                          Categoria da dificuldade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severidade</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a severidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MILD">Leve</SelectItem>
                            <SelectItem value="MODERATE">Moderada</SelectItem>
                            <SelectItem value="SEVERE">Severa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Nível de severidade da dificuldade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentId"
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
                            {mockStudents.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.grade})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Estudante com a dificuldade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="identifiedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Identificação</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Data em que a dificuldade foi identificada
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push('/learning-difficulties')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      )}
    </div>
  );
} 