import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto, UpdateGoalProgressDto } from './dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  // Criar uma nova meta
  async create(createGoalDto: CreateGoalDto) {
    const { estudanteId, intervencaoId, ...data } = createGoalDto;

    // Verificar se o estudante existe
    const estudante = await this.prisma.student.findUnique({
      where: { id: estudanteId },
    });
    if (!estudante) {
      throw new NotFoundException(`Estudante com ID ${estudanteId} não encontrado`);
    }

    // Verificar se a intervenção existe, se fornecida
    if (intervencaoId) {
      const intervencao = await this.prisma.intervention.findUnique({
        where: { id: intervencaoId },
      });
      if (!intervencao) {
        throw new NotFoundException(`Intervenção com ID ${intervencaoId} não encontrado`);
      }
    }

    // Criar a meta
    return this.prisma.goal.create({
      data: {
        ...data,
        estudante: { connect: { id: estudanteId } },
        ...(intervencaoId && { intervencao: { connect: { id: intervencaoId } } }),
        status: 'NAO_INICIADA',
        progresso: 0,
        historico: {
          create: {
            data: new Date(),
            status: 'NAO_INICIADA',
            progresso: 0,
            observacoes: 'Meta criada',
          },
        },
      },
      include: {
        estudante: true,
        intervencao: true,
        historico: true,
      },
    });
  }

  // Buscar todas as metas
  async findAll(filters?: {
    estudanteId?: string;
    intervencaoId?: string;
    status?: string[];
  }) {
    const where = {
      ...(filters?.estudanteId && { estudanteId: filters.estudanteId }),
      ...(filters?.intervencaoId && { intervencaoId: filters.intervencaoId }),
      ...(filters?.status && { status: { in: filters.status } }),
    };

    return this.prisma.goal.findMany({
      where,
      include: {
        estudante: true,
        intervencao: true,
        historico: {
          orderBy: { data: 'desc' },
        },
      },
      orderBy: [
        { status: 'asc' },
        { prazo: 'asc' },
      ],
    });
  }

  // Buscar uma meta específica
  async findOne(id: string) {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: {
        estudante: true,
        intervencao: true,
        historico: {
          orderBy: { data: 'desc' },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    return goal;
  }

  // Atualizar uma meta
  async update(id: string, updateGoalDto: UpdateGoalDto) {
    const { intervencaoId, ...data } = updateGoalDto;

    // Verificar se a meta existe
    const goal = await this.prisma.goal.findUnique({
      where: { id },
    });
    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Verificar se a intervenção existe, se fornecida
    if (intervencaoId) {
      const intervencao = await this.prisma.intervention.findUnique({
        where: { id: intervencaoId },
      });
      if (!intervencao) {
        throw new NotFoundException(`Intervenção com ID ${intervencaoId} não encontrado`);
      }
    }

    // Atualizar a meta
    return this.prisma.goal.update({
      where: { id },
      data: {
        ...data,
        ...(intervencaoId && { intervencao: { connect: { id: intervencaoId } } }),
        historico: {
          create: {
            data: new Date(),
            status: data.status || goal.status,
            progresso: data.progresso || goal.progresso,
            observacoes: 'Meta atualizada',
          },
        },
      },
      include: {
        estudante: true,
        intervencao: true,
        historico: {
          orderBy: { data: 'desc' },
        },
      },
    });
  }

  // Atualizar o progresso de uma meta
  async updateProgress(id: string, updateProgressDto: UpdateGoalProgressDto) {
    const { progresso, observacoes } = updateProgressDto;

    // Verificar se a meta existe
    const goal = await this.prisma.goal.findUnique({
      where: { id },
    });
    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Determinar o novo status com base no progresso
    let novoStatus = goal.status;
    if (progresso === 100) {
      novoStatus = 'CONCLUIDA';
    } else if (progresso > 0) {
      novoStatus = 'EM_ANDAMENTO';
    }

    // Atualizar a meta
    return this.prisma.goal.update({
      where: { id },
      data: {
        progresso,
        status: novoStatus,
        historico: {
          create: {
            data: new Date(),
            status: novoStatus,
            progresso,
            observacoes,
          },
        },
      },
      include: {
        estudante: true,
        intervencao: true,
        historico: {
          orderBy: { data: 'desc' },
        },
      },
    });
  }

  // Cancelar uma meta
  async cancel(id: string, observacoes: string) {
    // Verificar se a meta existe
    const goal = await this.prisma.goal.findUnique({
      where: { id },
    });
    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Cancelar a meta
    return this.prisma.goal.update({
      where: { id },
      data: {
        status: 'CANCELADA',
        historico: {
          create: {
            data: new Date(),
            status: 'CANCELADA',
            progresso: goal.progresso,
            observacoes,
          },
        },
      },
      include: {
        estudante: true,
        intervencao: true,
        historico: {
          orderBy: { data: 'desc' },
        },
      },
    });
  }

  // Excluir uma meta
  async remove(id: string) {
    // Verificar se a meta existe
    const goal = await this.prisma.goal.findUnique({
      where: { id },
    });
    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Excluir a meta e seu histórico
    await this.prisma.goalHistory.deleteMany({
      where: { goalId: id },
    });

    return this.prisma.goal.delete({
      where: { id },
    });
  }

  // Buscar histórico de uma meta
  async findHistory(id: string) {
    // Verificar se a meta existe
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: {
        historico: {
          orderBy: { data: 'desc' },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    return goal.historico;
  }
} 