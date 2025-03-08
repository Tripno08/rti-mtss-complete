import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TeamRole } from '@prisma/client';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { AddStudentToTeamDto } from './dto/add-student-to-team.dto';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllTeams(userId?: string) {
    try {
      // Se userId for fornecido, buscar apenas equipes das quais o usuário é membro
      if (userId) {
        return await this.prisma.rtiTeam.findMany({
          where: {
            members: {
              some: {
                userId,
                active: true,
              },
            },
          },
          include: {
            _count: {
              select: {
                members: true,
                students: true,
              },
            },
          },
        });
      }

      // Caso contrário, buscar todas as equipes
      return await this.prisma.rtiTeam.findMany({
        include: {
          _count: {
            select: {
              members: true,
              students: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar equipes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findTeamById(id: string) {
    try {
      const team = await this.prisma.rtiTeam.findUnique({
        where: { id },
        include: {
          members: {
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
          students: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  grade: true,
                  dateOfBirth: true,
                },
              },
            },
          },
          _count: {
            select: {
              meetings: true,
              referrals: true,
            },
          },
        },
      });

      if (!team) {
        throw new NotFoundException(`Equipe com ID ${id} não encontrada`);
      }

      return team;
    } catch (error) {
      this.logger.error(`Erro ao buscar equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    try {
      const { name, description, active, memberIds, members, studentIds } = createTeamDto;

      // Criar a equipe
      const team = await this.prisma.rtiTeam.create({
        data: {
          name,
          description,
          active,
        },
      });

      // Adicionar membros à equipe
      if (members && members.length > 0) {
        await this.prisma.rtiTeamMember.createMany({
          data: members.map(member => ({
            teamId: team.id,
            userId: member.userId,
            role: member.role,
            active: true,
          })),
        });
      } else if (memberIds && memberIds.length > 0) {
        // Se apenas IDs foram fornecidos, adicionar como TEACHER por padrão
        await this.prisma.rtiTeamMember.createMany({
          data: memberIds.map(userId => ({
            teamId: team.id,
            userId,
            role: TeamRole.TEACHER,
            active: true,
          })),
        });
      }

      // Adicionar estudantes à equipe
      if (studentIds && studentIds.length > 0) {
        await this.prisma.studentTeam.createMany({
          data: studentIds.map(studentId => ({
            teamId: team.id,
            studentId,
            active: true,
          })),
        });
      }

      // Retornar a equipe criada com os relacionamentos
      return this.findTeamById(team.id);
    } catch (error) {
      this.logger.error(`Erro ao criar equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateTeam(id: string, updateTeamDto: UpdateTeamDto) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${id} não encontrada`);
      }

      // Atualizar a equipe
      const updatedTeam = await this.prisma.rtiTeam.update({
        where: { id },
        data: updateTeamDto,
      });

      return updatedTeam;
    } catch (error) {
      this.logger.error(`Erro ao atualizar equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteTeam(id: string) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${id} não encontrada`);
      }

      // Excluir relacionamentos primeiro
      await this.prisma.$transaction([
        this.prisma.rtiTeamMember.deleteMany({
          where: { teamId: id },
        }),
        this.prisma.studentTeam.deleteMany({
          where: { teamId: id },
        }),
        // Atualizar referrals para remover a referência à equipe
        this.prisma.referral.updateMany({
          where: { teamId: id },
          data: { teamId: null },
        }),
        // Excluir a equipe
        this.prisma.rtiTeam.delete({
          where: { id },
        }),
      ]);

      return { success: true, message: 'Equipe excluída com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao excluir equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addTeamMember(teamId: string, addTeamMemberDto: AddTeamMemberDto) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id: teamId },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${teamId} não encontrada`);
      }

      // Verificar se o usuário já é membro da equipe
      const existingMember = await this.prisma.rtiTeamMember.findFirst({
        where: {
          teamId,
          userId: addTeamMemberDto.userId,
          active: true,
        },
      });

      if (existingMember) {
        // Se já for membro, atualizar o papel
        return await this.prisma.rtiTeamMember.update({
          where: { id: existingMember.id },
          data: {
            role: addTeamMemberDto.role,
            leftAt: null,
            active: true,
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

      // Adicionar novo membro
      return await this.prisma.rtiTeamMember.create({
        data: {
          teamId,
          userId: addTeamMemberDto.userId,
          role: addTeamMemberDto.role,
          active: true,
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
      this.logger.error(`Erro ao adicionar membro à equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeTeamMember(teamId: string, userId: string) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id: teamId },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${teamId} não encontrada`);
      }

      // Verificar se o usuário é membro da equipe
      const existingMember = await this.prisma.rtiTeamMember.findFirst({
        where: {
          teamId,
          userId,
          active: true,
        },
      });

      if (!existingMember) {
        throw new NotFoundException(`Usuário com ID ${userId} não é membro ativo da equipe`);
      }

      // Marcar como inativo e definir a data de saída
      return await this.prisma.rtiTeamMember.update({
        where: { id: existingMember.id },
        data: {
          active: false,
          leftAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao remover membro da equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addStudentToTeam(teamId: string, addStudentDto: AddStudentToTeamDto) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id: teamId },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${teamId} não encontrada`);
      }

      // Verificar se o estudante já está na equipe
      const existingStudentTeam = await this.prisma.studentTeam.findFirst({
        where: {
          teamId,
          studentId: addStudentDto.studentId,
          active: true,
        },
      });

      if (existingStudentTeam) {
        // Se já estiver na equipe, apenas retornar
        return existingStudentTeam;
      }

      // Adicionar estudante à equipe
      return await this.prisma.studentTeam.create({
        data: {
          teamId,
          studentId: addStudentDto.studentId,
          active: true,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              grade: true,
              dateOfBirth: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao adicionar estudante à equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeStudentFromTeam(teamId: string, studentId: string) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id: teamId },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${teamId} não encontrada`);
      }

      // Verificar se o estudante está na equipe
      const existingStudentTeam = await this.prisma.studentTeam.findFirst({
        where: {
          teamId,
          studentId,
          active: true,
        },
      });

      if (!existingStudentTeam) {
        throw new NotFoundException(`Estudante com ID ${studentId} não está na equipe`);
      }

      // Marcar como inativo e definir a data de remoção
      return await this.prisma.studentTeam.update({
        where: { id: existingStudentTeam.id },
        data: {
          active: false,
          removedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao remover estudante da equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTeamStudents(teamId: string) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id: teamId },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${teamId} não encontrada`);
      }

      // Buscar estudantes da equipe
      const studentTeams = await this.prisma.studentTeam.findMany({
        where: {
          teamId,
          active: true,
        },
        include: {
          student: {
            include: {
              assessments: {
                orderBy: {
                  date: 'desc',
                },
                take: 1,
              },
              interventions: {
                where: {
                  status: 'ACTIVE',
                },
              },
            },
          },
        },
      });

      // Formatar os dados para retorno
      return studentTeams.map(st => ({
        id: st.student.id,
        name: st.student.name,
        grade: st.student.grade,
        dateOfBirth: st.student.dateOfBirth,
        assignedAt: st.assignedAt,
        latestAssessment: st.student.assessments[0] || null,
        activeInterventions: st.student.interventions.length,
      }));
    } catch (error) {
      this.logger.error(`Erro ao buscar estudantes da equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTeamMembers(teamId: string) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id: teamId },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${teamId} não encontrada`);
      }

      // Buscar membros da equipe
      return await this.prisma.rtiTeamMember.findMany({
        where: {
          teamId,
          active: true,
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
      this.logger.error(`Erro ao buscar membros da equipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTeamDashboard(teamId: string) {
    try {
      // Verificar se a equipe existe
      const existingTeam = await this.prisma.rtiTeam.findUnique({
        where: { id: teamId },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Equipe com ID ${teamId} não encontrada`);
      }

      // Buscar contagens
      const [
        studentsCount,
        activeInterventionsCount,
        completedInterventionsCount,
        assessmentsCount,
        pendingReferralsCount,
        completedReferralsCount,
      ] = await Promise.all([
        // Contagem de estudantes
        this.prisma.studentTeam.count({
          where: {
            teamId,
            active: true,
          },
        }),
        // Contagem de intervenções ativas
        this.prisma.intervention.count({
          where: {
            student: {
              teams: {
                some: {
                  teamId,
                  active: true,
                },
              },
            },
            status: 'ACTIVE',
          },
        }),
        // Contagem de intervenções concluídas
        this.prisma.intervention.count({
          where: {
            student: {
              teams: {
                some: {
                  teamId,
                  active: true,
                },
              },
            },
            status: 'COMPLETED',
          },
        }),
        // Contagem de avaliações
        this.prisma.assessment.count({
          where: {
            student: {
              teams: {
                some: {
                  teamId,
                  active: true,
                },
              },
            },
          },
        }),
        // Contagem de encaminhamentos pendentes
        this.prisma.referral.count({
          where: {
            teamId,
            status: 'PENDING',
          },
        }),
        // Contagem de encaminhamentos concluídos
        this.prisma.referral.count({
          where: {
            teamId,
            status: 'COMPLETED',
          },
        }),
      ]);

      // Buscar próximas reuniões
      const upcomingMeetings = await this.prisma.rtiMeeting.findMany({
        where: {
          teamId,
          date: {
            gte: new Date(),
          },
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS'],
          },
        },
        orderBy: {
          date: 'asc',
        },
        take: 3,
      });

      // Buscar encaminhamentos recentes
      const recentReferrals = await this.prisma.referral.findMany({
        where: {
          teamId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
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
      });

      // Retornar dados do dashboard
      return {
        team: existingTeam,
        stats: {
          studentsCount,
          activeInterventionsCount,
          completedInterventionsCount,
          assessmentsCount,
          pendingReferralsCount,
          completedReferralsCount,
          interventionSuccessRate: completedInterventionsCount > 0
            ? Math.round((completedInterventionsCount / (completedInterventionsCount + activeInterventionsCount)) * 100)
            : 0,
          referralCompletionRate: (pendingReferralsCount + completedReferralsCount) > 0
            ? Math.round((completedReferralsCount / (pendingReferralsCount + completedReferralsCount)) * 100)
            : 0,
        },
        upcomingMeetings,
        recentReferrals,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar dashboard da equipe: ${error.message}`, error.stack);
      throw error;
    }
  }
} 