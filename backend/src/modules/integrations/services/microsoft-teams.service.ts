import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../../prisma/prisma.service';
import { Platform } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import * as msal from '@azure/msal-node';

@Injectable()
export class MicrosoftTeamsService {
  private readonly logger = new Logger(MicrosoftTeamsService.name);
  private readonly graphApiUrl = 'https://graph.microsoft.com/v1.0';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Obtém a URL de autorização para o Microsoft Teams
   */
  async getAuthUrl(integrationId: string) {
    try {
      const integration = await this.prisma.platformIntegration.findUnique({
        where: {
          id: integrationId,
          platform: Platform.MICROSOFT_TEAMS,
        },
      });

      if (!integration) {
        throw new NotFoundException('Integração com Microsoft Teams não encontrada');
      }

      if (!integration.tenantId) {
        throw new NotFoundException('ID do tenant não configurado para esta integração');
      }

      const msalConfig = {
        auth: {
          clientId: integration.clientId,
          authority: `https://login.microsoftonline.com/${integration.tenantId}`,
          clientSecret: integration.clientSecret,
        },
      };

      const pca = new msal.ConfidentialClientApplication(msalConfig);
      const scopes = integration.scopes.split(',');

      const authCodeUrlParameters = {
        scopes,
        redirectUri: integration.redirectUri,
        state: integrationId,
      };

      const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);

      return { authUrl };
    } catch (error) {
      this.logger.error(`Erro ao gerar URL de autenticação: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Processa o callback do OAuth do Microsoft
   */
  async handleAuthCallback(code: string, state: string) {
    try {
      const integrationId = state;
      const integration = await this.prisma.platformIntegration.findUnique({
        where: {
          id: integrationId,
          platform: Platform.MICROSOFT_TEAMS,
        },
      });

      if (!integration) {
        throw new NotFoundException('Integração com Microsoft Teams não encontrada');
      }

      if (!integration.tenantId) {
        throw new NotFoundException('ID do tenant não configurado para esta integração');
      }

      const msalConfig = {
        auth: {
          clientId: integration.clientId,
          authority: `https://login.microsoftonline.com/${integration.tenantId}`,
          clientSecret: integration.clientSecret,
        },
      };

      const pca = new msal.ConfidentialClientApplication(msalConfig);

      const tokenRequest = {
        code,
        redirectUri: integration.redirectUri,
        scopes: integration.scopes.split(','),
      };

      const response = await pca.acquireTokenByCode(tokenRequest);

      // Armazenar tokens no banco de dados (em uma implementação real, você deve criptografar esses tokens)
      await this.prisma.platformIntegration.update({
        where: { id: integrationId },
        data: {
          // Armazenar tokens como JSON em um campo adicional que precisaria ser adicionado ao modelo
          // Isso é apenas um exemplo, na implementação real você deve adicionar um campo para armazenar tokens
          // e garantir que eles sejam armazenados de forma segura
        },
      });

      return { success: true, message: 'Autenticação com Microsoft Teams concluída com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao processar callback de autenticação: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtém um cliente autenticado para o Microsoft Graph API
   */
  private async getAccessToken(integrationId: string): Promise<string> {
    const integration = await this.prisma.platformIntegration.findUnique({
      where: {
        id: integrationId,
        platform: Platform.MICROSOFT_TEAMS,
      },
    });

    if (!integration) {
      throw new NotFoundException('Integração com Microsoft Teams não encontrada');
    }

    if (!integration.tenantId) {
      throw new NotFoundException('ID do tenant não configurado para esta integração');
    }

    // Em uma implementação real, você buscaria os tokens armazenados
    // e verificaria se eles estão válidos ou precisam ser renovados
    
    // Este é apenas um exemplo, na implementação real você deve recuperar os tokens
    // do banco de dados e verificar se eles estão válidos
    const accessToken = 'token-exemplo';

    if (!accessToken) {
      throw new UnauthorizedException('Tokens de autenticação não encontrados ou inválidos');
    }

    return accessToken;
  }

  /**
   * Sincroniza as turmas do Microsoft Teams
   */
  async syncClasses(integrationId: string) {
    try {
      const accessToken = await this.getAccessToken(integrationId);

      // Buscar turmas (equipes) do Microsoft Teams
      const response = await firstValueFrom(
        this.httpService.get(`${this.graphApiUrl}/education/classes`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      const classes = response.data.value || [];

      // Processar cada turma
      for (const classItem of classes) {
        // Verificar se a turma já existe no banco de dados
        const existingClass = await this.prisma.classSync.findFirst({
          where: {
            integrationId,
            externalClassId: classItem.id,
          },
        });

        if (existingClass) {
          // Atualizar turma existente
          await this.prisma.classSync.update({
            where: { id: existingClass.id },
            data: {
              className: classItem.displayName,
              lastSyncedAt: new Date(),
            },
          });
        } else {
          // Criar nova turma
          await this.prisma.classSync.create({
            data: {
              integrationId,
              externalClassId: classItem.id,
              className: classItem.displayName,
              lastSyncedAt: new Date(),
            },
          });
        }

        // Sincronizar alunos da turma
        await this.syncStudentsForClass(integrationId, classItem.id);
      }

      return {
        success: true,
        message: `Sincronização concluída: ${classes.length} turmas processadas`,
      };
    } catch (error) {
      this.logger.error(`Erro ao sincronizar turmas: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Sincroniza os alunos de uma turma específica
   */
  private async syncStudentsForClass(integrationId: string, classId: string) {
    try {
      const accessToken = await this.getAccessToken(integrationId);

      // Buscar alunos da turma
      const response = await firstValueFrom(
        this.httpService.get(`${this.graphApiUrl}/education/classes/${classId}/members`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      const members = response.data.value || [];
      const students = members.filter(member => member.primaryRole === 'student');

      // Buscar a turma no banco de dados
      const classSync = await this.prisma.classSync.findFirst({
        where: {
          integrationId,
          externalClassId: classId,
        },
      });

      if (!classSync) {
        throw new Error(`Turma com ID externo ${classId} não encontrada`);
      }

      // Processar cada aluno
      for (const student of students) {
        if (!student.mail) continue;

        // Verificar se o aluno já existe no banco de dados
        const existingUserSync = await this.prisma.userSync.findFirst({
          where: {
            integrationId,
            externalUserId: student.id,
          },
        });

        if (existingUserSync) {
          // Atualizar aluno existente
          await this.prisma.userSync.update({
            where: { id: existingUserSync.id },
            data: {
              email: student.mail,
              lastSyncedAt: new Date(),
              classSyncId: classSync.id,
            },
          });
        } else {
          // Criar novo aluno
          await this.prisma.userSync.create({
            data: {
              integrationId,
              externalUserId: student.id,
              email: student.mail,
              role: 'STUDENT',
              lastSyncedAt: new Date(),
              classSyncId: classSync.id,
            },
          });
        }
      }

      return {
        success: true,
        message: `Sincronização de alunos concluída: ${students.length} alunos processados`,
      };
    } catch (error) {
      this.logger.error(`Erro ao sincronizar alunos: ${error.message}`, error.stack);
      throw error;
    }
  }
} 