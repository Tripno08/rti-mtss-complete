'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/utils/api';

interface Student {
  id: string;
  name: string;
  grade: string;
}

interface Intervention {
  id: string;
  startDate: string;
  endDate?: string;
  type: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  studentId: string;
  student?: Student;
}

const formSchema = z.object({
  startDate: z.string().min(1, 'A data de início é obrigatória'),
  endDate: z.string().optional(),
  type: z.string().min(1, 'O tipo é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Selecione um status válido' }),
  }),
  notes: z.string().optional(),
  studentId: z.string().min(1, 'O aluno é obrigatório'),
});

type FormValues = z.infer<typeof formSchema>;

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditInterventionPage({ params }: PageProps) {
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      type: '',
      description: '',
      status: 'ACTIVE',
      notes: '',
      studentId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interventionResponse, studentsResponse] = await Promise.all([
          api.get(`/interventions/${params.id}`),
          api.get('/students'),
        ]);

        const interventionData = interventionResponse.data;
        setIntervention(interventionData);
        setStudents(studentsResponse.data);

        // Formatar as datas para o formato esperado pelo input date
        const startDate = new Date(interventionData.startDate).toISOString().split('T')[0];
        const endDate = interventionData.endDate 
          ? new Date(interventionData.endDate).toISOString().split('T')[0] 
          : '';

        form.reset({
          startDate,
          endDate,
          type: interventionData.type,
          description: interventionData.description,
          status: interventionData.status,
          notes: interventionData.notes || '',
          studentId: interventionData.studentId,
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao carregar os dados da intervenção.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Se endDate estiver vazio, envie como undefined
      const formattedData = {
        ...data,
        endDate: data.endDate && data.endDate.trim() !== '' ? data.endDate : undefined,
      };

      await api.patch(`/interventions/${params.id}`, formattedData);
      toast.success('Intervenção atualizada com sucesso!');
      router.push(`/interventions/${params.id}`);
    } catch (error) {
      console.error('Erro ao atualizar intervenção:', error);
      toast.error('Erro ao atualizar intervenção.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!intervention) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Intervenção não encontrada.</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push('/interventions')}>Voltar para a lista</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Editar Intervenção</h1>
        <Button variant="outline" onClick={() => router.push(`/interventions/${params.id}`)}>
          Cancelar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Intervenção</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
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

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Término (opcional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Acadêmica">Acadêmica</SelectItem>
                            <SelectItem value="Comportamental">Comportamental</SelectItem>
                            <SelectItem value="Social-Emocional">Social-Emocional</SelectItem>
                            <SelectItem value="Leitura">Leitura</SelectItem>
                            <SelectItem value="Matemática">Matemática</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Ativa</SelectItem>
                            <SelectItem value="COMPLETED">Concluída</SelectItem>
                            <SelectItem value="CANCELLED">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Aluno</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o aluno" />
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
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 