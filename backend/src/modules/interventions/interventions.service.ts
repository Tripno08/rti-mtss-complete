import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { InterventionStatus } from '@prisma/client';

@Injectable()
export class InterventionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInterventionDto: CreateInterventionDto) {
    return this.prisma.intervention.create({
      data: {
        startDate: new Date(createInterventionDto.startDate),
        endDate: createInterventionDto.endDate ? new Date(createInterventionDto.endDate) : null,
        type: createInterventionDto.type,
        description: createInterventionDto.description,
        status: createInterventionDto.status || InterventionStatus.ACTIVE,
        notes: createInterventionDto.notes,
        studentId: createInterventionDto.studentId,
      },
    });
  }

  async findAll() {
    return this.prisma.intervention.findMany({
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
    return this.prisma.intervention.findMany({
      where: { studentId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findByStatus(status: InterventionStatus) {
    return this.prisma.intervention.findMany({
      where: { status },
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

  async findOne(id: string) {
    const intervention = await this.prisma.intervention.findUnique({
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

    if (!intervention) {
      throw new NotFoundException('Intervenção não encontrada');
    }

    return intervention;
  }

  async update(id: string, updateInterventionDto: UpdateInterventionDto) {
    // Verificar se a intervenção existe
    await this.findOne(id);

    // Preparar os dados para atualização
    const data: any = {};
    if (updateInterventionDto.startDate) data.startDate = new Date(updateInterventionDto.startDate);
    if (updateInterventionDto.endDate) data.endDate = new Date(updateInterventionDto.endDate);
    if (updateInterventionDto.type) data.type = updateInterventionDto.type;
    if (updateInterventionDto.description) data.description = updateInterventionDto.description;
    if (updateInterventionDto.status) data.status = updateInterventionDto.status;
    if (updateInterventionDto.notes !== undefined) data.notes = updateInterventionDto.notes;
    if (updateInterventionDto.studentId) data.studentId = updateInterventionDto.studentId;

    // Atualizar intervenção
    return this.prisma.intervention.update({
      where: { id },
      data,
    });
  }

  async complete(id: string) {
    // Verificar se a intervenção existe
    await this.findOne(id);

    // Atualizar status para COMPLETED e definir a data de término
    return this.prisma.intervention.update({
      where: { id },
      data: {
        status: InterventionStatus.COMPLETED,
        endDate: new Date(),
      },
    });
  }

  async cancel(id: string) {
    // Verificar se a intervenção existe
    await this.findOne(id);

    // Atualizar status para CANCELLED
    return this.prisma.intervention.update({
      where: { id },
      data: {
        status: InterventionStatus.CANCELLED,
      },
    });
  }

  async remove(id: string) {
    // Verificar se a intervenção existe
    await this.findOne(id);

    // Remover intervenção
    await this.prisma.intervention.delete({
      where: { id },
    });

    return { message: 'Intervenção removida com sucesso' };
  }
}
