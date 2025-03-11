'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface Team {
  id: string;
  name: string;
}

export interface Participant {
  id: string;
  name: string;
  role: string;
}

export interface Meeting {
  id?: string;
  title: string;
  date: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  teamId: string;
  location: string;
  notes?: string;
  participants?: Participant[];
  participantIds?: string[];
}

const formSchema = z.object({
  title: z.string().min(5, { message: 'O título deve ter pelo menos 5 caracteres' }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Data inválida',
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Formato de hora inválido (HH:MM)',
  }),
  teamId: z.string().min(1, { message: 'Selecione uma equipe' }),
  location: z.string().min(3, { message: 'O local deve ter pelo menos 3 caracteres' }),
  notes: z.string().optional(),
  participantIds: z.array(z.string()).min(1, { message: 'Selecione pelo menos um participante' }),
});

export type MeetingFormValues = z.infer<typeof formSchema>;

interface MeetingFormProps {
  initialData?: Meeting;
  teams: Team[];
  participants: Participant[];
  onSubmit: (values: MeetingFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  cancelHref: string;
}

export function MeetingForm({
  initialData,
  teams,
  participants,
  onSubmit,
  isSubmitting,
  submitLabel,
  submittingLabel,
  cancelHref
}: MeetingFormProps) {
  const router = useRouter();
  
  // Preparar valores iniciais do formulário
  const getInitialValues = () => {
    if (initialData) {
      const date = new Date(initialData.date);
      return {
        title: initialData.title,
        date: format(date, 'yyyy-MM-dd'),
        time: format(date, 'HH:mm'),
        teamId: initialData.teamId,
        location: initialData.location,
        notes: initialData.notes || '',
        participantIds: initialData.participantIds || initialData.participants?.map(p => p.id) || [],
      };
    }
    
    return {
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:00',
      teamId: '',
      location: '',
      notes: '',
      participantIds: [],
    };
  };

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormLabel>Hora</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipe</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma equipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
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
          </div>

          <FormField
            control={form.control}
            name="participantIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participantes</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`participant-${participant.id}`}
                        value={participant.id}
                        checked={field.value.includes(participant.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const value = e.target.value;
                          const newValues = checked
                            ? [...field.value, value]
                            : field.value.filter((val) => val !== value);
                          field.onChange(newValues);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`participant-${participant.id}`} className="text-sm">
                        {participant.name} <span className="text-xs text-muted-foreground">({participant.role})</span>
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Adicione notas sobre o propósito da reunião, tópicos a serem discutidos, etc." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Estas notas serão visíveis para todos os participantes.
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
            onClick={() => router.push(cancelHref)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
} 