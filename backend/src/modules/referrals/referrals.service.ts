import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { ReferralStatus } from '@prisma/client';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async create(createReferralDto: CreateReferralDto, userId: string) {
    const { studentId, assignedToId, ...rest } = createReferralDto;
    
    // Verificar se o estudante existe
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Estudante com ID ${studentId} não encontrado`);
    }

    // Verificar se o usuário atribuído existe (se fornecido)
    if (assignedToId) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(`Usuário com ID ${assignedToId} não encontrado`);
      }
    }

    // Definir status padrão se não fornecido
    const status = rest.status || ReferralStatus.PENDING;

    return this.prisma.referral.create({
      data: {
        ...rest,
        status,
        student: { connect: { id: studentId } },
        createdBy: { connect: { id: userId } },
        ...(assignedToId && { assignedTo: { connect: { id: assignedToId } } }),
      },
      include: {
        student: true,
        createdBy: true,
        assignedTo: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.referral.findMany({
      where: {
        OR: [
          { createdById: userId },
          { assignedToId: userId },
        ],
      },
      include: {
        student: true,
        createdBy: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { id },
      include: {
        student: true,
        createdBy: true,
        assignedTo: true,
      },
    });

    if (!referral) {
      throw new NotFoundException(`Encaminhamento com ID ${id} não encontrado`);
    }

    return referral;
  }

  async update(id: string, updateReferralDto: UpdateReferralDto) {
    const { studentId, assignedToId, ...rest } = updateReferralDto;
    
    // Verificar se o encaminhamento existe
    await this.findOne(id);

    // Preparar os dados para atualização
    const data: any = { ...rest };

    // Atualizar relações se fornecidas
    if (studentId) {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException(`Estudante com ID ${studentId} não encontrado`);
      }

      data.student = { connect: { id: studentId } };
    }

    if (assignedToId) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(`Usuário com ID ${assignedToId} não encontrado`);
      }

      data.assignedTo = { connect: { id: assignedToId } };
    }

    return this.prisma.referral.update({
      where: { id },
      data,
      include: {
        student: true,
        createdBy: true,
        assignedTo: true,
      },
    });
  }

  async remove(id: string) {
    // Verificar se o encaminhamento existe
    await this.findOne(id);

    return this.prisma.referral.delete({
      where: { id },
    });
  }
} 