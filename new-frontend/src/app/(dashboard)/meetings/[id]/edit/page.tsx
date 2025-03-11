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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

// Schema de validação
const meetingSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  date: z.string().min(1, 'Selecione a data da reunião'),
  time: z.string().min(1, 'Selecione o horário da reunião'),
  type: z.string().min(1, 'Selecione o tipo de reunião'),
  location: z.string().min(3, 'O local deve ter pelo menos 3 caracteres'),
  organizer: z.string().min(3, 'O nome do organizador deve ter pelo menos 3 caracteres'),
  participants: z.string().min(3, 'Adicione pelo menos um participante'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  agenda: z.string().min(10, 'A agenda deve ter pelo menos 10 caracteres'),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled'], {
    required_error: 'Selecione o status da reunião',
  }),
});

type MeetingForm = z.infer<typeof meetingSchema>;

// Dados simulados
const mockMeeting = {
  id: '1',
  title: 'Revisão do Plano de Intervenção - João Silva',
  date: '2024-02-25',
  time: '14:00',
  type: 'Intervenção',
  location: 'Sala de Reuniões 1',
  participants: ['Maria Santos', 'Carlos Pereira', 'Ana Oliveira'],
  status: 'scheduled',
  organizer: 'Maria Santos',
  description: 'Reunião para revisar o progresso do plano de intervenção do aluno João Silva e ajustar as estratégias conforme necessário.',
  agenda: 'Apresentação dos resultados das últimas avaliações\nAnálise do progresso nas intervenções atuais\nDiscussão sobre ajustes necessários no plano\nDefinição de próximos passos e responsabilidades',
} as const;

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditMeetingPage({ params }: PageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MeetingForm>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: mockMeeting.title,
      date: mockMeeting.date,
      time: mockMeeting.time,
      type: mockMeeting.type,
      location: mockMeeting.location,
      organizer: mockMeeting.organizer,
      participants: mockMeeting.participants.join(', '),
      description: mockMeeting.description,
      agenda: mockMeeting.agenda,
      status: mockMeeting.status,
    },
  });

  const onSubmit = async (data: MeetingForm) => {
    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Atualizando reunião:', params.id, data);
      
      toast.success('Reunião atualizada com sucesso!');
      router.push(`/meetings/${params.id}`);
    } catch (error) {
      console.error('Erro ao atualizar reunião:', error);
      toast.error('Erro ao atualizar reunião. Tente novamente.');
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
          <h1 className="text-3xl font-bold tracking-tight">Editar Reunião</h1>
          <p className="text-muted-foreground">
            Atualize as informações da reunião
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Reunião</CardTitle>
          <CardDescription>
            Edite os dados da reunião conforme necessário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da reunião" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
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
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
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
                      <FormLabel>Tipo de Reunião</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Intervenção">Intervenção</SelectItem>
                          <SelectItem value="Avaliação">Avaliação</SelectItem>
                          <SelectItem value="Planejamento">Planejamento</SelectItem>
                          <SelectItem value="Pais">Pais</SelectItem>
                          <SelectItem value="Análise">Análise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input placeholder="Local da reunião" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizador</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do organizador" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Participantes</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome dos participantes (separados por vírgula)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Digite os nomes separados por vírgula
                      </FormDescription>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scheduled">Agendada</SelectItem>
                          <SelectItem value="in_progress">Em Andamento</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                          <SelectItem value="cancelled">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
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
                        placeholder="Descrição detalhada da reunião"
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
                name="agenda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agenda</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Itens da agenda (um por linha)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Digite cada item da agenda em uma nova linha
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
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 