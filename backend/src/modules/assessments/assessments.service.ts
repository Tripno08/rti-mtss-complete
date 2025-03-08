import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssessmentDto: CreateAssessmentDto) {
    return this.prisma.assessment.create({
      data: {
        date: new Date(createAssessmentDto.date),
        type: createAssessmentDto.type,
        score: createAssessmentDto.score,
        notes: createAssessmentDto.notes,
        studentId: createAssessmentDto.studentId,
      },
    });
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
