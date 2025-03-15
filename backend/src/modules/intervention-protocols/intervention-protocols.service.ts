import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';

@Injectable()
export class InterventionProtocolsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProtocolDto: CreateProtocolDto) {
    const { etapas, ...protocolData } = createProtocolDto;

    // Verificar se a intervenção base existe
    const baseIntervention = await this.prisma.baseIntervention.findUnique({
      where: { id: protocolData.baseInterventionId },
    });

    if (!baseIntervention) {
      throw new NotFoundException('Intervenção base não encontrada');
    }

    // Criar protocolo com etapas
    return this.prisma.interventionProtocol.create({
      data: {
        ...protocolData,
        etapas: etapas
          ? {
              create: etapas.map((etapa) => ({
                ...etapa,
              })),
            }
          : undefined,
      },
      include: {
        etapas: {
          orderBy: { ordem: 'asc' },
        },
        baseIntervention: {
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

  async findAll() {
    return this.prisma.interventionProtocol.findMany({
      include: {
        etapas: {
          orderBy: { ordem: 'asc' },
        },
        baseIntervention: {
          select: {
            id: true,
            nome: true,
            area: true,
            nivel: true,
          },
        },
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findByBaseIntervention(baseInterventionId: string) {
    return this.prisma.interventionProtocol.findMany({
      where: { baseInterventionId },
      include: {
        etapas: {
          orderBy: { ordem: 'asc' },
        },
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const protocol = await this.prisma.interventionProtocol.findUnique({
      where: { id },
      include: {
        etapas: {
          orderBy: { ordem: 'asc' },
        },
        baseIntervention: {
          select: {
            id: true,
            nome: true,
            area: true,
            nivel: true,
          },
        },
      },
    });

    if (!protocol) {
      throw new NotFoundException('Protocolo não encontrado');
    }

    return protocol;
  }

  async update(id: string, updateProtocolDto: UpdateProtocolDto) {
    const { etapas, ...protocolData } = updateProtocolDto;

    // Verificar se o protocolo existe
    await this.findOne(id);

    // Verificar se a intervenção base existe, se fornecida
    if (protocolData.baseInterventionId) {
      const baseIntervention = await this.prisma.baseIntervention.findUnique({
        where: { id: protocolData.baseInterventionId },
      });

      if (!baseIntervention) {
        throw new NotFoundException('Intervenção base não encontrada');
      }
    }

    // Atualizar protocolo
    const updatedProtocol = await this.prisma.interventionProtocol.update({
      where: { id },
      data: protocolData,
      include: {
        etapas: true,
        baseIntervention: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    // Atualizar etapas, se fornecidas
    if (etapas && etapas.length > 0) {
      // Processar etapas existentes e novas
      const existingSteps = etapas.filter((step) => step.id);
      const newSteps = etapas.filter((step) => !step.id);

      // Atualizar etapas existentes
      for (const step of existingSteps) {
        const { id: stepId, ...stepData } = step;
        await this.prisma.protocolStep.update({
          where: { id: stepId },
          data: stepData,
        });
      }

      // Criar novas etapas
      if (newSteps.length > 0) {
        await this.prisma.protocolStep.createMany({
          data: newSteps.map((step) => ({
            ...step,
            protocoloId: id,
          })),
        });
      }

      // Buscar protocolo atualizado com etapas
      return this.findOne(id);
    }

    return updatedProtocol;
  }

  async remove(id: string) {
    // Verificar se o protocolo existe
    await this.findOne(id);

    // Remover etapas do protocolo
    await this.prisma.protocolStep.deleteMany({
      where: { protocoloId: id },
    });

    // Remover protocolo
    await this.prisma.interventionProtocol.delete({
      where: { id },
    });

    return { message: 'Protocolo removido com sucesso' };
  }

  async duplicateProtocol(id: string, newName: string) {
    // Buscar protocolo original com etapas
    const originalProtocol = await this.findOne(id);

    // Criar novo protocolo baseado no original
    const newProtocol = await this.prisma.interventionProtocol.create({
      data: {
        nome: newName || `Cópia de ${originalProtocol.nome}`,
        descricao: originalProtocol.descricao,
        duracaoEstimada: originalProtocol.duracaoEstimada,
        baseInterventionId: originalProtocol.baseInterventionId,
      },
    });

    // Duplicar etapas
    if (originalProtocol.etapas && originalProtocol.etapas.length > 0) {
      await this.prisma.protocolStep.createMany({
        data: originalProtocol.etapas.map((etapa) => ({
          titulo: etapa.titulo,
          descricao: etapa.descricao,
          ordem: etapa.ordem,
          tempoEstimado: etapa.tempoEstimado,
          materiaisNecessarios: etapa.materiaisNecessarios,
          protocoloId: newProtocol.id,
        })),
      });
    }

    // Retornar novo protocolo com etapas
    return this.findOne(newProtocol.id);
  }
} 