'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarMonth } from '@/components/calendar/calendar-month';
import { CalendarWeek } from '@/components/calendar/calendar-week';
import { CalendarDay } from '@/components/calendar/calendar-day';
import { CalendarEventDialog } from '@/components/calendar/calendar-event-dialog';
import { 
  getCalendarEvents, 
  getCalendarEventsByDateRange, 
  CalendarEvent 
} from '@/api/calendar';
import { useToast } from '@/components/ui/use-toast';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      
      const data = await getCalendarEventsByDateRange(start, end);
      setEvents(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos do calendário.',
        variant: 'destructive',
      });
      // Fallback para dados vazios em caso de erro
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Calendário</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEventDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrevious}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Hoje
            </Button>
            <Button variant="outline" size="sm" onClick={handleNext}>
              Próximo
            </Button>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <h2 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'week' | 'day')}>
            <TabsList>
              <TabsTrigger value="month">Mês</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="day">Dia</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : (
          <TabsContent value={view} className="mt-0">
            {view === 'month' && (
              <CalendarMonth 
                currentDate={currentDate} 
                events={events} 
              />
            )}
            {view === 'week' && (
              <CalendarWeek 
                currentDate={currentDate} 
                events={events} 
              />
            )}
            {view === 'day' && (
              <CalendarDay 
                currentDate={currentDate} 
                events={events} 
              />
            )}
          </TabsContent>
        )}
      </CardContent>

      <CalendarEventDialog 
        open={isEventDialogOpen} 
        onOpenChange={setIsEventDialogOpen}
        onEventSaved={fetchEvents}
      />
    </Card>
  );
} 