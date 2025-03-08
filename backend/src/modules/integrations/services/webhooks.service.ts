import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Registra um novo webhook
   */
  async registerWebhook(integrationId: string, data: {
    url: string;
    events: string[];
    secret?: string;
  }) {
    try {
      // Verificar se a integração existe
      const integration = await this.prisma.platformIntegration.findUnique({
        where: { id: integrationId },
      });

      if (!integration) {
        throw new NotFoundException(`Integração com ID ${integrationId} não encontrada`);
      }

      // Gerar um segredo se não for fornecido
      const secret = data.secret || crypto.randomBytes(32).toString('hex');

      // Criar o webhook
      const webhook = await this.prisma.webhook.create({
        data: {
          integrationId,
          url: data.url,
          events: data.events.join(','),
          secret,
          active: true,
        },
      });

      return {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events.split(','),
        active: webhook.active,
        createdAt: webhook.createdAt,
      };
    } catch (error) {
      this.logger.error(`Erro ao registrar webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Lista todos os webhooks para uma integração
   */
  async listWebhooks(integrationId: string) {
    try {
      // Verificar se a integração existe
      const integration = await this.prisma.platformIntegration.findUnique({
        where: { id: integrationId },
      });

      if (!integration) {
        throw new NotFoundException(`Integração com ID ${integrationId} não encontrada`);
      }

      // Buscar webhooks
      const webhooks = await this.prisma.webhook.findMany({
        where: { integrationId },
        select: {
          id: true,
          url: true,
          events: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Formatar eventos como arrays
      return webhooks.map(webhook => ({
        ...webhook,
        events: webhook.events.split(','),
      }));
    } catch (error) {
      this.logger.error(`Erro ao listar webhooks: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Atualiza um webhook existente
   */
  async updateWebhook(id: string, data: {
    url?: string;
    events?: string[];
    active?: boolean;
    secret?: string;
  }) {
    try {
      // Verificar se o webhook existe
      const webhook = await this.prisma.webhook.findUnique({
        where: { id },
      });

      if (!webhook) {
        throw new NotFoundException(`Webhook com ID ${id} não encontrado`);
      }

      // Preparar dados para atualização
      const updateData: any = {};
      
      if (data.url) updateData.url = data.url;
      if (data.events) updateData.events = data.events.join(',');
      if (data.active !== undefined) updateData.active = data.active;
      if (data.secret) updateData.secret = data.secret;

      // Atualizar webhook
      const updatedWebhook = await this.prisma.webhook.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          url: true,
          events: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        ...updatedWebhook,
        events: updatedWebhook.events.split(','),
      };
    } catch (error) {
      this.logger.error(`Erro ao atualizar webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Remove um webhook
   */
  async deleteWebhook(id: string) {
    try {
      // Verificar se o webhook existe
      const webhook = await this.prisma.webhook.findUnique({
        where: { id },
      });

      if (!webhook) {
        throw new NotFoundException(`Webhook com ID ${id} não encontrado`);
      }

      // Excluir webhook
      await this.prisma.webhook.delete({
        where: { id },
      });

      return { success: true, message: 'Webhook excluído com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao excluir webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Dispara eventos para todos os webhooks registrados
   */
  async triggerEvent(event: string, payload: any) {
    try {
      // Buscar webhooks ativos que estão inscritos no evento
      const webhooks = await this.prisma.webhook.findMany({
        where: {
          active: true,
          events: {
            contains: event,
          },
        },
      });

      if (webhooks.length === 0) {
        this.logger.log(`Nenhum webhook registrado para o evento: ${event}`);
        return { success: true, message: 'Nenhum webhook para notificar' };
      }

      // Preparar payload do evento
      const eventPayload = {
        event,
        timestamp: new Date().toISOString(),
        data: payload,
      };

      // Enviar para cada webhook
      const results = await Promise.all(
        webhooks.map(async webhook => {
          try {
            // Calcular assinatura para verificação
            const signature = this.generateSignature(webhook.secret, eventPayload);

            // Enviar requisição
            const response = await firstValueFrom(
              this.httpService.post(webhook.url, eventPayload, {
                headers: {
                  'Content-Type': 'application/json',
                  'X-Webhook-Signature': signature,
                },
                timeout: 5000, // 5 segundos de timeout
              })
            );

            return {
              webhookId: webhook.id,
              success: true,
              statusCode: response.status,
            };
          } catch (error) {
            this.logger.error(`Erro ao enviar evento para webhook ${webhook.id}: ${error.message}`);
            
            return {
              webhookId: webhook.id,
              success: false,
              error: error.message,
            };
          }
        })
      );

      return {
        success: true,
        event,
        results,
        totalWebhooks: webhooks.length,
        successCount: results.filter(r => r.success).length,
      };
    } catch (error) {
      this.logger.error(`Erro ao disparar evento: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gera uma assinatura HMAC para verificação do webhook
   */
  private generateSignature(secret: string, payload: any): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }
} 