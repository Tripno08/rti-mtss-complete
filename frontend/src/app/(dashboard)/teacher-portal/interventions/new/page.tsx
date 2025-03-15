'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { getStudents, Student } from '@/lib/api/students';
import { getClassesByTeacher, Class } from '@/lib/api/classes';
import { createIntervention, CreateInterventionDto } from '@/lib/api/interventions';
import { useAuthStore } from '@/lib/stores/auth';

// Esquema de validação
const interventionSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  type: z.enum(['individual', 'group']),
  studentIds: z.array(z.string()).optional(),
  classId: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.enum(['daily', 'weekly', 'monthly']).optional(),
  recurrenceDays: z.array(z.string()).optional(),
  goals: z.string().min(10, 'Os objetivos devem ter pelo menos 10 caracteres'),
  materials: z.string().optional(),
  notes: z.string().optional(),
});

type InterventionFormValues = z.infer<typeof interventionSchema>;

export default function NewInterventionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams?.get('studentId');
  const classId = searchParams?.get('classId');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const currentUser = useAuthStore((state) => state.user);

  // Inicializar o formulário com valores padrão
  const form = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionSchema),
    defaultValues: {
      title: '',
      description: '',
      type: studentId ? 'individual' : (classId ? 'group' : 'individual'),
      studentIds: studentId ? [studentId] : [],
      classId: classId || '',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      startTime: '08:00',
      endTime: '09:00',
      isRecurring: false,
      recurrencePattern: 'weekly',
      recurrenceDays: ['1', '3', '5'], // Segunda, Quarta, Sexta
      goals: '',
      materials: '',
      notes: '',
    },
  });

  // Observar mudanças no tipo de intervenção
  const interventionType = form.watch('type');
  const isRecurring = form.watch('isRecurring');
  const recurrencePattern = form.watch('recurrencePattern');

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        
        // Buscar estudantes
        const studentsData = await getStudents();
        setStudents(studentsData);
        
        // Buscar turmas do professor atual
        const classesData = await getClassesByTeacher(currentUser.id);
        setClasses(classesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: InterventionFormValues) => {
    setIsSubmitting(true);
    try {
      // Preparar dados para a API
      const interventionData: CreateInterventionDto = {
        type: data.title,
        description: data.description,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        status: 'ACTIVE',
        notes: `${data.goals}\n\nMateriais: ${data.materials || 'Nenhum'}\n\nNotas adicionais: ${data.notes || 'Nenhuma'}\n\nHorário: ${data.startTime} - ${data.endTime}\nRecorrência: ${data.isRecurring ? `${data.recurrencePattern} (dias: ${data.recurrenceDays?.join(', ')})` : 'Não recorrente'}`,
        studentId: interventionType === 'individual' && data.studentIds && data.studentIds.length > 0 
          ? data.studentIds[0] 
          : students[0]?.id // Fallback para o primeiro estudante se nenhum for selecionado
      };
      
      // Enviar para a API
      await createIntervention(interventionData);
      
      toast.success('Intervenção criada com sucesso!');
      
      // Redirecionar após o sucesso
      router.push('/teacher-portal/interventions');
    } catch (error) {
      console.error('Erro ao criar intervenção:', error);
      toast.error('Erro ao criar intervenção. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dias da semana para seleção de recorrência
  const weekdays = [
    { value: '0', label: 'Domingo' },
    { value: '1', label: 'Segunda' },
    { value: '2', label: 'Terça' },
    { value: '3', label: 'Quarta' },
    { value: '4', label: 'Quinta' },
    { value: '5', label: 'Sexta' },
    { value: '6', label: 'Sábado' },
  ];

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-muted-foreground">Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Nova Intervenção</h1>
          <p className="text-muted-foreground">
            Crie uma nova intervenção individual ou em grupo
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Intervenção</CardTitle>
          <CardDescription>
            Preencha as informações para criar uma nova intervenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título da intervenção" {...field} />
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
                      <FormLabel>Tipo de Intervenção</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="individual" />
                            </FormControl>
                            <FormLabel className="font-normal">Individual</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="group" />
                            </FormControl>
                            <FormLabel className="font-normal">Em Grupo</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva a intervenção em detalhes"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {interventionType === 'individual' ? (
                <FormField
                  control={form.control}
                  name="studentIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alunos</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.[0] || ''}
                          onValueChange={(value) => field.onChange([value])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                          <SelectContent>
                            {students.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} - {student.grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma turma" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name} - {cls.grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Término</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Início</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Término</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Intervenção Recorrente</FormLabel>
                      <FormDescription>
                        Ative para definir um padrão de recorrência
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isRecurring && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="recurrencePattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Padrão de Recorrência</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um padrão" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Diário</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensal</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {recurrencePattern === 'weekly' && (
                    <FormField
                      control={form.control}
                      name="recurrenceDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dias da Semana</FormLabel>
                          <div className="grid grid-cols-4 gap-2">
                            {weekdays.map((day) => (
                              <FormItem
                                key={day.value}
                                className="flex items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValue, day.value]);
                                      } else {
                                        field.onChange(
                                          currentValue.filter((value) => value !== day.value)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os objetivos da intervenção"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materiais Necessários</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste os materiais necessários para a intervenção"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Opcional. Liste os materiais que serão utilizados.
                    </FormDescription>
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
                        placeholder="Observações adicionais"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Opcional. Adicione observações relevantes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Criando...' : 'Criar Intervenção'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 