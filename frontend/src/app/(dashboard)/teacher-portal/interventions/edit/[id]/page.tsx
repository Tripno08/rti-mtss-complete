"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Tipos para estudante e turma
interface Student {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
}

// Esquema de validação para o formulário
const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  studentId: z.string({
    required_error: "Por favor selecione um aluno.",
  }),
  classId: z.string({
    required_error: "Por favor selecione uma turma.",
  }),
  tier: z.enum(["Tier 1", "Tier 2", "Tier 3"], {
    required_error: "Por favor selecione um tier.",
  }),
  startDate: z.date({
    required_error: "Por favor selecione uma data de início.",
  }),
  endDate: z.date({
    required_error: "Por favor selecione uma data de término.",
  }),
  frequency: z.string().min(3, {
    message: "Por favor informe a frequência da intervenção.",
  }),
  duration: z.string().min(3, {
    message: "Por favor informe a duração da intervenção.",
  }),
  notes: z.string().optional(),
  status: z.enum(["active", "completed", "cancelled"], {
    required_error: "Por favor selecione um status.",
  }),
});

// Tipo para a intervenção
interface Intervention {
  id: string;
  title: string;
  description: string;
  student: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  status: "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  frequency: string;
  duration: string;
  notes: string;
}

export default function EditInterventionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  // Inicializar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      studentId: "",
      classId: "",
      tier: undefined,
      startDate: undefined,
      endDate: undefined,
      frequency: "",
      duration: "",
      notes: "",
      status: undefined,
    },
  });

  useEffect(() => {
    // Simulação de carregamento de dados
    const timer = setTimeout(() => {
      // Dados mockados para demonstração
      const mockStudents: Student[] = [
        { id: "s1", name: "João Silva" },
        { id: "s2", name: "Maria Oliveira" },
        { id: "s3", name: "Pedro Santos" },
        { id: "s4", name: "Ana Costa" },
        { id: "s5", name: "Lucas Ferreira" },
      ];
      
      const mockClasses: Class[] = [
        { id: "c1", name: "3º Ano A" },
        { id: "c2", name: "4º Ano B" },
        { id: "c3", name: "5º Ano A" },
      ];

      // Dados mockados da intervenção
      const mockIntervention: Intervention = {
        id,
        title: "Leitura Diária Guiada",
        description: "Sessões de leitura guiada para melhorar a fluência e compreensão",
        student: {
          id: "s1",
          name: "João Silva"
        },
        class: {
          id: "c1",
          name: "3º Ano A"
        },
        tier: "Tier 2",
        status: "active",
        startDate: "2023-09-01",
        endDate: "2023-12-15",
        frequency: "3 vezes por semana",
        duration: "20 minutos",
        notes: "O aluno demonstra dificuldade com palavras multissilábicas. Prefere leitura em voz alta com apoio."
      };

      setStudents(mockStudents);
      setClasses(mockClasses);
      setIntervention(mockIntervention);
      
      // Preencher o formulário com os dados da intervenção
      form.reset({
        title: mockIntervention.title,
        description: mockIntervention.description,
        studentId: mockIntervention.student.id,
        classId: mockIntervention.class.id,
        tier: mockIntervention.tier,
        startDate: new Date(mockIntervention.startDate),
        endDate: new Date(mockIntervention.endDate),
        frequency: mockIntervention.frequency,
        duration: mockIntervention.duration,
        notes: mockIntervention.notes,
        status: mockIntervention.status,
      });
      
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [form, id]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    
    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log dos valores do formulário para depuração
      console.log("Valores do formulário:", values);
      
      // Exibir mensagem de sucesso
      toast.success("Intervenção atualizada com sucesso!");
      
      // Redirecionar para a página de detalhes
      router.push(`/teacher-portal/interventions/${id}`);
    } catch (error) {
      toast.error("Erro ao atualizar intervenção. Tente novamente.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <EditInterventionSkeleton />;
  }

  // Verificar se a intervenção foi carregada corretamente
  if (!intervention) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-2">Intervenção não encontrada</h2>
          <p className="text-muted-foreground mb-4">A intervenção solicitada não existe ou foi removida.</p>
          <Button onClick={() => router.push("/teacher-portal/interventions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para intervenções
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
          onClick={() => router.push(`/teacher-portal/interventions/${id}`)}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Intervenção</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Informações gerais sobre a intervenção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Reforço de Leitura" {...field} />
                    </FormControl>
                    <FormDescription>
                      Um título claro e descritivo para a intervenção.
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
                        placeholder="Descreva os objetivos e métodos da intervenção..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Detalhes sobre como a intervenção será implementada.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aluno</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        O aluno que receberá a intervenção.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma turma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        A turma do aluno.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tier da Intervenção</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        value={field.value}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Tier 1" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tier 1 - Intervenção Universal
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Tier 2" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tier 2 - Intervenção Direcionada
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Tier 3" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tier 3 - Intervenção Intensiva
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      O nível de intensidade da intervenção.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status da Intervenção</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        value={field.value}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="active" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Ativa
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="completed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Concluída
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="cancelled" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Cancelada
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      O status atual da intervenção.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cronograma</CardTitle>
              <CardDescription>
                Período e frequência da intervenção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
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
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Quando a intervenção começará.
                      </FormDescription>
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
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
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
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Quando a intervenção terminará.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 3 vezes por semana" {...field} />
                      </FormControl>
                      <FormDescription>
                        Com que frequência a intervenção ocorrerá.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 30 minutos" {...field} />
                      </FormControl>
                      <FormDescription>
                        Quanto tempo durará cada sessão.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notas Adicionais</CardTitle>
              <CardDescription>
                Informações complementares sobre a intervenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações adicionais sobre a intervenção..." 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Detalhes específicos, estratégias ou observações importantes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/teacher-portal/interventions/${id}`)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

// Componente de esqueleto para carregamento
function EditInterventionSkeleton() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-24 mr-4" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 