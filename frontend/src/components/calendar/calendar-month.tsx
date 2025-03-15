'use client';

import { useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  startOfWeek,
  endOfWeek,
  addDays
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/api/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CalendarMonthProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarMonth({ currentDate, events }: CalendarMonthProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { locale: ptBR });
    const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { locale: ptBR });
    return Array.from({ length: 7 }).map((_, i) => 
      format(addDays(weekStart, i), 'EEEEEE', { locale: ptBR })
    );
  }, []);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Verificar se o dia está dentro do intervalo do evento
      return (
        isSameDay(day, eventStart) || 
        isSameDay(day, eventEnd) || 
        (day > eventStart && day < eventEnd)
      );
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[100px] p-2 border rounded-md",
                isCurrentMonth ? "bg-card" : "bg-muted/30",
                isToday(day) && "border-primary"
              )}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-muted-foreground",
                    isToday(day) && "text-primary font-bold"
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>
              <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                {dayEvents.slice(0, 3).map((event) => (
                  <Button
                    key={event.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start p-1 h-auto text-xs"
                    style={{ 
                      backgroundColor: event.color ? `${event.color}20` : undefined,
                      borderLeft: event.color ? `3px solid ${event.color}` : undefined
                    }}
                  >
                    <div className="truncate">
                      {event.title}
                    </div>
                  </Button>
                ))}
                {dayEvents.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{dayEvents.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 