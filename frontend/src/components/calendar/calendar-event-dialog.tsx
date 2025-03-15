'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  createCalendarEvent, 
  updateCalendarEvent, 
  CreateCalendarEventDto 
} from '@/api/calendar';
import { useAuthStore } from '@/lib/stores/auth';

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventSaved: () => void;
  eventToEdit?: {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    allDay: boolean;
    location?: string;
    type: 'class' | 'meeting' | 'task' | 'reminder' | 'other';
    status: 'scheduled' | 'cancelled' | 'completed';
    color?: string;
  };
}

export function CalendarEventDialog({ 
  open, 
  onOpenChange, 
  onEventSaved,
  eventToEdit 
}: CalendarEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  const form = useForm<CreateCalendarEventDto>({
    defaultValues: eventToEdit ? {
      title: eventToEdit.title,
      description: eventToEdit.description || '',
      startDate: eventToEdit.startDate,
      endDate: eventToEdit.endDate,
      allDay: eventToEdit.allDay,
      location: eventToEdit.location || '',
      type: eventToEdit.type,
      status: eventToEdit.status,
      color: eventToEdit.color || '#3b82f6',
      creatorId: user?.id || '',
    } : {
      title: '',
      description: '',
      startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date(new Date().getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
      allDay: false,
      location: '',
      type: 'meeting',
      status: 'scheduled',
      color: '#3b82f6',
      creatorId: user?.id || '',
    }
  });

  const onSubmit = async (data: CreateCalendarEventDto) => {
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Usuário não autenticado',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (eventToEdit) {
        await updateCalendarEvent(eventToEdit.id, data);
        toast({
          title: 'Sucesso',
          description: 'Evento atualizado com sucesso',
        });
      } else {
        await createCalendarEvent({
          ...data,
          creatorId: user.id,
        });
        toast({
          title: 'Sucesso',
          description: 'Evento criado com sucesso',
        });
      }
      
      onEventSaved();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o evento',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {eventToEdit ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes do evento do calendário
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'O título é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título do evento" {...field} />
                  </FormControl>
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
                      placeholder="Descrição do evento" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                rules={{ required: 'A data de início é obrigatória' }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                rules={{ required: 'A data de término é obrigatória' }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Término</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Dia inteiro</FormLabel>
                    <FormDescription>
                      Marque se o evento dura o dia todo
                    </FormDescription>
                  </div>
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
                    <Input placeholder="Local do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                rules={{ required: 'O tipo é obrigatório' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="class">Aula</SelectItem>
                        <SelectItem value="meeting">Reunião</SelectItem>
                        <SelectItem value="task">Tarefa</SelectItem>
                        <SelectItem value="reminder">Lembrete</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                rules={{ required: 'O status é obrigatório' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="color" 
                        {...field} 
                        className="w-12 h-8 p-1"
                      />
                      <span className="text-sm text-muted-foreground">
                        Selecione uma cor para o evento
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : eventToEdit ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 