'use client';

import { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  addHours,
  isSameDay,
  isWithinInterval,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/api/calendar';
import { cn } from '@/lib/utils';

interface CalendarWeekProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarWeek({ currentDate, events }: CalendarWeekProps) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { locale: ptBR });
    const end = endOfWeek(currentDate, { locale: ptBR });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const hours = useMemo(() => {
    const start = startOfDay(currentDate);
    const end = endOfDay(currentDate);
    return eachHourOfInterval({ start, end });
  }, [currentDate]);

  const getEventsForDayAndHour = (day: Date, hour: Date) => {
    const hourStart = hour;
    const hourEnd = addHours(hour, 1);
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Verificar se o evento está no mesmo dia
      if (!isSameDay(day, eventStart) && !isSameDay(day, eventEnd) && 
          !(eventStart < day && eventEnd > day)) {
        return false;
      }
      
      // Verificar se o evento está dentro da hora atual
      return (
        isWithinInterval(hourStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(hourEnd, { start: eventStart, end: eventEnd }) ||
        (eventStart <= hourStart && eventEnd >= hourEnd)
      );
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-1">
          {/* Cabeçalho com dias da semana */}
          <div className="border-b p-2"></div>
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={cn(
                "text-center p-2 border-b font-medium",
                isToday(day) && "bg-primary/10"
              )}
            >
              <div>{format(day, 'EEEE', { locale: ptBR })}</div>
              <div className={cn(
                "text-lg",
                isToday(day) && "text-primary font-bold"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
          
          {/* Grade de horas */}
          {hours.map((hour, hourIndex) => (
            <>
              <div 
                key={`hour-${hourIndex}`} 
                className="border-r p-2 text-right text-sm text-muted-foreground"
              >
                {format(hour, 'HH:mm')}
              </div>
              
              {weekDays.map((day, dayIndex) => {
                const cellEvents = getEventsForDayAndHour(day, hour);
                
                return (
                  <div 
                    key={`cell-${dayIndex}-${hourIndex}`} 
                    className={cn(
                      "border border-dashed min-h-[60px] p-1 relative",
                      isToday(day) && "bg-primary/5"
                    )}
                  >
                    {cellEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 mb-1 rounded truncate"
                        style={{ 
                          backgroundColor: event.color ? `${event.color}20` : '#f0f0f0',
                          borderLeft: event.color ? `3px solid ${event.color}` : '3px solid #ccc'
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
} 