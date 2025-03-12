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

export default function NewInterventionPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      type: '',
      description: '',
      status: 'ACTIVE',
      notes: '',
      studentId: '',
    },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        toast.error('Erro ao carregar a lista de alunos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      // Se endDate estiver vazio, envie como undefined
      const formattedData = {
        ...data,
        endDate: data.endDate && data.endDate.trim() !== '' ? data.endDate : undefined,
      };

      const response = await api.post('/interventions', formattedData);
      toast.success('Intervenção criada com sucesso!');
      router.push(`/interventions/${response.data.id}`);
    } catch (error) {
      console.error('Erro ao criar intervenção:', error);
      toast.error('Erro ao criar intervenção.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Nova Intervenção</h1>
        <Button variant="outline" onClick={() => router.push('/interventions')}>
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
                            {students.length === 0 ? (
                              <SelectItem value="all-types" disabled>
                                Nenhum aluno encontrado
                              </SelectItem>
                            ) : (
                              students.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name} - {student.grade}
                                </SelectItem>
                              ))
                            )}
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
                <Button type="submit">Criar Intervenção</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 