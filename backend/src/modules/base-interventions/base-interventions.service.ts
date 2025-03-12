import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBaseInterventionDto } from './dto/create-base-intervention.dto';
import { UpdateBaseInterventionDto } from './dto/update-base-intervention.dto';
import { AreaIntervencao, NivelIntervencao } from '@prisma/client';
import { AssociateDificuldadeDto } from './dto/associate-dificuldade.dto';

@Injectable()
export class BaseInterventionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBaseInterventionDto: CreateBaseInterventionDto) {
    return this.prisma.baseIntervention.create({
      data: {
        ...createBaseInterventionDto,
        ativo: createBaseInterventionDto.ativo ?? true,
      },
    });
  }

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { ativo: true };
    
    return this.prisma.baseIntervention.findMany({
      where,
      orderBy: { nome: 'asc' },
      include: {
        protocolos: {
          select: {
            id: true,
            nome: true,
          },
        },
        kpis: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }

  async findByArea(area: AreaIntervencao, includeInactive = false) {
    const where = {
      area,
      ...(includeInactive ? {} : { ativo: true }),
    };
    
    return this.prisma.baseIntervention.findMany({
      where,
      orderBy: { nome: 'asc' },
      include: {
        protocolos: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }

  async findByNivel(nivel: NivelIntervencao, includeInactive = false) {
    const where = {
      nivel,
      ...(includeInactive ? {} : { ativo: true }),
    };
    
    return this.prisma.baseIntervention.findMany({
      where,
      orderBy: { nome: 'asc' },
      include: {
        protocolos: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const baseIntervention = await this.prisma.baseIntervention.findUnique({
      where: { id },
      include: {
        protocolos: {
          include: {
            etapas: {
              orderBy: { ordem: 'asc' },
            },
          },
        },
        kpis: true,
        intervencoes: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            student: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!baseIntervention) {
      throw new NotFoundException('Intervenção base não encontrada');
    }

    return baseIntervention;
  }

  async update(
    id: string,
    updateBaseInterventionDto: UpdateBaseInterventionDto,
  ) {
    // Verificar se a intervenção base existe
    await this.findOne(id);

    // Atualizar intervenção base
    return this.prisma.baseIntervention.update({
      where: { id },
      data: updateBaseInterventionDto,
    });
  }

  async remove(id: string) {
    // Verificar se a intervenção base existe
    await this.findOne(id);

    // Verificar se há intervenções associadas
    const interventionsCount = await this.prisma.intervention.count({
      where: { baseInterventionId: id },
    });

    if (interventionsCount > 0) {
      // Se houver intervenções associadas, apenas desativar
      return this.prisma.baseIntervention.update({
        where: { id },
        data: { ativo: false },
      });
    }

    // Se não houver intervenções associadas, remover
    await this.prisma.baseIntervention.delete({
      where: { id },
    });

    return { message: 'Intervenção base removida com sucesso' };
  }

  async associateDificuldade(associateDificuldadeDto: AssociateDificuldadeDto) {
    const { dificuldadeId, intervencaoId, eficacia, observacoes } = associateDificuldadeDto;

    // Verificar se a intervenção base existe
    const baseIntervention = await this.prisma.baseIntervention.findUnique({
      where: { id: intervencaoId },
    });

    if (!baseIntervention) {
      throw new NotFoundException('Intervenção base não encontrada');
    }

    // Verificar se a dificuldade existe
    const dificuldade = await this.prisma.dificuldadeAprendizagem.findUnique({
      where: { id: dificuldadeId },
    });

    if (!dificuldade) {
      throw new NotFoundException('Dificuldade de aprendizagem não encontrada');
    }

    // Verificar se a associação já existe
    const existingAssociation = await this.prisma.dificuldadeIntervencao.findFirst({
      where: {
        dificuldadeId,
        intervencaoId,
      },
    });

    if (existingAssociation) {
      // Atualizar associação existente
      return this.prisma.dificuldadeIntervencao.update({
        where: { id: existingAssociation.id },
        data: {
          eficacia,
          observacoes,
        },
        include: {
          dificuldade: {
            select: {
              id: true,
              nome: true,
              categoria: true,
            },
          },
          intervencao: {
            select: {
              id: true,
              nome: true,
              area: true,
              nivel: true,
            },
          },
        },
      });
    }

    // Criar nova associação
    return this.prisma.dificuldadeIntervencao.create({
      data: {
        dificuldadeId,
        intervencaoId,
        eficacia,
        observacoes,
      },
      include: {
        dificuldade: {
          select: {
            id: true,
            nome: true,
            categoria: true,
          },
        },
        intervencao: {
          select: {
            id: true,
            nome: true,
            area: true,
            nivel: true,
          },
        },
      },
    });
  }

  async removeDificuldadeAssociation(dificuldadeId: string, intervencaoId: string) {
    // Verificar se a associação existe
    const association = await this.prisma.dificuldadeIntervencao.findFirst({
      where: {
        dificuldadeId,
        intervencaoId,
      },
    });

    if (!association) {
      throw new NotFoundException('Associação entre dificuldade e intervenção não encontrada');
    }

    // Remover associação
    await this.prisma.dificuldadeIntervencao.delete({
      where: { id: association.id },
    });

    return { message: 'Associação removida com sucesso' };
  }

  async findDificuldadesByIntervencao(intervencaoId: string) {
    // Verificar se a intervenção base existe
    const baseIntervention = await this.prisma.baseIntervention.findUnique({
      where: { id: intervencaoId },
    });

    if (!baseIntervention) {
      throw new NotFoundException('Intervenção base não encontrada');
    }

    // Buscar dificuldades associadas
    return this.prisma.dificuldadeIntervencao.findMany({
      where: { intervencaoId },
      include: {
        dificuldade: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            categoria: true,
          },
        },
      },
      orderBy: { eficacia: 'desc' },
    });
  }

  async findIntervencoesByDificuldade(dificuldadeId: string) {
    // Verificar se a dificuldade existe
    const dificuldade = await this.prisma.dificuldadeAprendizagem.findUnique({
      where: { id: dificuldadeId },
    });

    if (!dificuldade) {
      throw new NotFoundException('Dificuldade de aprendizagem não encontrada');
    }

    // Buscar intervenções associadas
    return this.prisma.dificuldadeIntervencao.findMany({
      where: { dificuldadeId },
      include: {
        intervencao: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            objetivo: true,
            nivel: true,
            area: true,
          },
        },
      },
      orderBy: { eficacia: 'desc' },
    });
  }
} 