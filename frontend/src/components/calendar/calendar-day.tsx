'use client';

import { useMemo } from 'react';
import { 
  format, 
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  addHours,
  isWithinInterval,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/api/calendar';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarDay({ currentDate, events }: CalendarDayProps) {
  const hours = useMemo(() => {
    const start = startOfDay(currentDate);
    const end = endOfDay(currentDate);
    return eachHourOfInterval({ start, end });
  }, [currentDate]);

  const getEventsForHour = (hour: Date) => {
    const hourStart = hour;
    const hourEnd = addHours(hour, 1);
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Verificar se o evento está dentro da hora atual
      return (
        isWithinInterval(hourStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(hourEnd, { start: eventStart, end: eventEnd }) ||
        (eventStart <= hourStart && eventEnd >= hourEnd)
      );
    });
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className={cn(
          "text-xl font-bold",
          isToday(currentDate) && "text-primary"
        )}>
          {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </h2>
      </div>
      
      <div className="grid grid-cols-[100px_1fr] gap-2">
        {hours.map((hour, index) => {
          const hourEvents = getEventsForHour(hour);
          
          return (
            <>
              <div 
                key={`hour-${index}`} 
                className="text-right pr-4 py-3 text-sm text-muted-foreground"
              >
                {format(hour, 'HH:mm')}
              </div>
              
              <div 
                key={`events-${index}`} 
                className="border-l border-b min-h-[80px] p-2 relative"
              >
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="mb-2 p-2 rounded-md shadow-sm"
                    style={{ 
                      backgroundColor: event.color ? `${event.color}20` : '#f0f0f0',
                      borderLeft: event.color ? `4px solid ${event.color}` : '4px solid #ccc'
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
                    </div>
                    {event.location && (
                      <div className="text-xs mt-1">
                        Local: {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
} 