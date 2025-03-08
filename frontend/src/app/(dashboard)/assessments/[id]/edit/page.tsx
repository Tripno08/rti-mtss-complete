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

interface Assessment {
  id: string;
  date: string;
  type: string;
  score: number;
  notes?: string;
  studentId: string;
  student?: Student;
}

const formSchema = z.object({
  date: z.string().min(1, 'A data é obrigatória'),
  type: z.string().min(1, 'O tipo é obrigatório'),
  score: z.coerce.number().min(0, 'A pontuação deve ser maior ou igual a 0'),
  notes: z.string().optional(),
  studentId: z.string().min(1, 'O aluno é obrigatório'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditAssessmentPage({ params }: { params: { id: string } }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: '',
      type: '',
      score: 0,
      notes: '',
      studentId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentResponse, studentsResponse] = await Promise.all([
          api.get(`/assessments/${params.id}`),
          api.get('/students'),
        ]);

        const assessmentData = assessmentResponse.data;
        setAssessment(assessmentData);
        setStudents(studentsResponse.data);

        // Formatar a data para o formato esperado pelo input date
        const formattedDate = new Date(assessmentData.date).toISOString().split('T')[0];

        form.reset({
          date: formattedDate,
          type: assessmentData.type,
          score: assessmentData.score,
          notes: assessmentData.notes || '',
          studentId: assessmentData.studentId,
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao carregar os dados da avaliação.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await api.patch(`/assessments/${params.id}`, data);
      toast.success('Avaliação atualizada com sucesso!');
      router.push(`/assessments/${params.id}`);
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      toast.error('Erro ao atualizar avaliação.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Avaliação não encontrada.</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push('/assessments')}>Voltar para a lista</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Editar Avaliação</h1>
        <Button variant="outline" onClick={() => router.push(`/assessments/${params.id}`)}>
          Cancelar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
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
                            <SelectItem value="Leitura">Leitura</SelectItem>
                            <SelectItem value="Matemática">Matemática</SelectItem>
                            <SelectItem value="Comportamento">Comportamento</SelectItem>
                            <SelectItem value="Escrita">Escrita</SelectItem>
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
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pontuação</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
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