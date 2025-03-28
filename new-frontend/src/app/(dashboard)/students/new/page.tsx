'use client';

import { useState } from 'react';
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
import { ArrowLeft } from 'lucide-react';

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
  responsibleTeacher: z.string().min(3, 'O nome do professor deve ter pelo menos 3 caracteres'),
  notes: z.string().optional(),
});

type StudentForm = z.infer<typeof studentSchema>;

export default function NewStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      dateOfBirth: '',
      grade: '',
      responsibleTeacher: '',
      notes: '',
    },
  });

  const onSubmit = async (data: StudentForm) => {
    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Dados do estudante:', data);
      
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
            Adicione um novo estudante ao sistema RTI/MTSS
          </p>
        </div>
      </div>

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
                name="responsibleTeacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do professor" {...field} />
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
                  {isSubmitting ? 'Salvando...' : 'Salvar Estudante'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 