import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MeetingStatus } from '@prisma/client';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { AddParticipantDto } from './dto/add-participant.dto';

@Injectable()
export class MeetingsService {
  private readonly logger = new Logger(MeetingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllMeetings(teamId?: string, userId?: string, status?: MeetingStatus) {
    try {
      const where: any = {};

      // Filtrar por equipe
      if (teamId) {
        where.teamId = teamId;
      }

      // Filtrar por status
      if (status) {
        where.status = status;
      }

      // Filtrar por participante
      if (userId) {
        where.participants = {
          some: {
            userId,
          },
        };
      }

      return await this.prisma.rtiMeeting.findMany({
        where,
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              participants: true,
              referrals: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar reuniões: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findMeetingById(id: string) {
    try {
      const meeting = await this.prisma.rtiMeeting.findUnique({
        where: { id },
        include: {
          team: {
            select: {
              id: true,
              name: true,
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
          referrals: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                },
              },
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!meeting) {
        throw new NotFoundException(`Reunião com ID ${id} não encontrada`);
      }

      return meeting;
    } catch (error) {
      this.logger.error(`Erro ao buscar reunião: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createMeeting(createMeetingDto: CreateMeetingDto) {
    try {
      const { title, date, location, status, notes, teamId, participantIds } = createMeetingDto;

      // Verificar se a equipe existe
      const team = await this.prisma.rtiTeam.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        throw new NotFoundException(`Equipe com ID ${teamId} não encontrada`);
      }

      // Criar a reunião
      const meeting = await this.prisma.rtiMeeting.create({
        data: {
          title,
          date: new Date(date),
          location,
          status: status || MeetingStatus.SCHEDULED,
          notes,
          teamId,
        },
      });

      // Adicionar participantes
      if (participantIds && participantIds.length > 0) {
        await this.prisma.meetingParticipant.createMany({
          data: participantIds.map(userId => ({
            meetingId: meeting.id,
            userId,
          })),
        });
      }

      // Retornar a reunião criada com os relacionamentos
      return this.findMeetingById(meeting.id);
    } catch (error) {
      this.logger.error(`Erro ao criar reunião: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateMeeting(id: string, updateMeetingDto: UpdateMeetingDto) {
    try {
      // Verificar se a reunião existe
      const existingMeeting = await this.prisma.rtiMeeting.findUnique({
        where: { id },
      });

      if (!existingMeeting) {
        throw new NotFoundException(`Reunião com ID ${id} não encontrada`);
      }

      // Atualizar a reunião
      const updatedMeeting = await this.prisma.rtiMeeting.update({
        where: { id },
        data: {
          ...updateMeetingDto,
          date: updateMeetingDto.date ? new Date(updateMeetingDto.date) : undefined,
        },
      });

      return updatedMeeting;
    } catch (error) {
      this.logger.error(`Erro ao atualizar reunião: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteMeeting(id: string) {
    try {
      // Verificar se a reunião existe
      const existingMeeting = await this.prisma.rtiMeeting.findUnique({
        where: { id },
      });

      if (!existingMeeting) {
        throw new NotFoundException(`Reunião com ID ${id} não encontrada`);
      }

      // Excluir relacionamentos primeiro
      await this.prisma.$transaction([
        this.prisma.meetingParticipant.deleteMany({
          where: { meetingId: id },
        }),
        // Atualizar referrals para remover a referência à reunião
        this.prisma.referral.updateMany({
          where: { meetingId: id },
          data: { meetingId: null },
        }),
        // Excluir a reunião
        this.prisma.rtiMeeting.delete({
          where: { id },
        }),
      ]);

      return { success: true, message: 'Reunião excluída com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao excluir reunião: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addParticipant(meetingId: string, addParticipantDto: AddParticipantDto) {
    try {
      // Verificar se a reunião existe
      const existingMeeting = await this.prisma.rtiMeeting.findUnique({
        where: { id: meetingId },
      });

      if (!existingMeeting) {
        throw new NotFoundException(`Reunião com ID ${meetingId} não encontrada`);
      }

      // Verificar se o usuário já é participante da reunião
      const existingParticipant = await this.prisma.meetingParticipant.findFirst({
        where: {
          meetingId,
          userId: addParticipantDto.userId,
        },
      });

      if (existingParticipant) {
        // Se já for participante, atualizar o papel
        return await this.prisma.meetingParticipant.update({
          where: { id: existingParticipant.id },
          data: {
            role: addParticipantDto.role,
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
          },
        });
      }

      // Adicionar novo participante
      return await this.prisma.meetingParticipant.create({
        data: {
          meetingId,
          userId: addParticipantDto.userId,
          role: addParticipantDto.role,
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
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar participante à reunião: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeParticipant(meetingId: string, userId: string) {
    try {
      // Verificar se a reunião existe
      const existingMeeting = await this.prisma.rtiMeeting.findUnique({
        where: { id: meetingId },
      });

      if (!existingMeeting) {
        throw new NotFoundException(`Reunião com ID ${meetingId} não encontrada`);
      }

      // Verificar se o usuário é participante da reunião
      const existingParticipant = await this.prisma.meetingParticipant.findFirst({
        where: {
          meetingId,
          userId,
        },
      });

      if (!existingParticipant) {
        throw new NotFoundException(`Usuário com ID ${userId} não é participante da reunião`);
      }

      // Remover participante
      await this.prisma.meetingParticipant.delete({
        where: { id: existingParticipant.id },
      });

      return { success: true, message: 'Participante removido com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao remover participante da reunião: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateAttendance(meetingId: string, userId: string, attended: boolean) {
    try {
      // Verificar se a reunião existe
      const existingMeeting = await this.prisma.rtiMeeting.findUnique({
        where: { id: meetingId },
      });

      if (!existingMeeting) {
        throw new NotFoundException(`Reunião com ID ${meetingId} não encontrada`);
      }

      // Verificar se o usuário é participante da reunião
      const existingParticipant = await this.prisma.meetingParticipant.findFirst({
        where: {
          meetingId,
          userId,
        },
      });

      if (!existingParticipant) {
        throw new NotFoundException(`Usuário com ID ${userId} não é participante da reunião`);
      }

      // Atualizar presença
      return await this.prisma.meetingParticipant.update({
        where: { id: existingParticipant.id },
        data: {
          attended,
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao atualizar presença na reunião: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUpcomingMeetings(userId: string) {
    try {
      return await this.prisma.rtiMeeting.findMany({
        where: {
          date: {
            gte: new Date(),
          },
          status: {
            in: [MeetingStatus.SCHEDULED, MeetingStatus.IN_PROGRESS],
          },
          participants: {
            some: {
              userId,
            },
          },
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
        take: 5,
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar próximas reuniões: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getParticipants(meetingId: string) {
    try {
      // Verificar se a reunião existe
      const existingMeeting = await this.prisma.rtiMeeting.findUnique({
        where: { id: meetingId },
      });

      if (!existingMeeting) {
        throw new NotFoundException(`Reunião com ID ${meetingId} não encontrada`);
      }

      // Buscar participantes
      return await this.prisma.meetingParticipant.findMany({
        where: {
          meetingId,
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
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar participantes da reunião: ${error.message}`, error.stack);
      throw error;
    }
  }
} 