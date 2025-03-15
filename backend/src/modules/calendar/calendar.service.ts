import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCalendarEventDto: CreateCalendarEventDto) {
    try {
      // Criar o evento
      const event = await this.prisma.calendarEvent.create({
        data: {
          title: createCalendarEventDto.title,
          description: createCalendarEventDto.description,
          startDate: new Date(createCalendarEventDto.startDate),
          endDate: createCalendarEventDto.endDate ? new Date(createCalendarEventDto.endDate) : null,
          allDay: createCalendarEventDto.allDay || false,
          location: createCalendarEventDto.location,
          type: createCalendarEventDto.type,
          status: createCalendarEventDto.status || 'scheduled',
          color: createCalendarEventDto.color,
          recurrence: createCalendarEventDto.recurrence,
          creatorId: createCalendarEventDto.creatorId,
          schoolId: createCalendarEventDto.schoolId,
          classId: createCalendarEventDto.classId,
          lessonPlanId: createCalendarEventDto.lessonPlanId,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
          lessonPlan: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Adicionar participantes se fornecidos
      if (createCalendarEventDto.participantIds && createCalendarEventDto.participantIds.length > 0) {
        await Promise.all(
          createCalendarEventDto.participantIds.map(userId =>
            this.prisma.calendarEventParticipant.create({
              data: {
                eventId: event.id,
                userId,
                status: 'pending',
              },
            }),
          ),
        );

        // Buscar o evento novamente com os participantes
        return this.findOne(event.id);
      }

      return event;
    } catch (error) {
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.calendarEvent.findMany({
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
          lessonPlan: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const event = await this.prisma.calendarEvent.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
          lessonPlan: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!event) {
        throw new NotFoundException(`Evento com ID ${id} não encontrado`);
      }

      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao buscar evento: ${error.message}`);
    }
  }

  async findByUser(userId: string) {
    try {
      // Buscar eventos criados pelo usuário
      const createdEvents = await this.prisma.calendarEvent.findMany({
        where: { creatorId: userId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
          lessonPlan: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Buscar eventos em que o usuário é participante
      const participatingEvents = await this.prisma.calendarEvent.findMany({
        where: {
          participants: {
            some: {
              userId,
            },
          },
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
          lessonPlan: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Combinar os eventos e remover duplicatas
      const allEvents = [...createdEvents];
      
      for (const event of participatingEvents) {
        if (!allEvents.some(e => e.id === event.id)) {
          allEvents.push(event);
        }
      }

      return allEvents;
    } catch (error) {
      throw new Error(`Erro ao buscar eventos do usuário: ${error.message}`);
    }
  }

  async findByDateRange(startDate: string, endDate: string) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      return await this.prisma.calendarEvent.findMany({
        where: {
          OR: [
            // Eventos que começam dentro do intervalo
            {
              startDate: {
                gte: start,
                lte: end,
              },
            },
            // Eventos que terminam dentro do intervalo
            {
              endDate: {
                gte: start,
                lte: end,
              },
            },
            // Eventos que começam antes e terminam depois do intervalo (abrangem todo o intervalo)
            {
              startDate: {
                lt: start,
              },
              endDate: {
                gt: end,
              },
            },
          ],
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
          lessonPlan: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar eventos por intervalo de datas: ${error.message}`);
    }
  }

  async update(id: string, updateCalendarEventDto: UpdateCalendarEventDto) {
    try {
      const event = await this.prisma.calendarEvent.findUnique({
        where: { id },
        include: {
          participants: true,
        },
      });

      if (!event) {
        throw new NotFoundException(`Evento com ID ${id} não encontrado`);
      }

      // Atualizar o evento
      const updatedEvent = await this.prisma.calendarEvent.update({
        where: { id },
        data: {
          title: updateCalendarEventDto.title,
          description: updateCalendarEventDto.description,
          startDate: updateCalendarEventDto.startDate ? new Date(updateCalendarEventDto.startDate) : undefined,
          endDate: updateCalendarEventDto.endDate ? new Date(updateCalendarEventDto.endDate) : undefined,
          allDay: updateCalendarEventDto.allDay,
          location: updateCalendarEventDto.location,
          type: updateCalendarEventDto.type,
          status: updateCalendarEventDto.status,
          color: updateCalendarEventDto.color,
          recurrence: updateCalendarEventDto.recurrence,
          schoolId: updateCalendarEventDto.schoolId,
          classId: updateCalendarEventDto.classId,
          lessonPlanId: updateCalendarEventDto.lessonPlanId,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
          lessonPlan: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Atualizar participantes se fornecidos
      if (updateCalendarEventDto.participantIds) {
        // Remover participantes existentes
        await this.prisma.calendarEventParticipant.deleteMany({
          where: { eventId: id },
        });

        // Adicionar novos participantes
        if (updateCalendarEventDto.participantIds.length > 0) {
          await Promise.all(
            updateCalendarEventDto.participantIds.map(userId =>
              this.prisma.calendarEventParticipant.create({
                data: {
                  eventId: id,
                  userId,
                  status: 'pending',
                },
              }),
            ),
          );

          // Buscar o evento novamente com os participantes atualizados
          return this.findOne(id);
        }
      }

      return updatedEvent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao atualizar evento: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const event = await this.prisma.calendarEvent.findUnique({
        where: { id },
      });

      if (!event) {
        throw new NotFoundException(`Evento com ID ${id} não encontrado`);
      }

      // Remover participantes do evento
      await this.prisma.calendarEventParticipant.deleteMany({
        where: { eventId: id },
      });

      // Remover o evento
      await this.prisma.calendarEvent.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao remover evento: ${error.message}`);
    }
  }

  async updateParticipantStatus(eventId: string, userId: string, status: 'pending' | 'accepted' | 'declined') {
    try {
      const participant = await this.prisma.calendarEventParticipant.findFirst({
        where: {
          eventId,
          userId,
        },
      });

      if (!participant) {
        throw new NotFoundException(`Participante não encontrado para o evento ${eventId} e usuário ${userId}`);
      }

      return await this.prisma.calendarEventParticipant.update({
        where: {
          id: participant.id,
        },
        data: {
          status,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          event: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao atualizar status do participante: ${error.message}`);
    }
  }
} 