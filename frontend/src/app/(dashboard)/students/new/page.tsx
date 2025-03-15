'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
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
} from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createStudent } from '@/lib/api/students';
import { getUsers, User } from '@/lib/api/users';
import { useAuthStore } from '@/lib/stores/auth';

// Schema de validação
const studentSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  dateOfBirth: z.string().refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 4 && age <= 18;
  }, 'A idade deve estar entre 4 e 18 anos'),
  grade: z.string().min(1, 'Selecione uma série'),
  userId: z.string().min(1, 'Selecione um professor responsável'),
  notes: z.string().optional(),
});

type StudentForm = z.infer<typeof studentSchema>;

export default function NewStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState<User[]>([]);
  const currentUser = useAuthStore((state) => state.user);

  const form = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      dateOfBirth: '',
      grade: '',
      userId: '',
      notes: '',
    },
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        const users = await getUsers();
        // Filtrar apenas usuários com papel de professor
        const teacherUsers = users.filter(user => user.role === 'TEACHER');
        setTeachers(teacherUsers);
        
        // Se o usuário atual for um professor, pré-selecionar
        if (currentUser && currentUser.role === 'TEACHER') {
          form.setValue('userId', currentUser.id);
        }
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
        toast.error('Erro ao carregar a lista de professores.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [form, currentUser]);

  const onSubmit = async (data: StudentForm) => {
    setIsSubmitting(true);
    try {
      // Criar o estudante usando a API real
      await createStudent({
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        grade: data.grade,
        userId: data.userId,
        // Adicionar notas se existirem
        ...(data.notes && { notes: data.notes }),
      });
      
      toast.success('Estudante adicionado com sucesso!');
      router.push('/students');
    } catch (error) {
      console.error('Erro ao adicionar estudante:', error);
      toast.error('Erro ao adicionar estudante. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Estudante</h1>
          <p className="text-muted-foreground">
            Adicione um novo estudante ao sistema Innerview
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Estudante</CardTitle>
            <CardDescription>
              Preencha os dados do novo estudante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do estudante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        O estudante deve ter entre 4 e 18 anos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Série</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a série" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1º Ano">1º Ano</SelectItem>
                          <SelectItem value="2º Ano">2º Ano</SelectItem>
                          <SelectItem value="3º Ano">3º Ano</SelectItem>
                          <SelectItem value="4º Ano">4º Ano</SelectItem>
                          <SelectItem value="5º Ano">5º Ano</SelectItem>
                          <SelectItem value="6º Ano">6º Ano</SelectItem>
                          <SelectItem value="7º Ano">7º Ano</SelectItem>
                          <SelectItem value="8º Ano">8º Ano</SelectItem>
                          <SelectItem value="9º Ano">9º Ano</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professor Responsável</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o professor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.length === 0 ? (
                            <SelectItem value="no-teachers" disabled>
                              Nenhum professor encontrado
                            </SelectItem>
                          ) : (
                            teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
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
                        <Input
                          placeholder="Observações adicionais sobre o estudante"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Opcional: Adicione informações relevantes sobre o estudante
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
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Estudante'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 