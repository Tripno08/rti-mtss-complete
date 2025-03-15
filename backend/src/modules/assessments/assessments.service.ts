import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto) {
    try {
      // Criar a avaliação
      const assessment = await this.prisma.assessment.create({
        data: {
          date: new Date(createAssessmentDto.date),
          type: createAssessmentDto.type,
          score: createAssessmentDto.score,
          notes: createAssessmentDto.notes,
          studentId: createAssessmentDto.studentId,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              userId: true,
            },
          },
        },
      });

      // Buscar o professor do aluno (assumindo que o userId do estudante é o ID do professor)
      if (assessment.student?.userId) {
        await this.notificationsService.createSystemNotification(
          assessment.student.userId,
          'Nova avaliação registrada',
          `Uma nova avaliação do tipo ${assessment.type} foi registrada para o estudante ${assessment.student.name}.`,
          `/teacher-portal/assessments/${assessment.id}`,
        );
      }

      return assessment;
    } catch (error) {
      throw new Error(`Erro ao criar avaliação: ${error.message}`);
    }
  }

  async findAll() {
    return this.prisma.assessment.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
      },
    });
  }

  async findByStudentId(studentId: string) {
    return this.prisma.assessment.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return assessment;
  }

  async update(id: string, updateAssessmentDto: UpdateAssessmentDto) {
    // Verificar se a avaliação existe
    await this.findOne(id);

    // Preparar os dados para atualização
    const data: any = {};
    if (updateAssessmentDto.date) data.date = new Date(updateAssessmentDto.date);
    if (updateAssessmentDto.type) data.type = updateAssessmentDto.type;
    if (updateAssessmentDto.score !== undefined) data.score = updateAssessmentDto.score;
    if (updateAssessmentDto.notes !== undefined) data.notes = updateAssessmentDto.notes;
    if (updateAssessmentDto.studentId) data.studentId = updateAssessmentDto.studentId;

    // Atualizar avaliação
    return this.prisma.assessment.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // Verificar se a avaliação existe
    await this.findOne(id);

    // Remover avaliação
    await this.prisma.assessment.delete({
      where: { id },
    });

    return { message: 'Avaliação removida com sucesso' };
  }
}
