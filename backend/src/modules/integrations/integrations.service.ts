import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Platform } from '@prisma/client';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllIntegrations() {
    try {
      return await this.prisma.platformIntegration.findMany({
        select: {
          id: true,
          platform: true,
          name: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          // Excluindo dados sensíveis
          clientId: false,
          clientSecret: false,
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar integrações: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findIntegrationById(id: string) {
    try {
      const integration = await this.prisma.platformIntegration.findUnique({
        where: { id },
        select: {
          id: true,
          platform: true,
          name: true,
          clientId: true,
          redirectUri: true,
          scopes: true,
          tenantId: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          // Excluindo dados sensíveis
          clientSecret: false,
        },
      });

      if (!integration) {
        throw new NotFoundException(`Integração com ID ${id} não encontrada`);
      }

      return integration;
    } catch (error) {
      this.logger.error(`Erro ao buscar integração: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createIntegration(data: {
    platform: Platform;
    name: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string;
    tenantId?: string;
  }) {
    try {
      return await this.prisma.platformIntegration.create({
        data,
        select: {
          id: true,
          platform: true,
          name: true,
          clientId: true,
          redirectUri: true,
          scopes: true,
          tenantId: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao criar integração: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateIntegration(
    id: string,
    data: {
      name?: string;
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
      scopes?: string;
      tenantId?: string;
      active?: boolean;
    },
  ) {
    try {
      // Verificar se a integração existe
      const existingIntegration = await this.prisma.platformIntegration.findUnique({
        where: { id },
      });

      if (!existingIntegration) {
        throw new NotFoundException(`Integração com ID ${id} não encontrada`);
      }

      return await this.prisma.platformIntegration.update({
        where: { id },
        data,
        select: {
          id: true,
          platform: true,
          name: true,
          clientId: true,
          redirectUri: true,
          scopes: true,
          tenantId: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao atualizar integração: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteIntegration(id: string) {
    try {
      // Verificar se a integração existe
      const existingIntegration = await this.prisma.platformIntegration.findUnique({
        where: { id },
      });

      if (!existingIntegration) {
        throw new NotFoundException(`Integração com ID ${id} não encontrada`);
      }

      // Excluir registros relacionados
      await this.prisma.$transaction([
        this.prisma.userSync.deleteMany({
          where: { integrationId: id },
        }),
        this.prisma.classSync.deleteMany({
          where: { integrationId: id },
        }),
        this.prisma.webhook.deleteMany({
          where: { integrationId: id },
        }),
        this.prisma.ltiDeployment.deleteMany({
          where: { integrationId: id },
        }),
        this.prisma.platformIntegration.delete({
          where: { id },
        }),
      ]);

      return { success: true, message: 'Integração excluída com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao excluir integração: ${error.message}`, error.stack);
      throw error;
    }
  }
} 