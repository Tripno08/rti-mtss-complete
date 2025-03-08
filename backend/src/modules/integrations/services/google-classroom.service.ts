import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../../prisma/prisma.service';
import { Platform } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { google, classroom_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleClassroomService {
  private readonly logger = new Logger(GoogleClassroomService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Obtém a URL de autorização para o Google Classroom
   */
  async getAuthUrl(integrationId: string) {
    try {
      const integration = await this.prisma.platformIntegration.findUnique({
        where: {
          id: integrationId,
          platform: Platform.GOOGLE_CLASSROOM,
        },
      });

      if (!integration) {
        throw new NotFoundException('Integração com Google Classroom não encontrada');
      }

      const oauth2Client = new google.auth.OAuth2(
        integration.clientId,
        integration.clientSecret,
        integration.redirectUri,
      );

      const scopes = integration.scopes.split(',');

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        state: integrationId,
      });

      return { authUrl };
    } catch (error) {
      this.logger.error(`Erro ao gerar URL de autenticação: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Processa o callback do OAuth do Google
   */
  async handleAuthCallback(code: string, state: string) {
    try {
      const integrationId = state;
      const integration = await this.prisma.platformIntegration.findUnique({
        where: {
          id: integrationId,
          platform: Platform.GOOGLE_CLASSROOM,
        },
      });

      if (!integration) {
        throw new NotFoundException('Integração com Google Classroom não encontrada');
      }

      const oauth2Client = new google.auth.OAuth2(
        integration.clientId,
        integration.clientSecret,
        integration.redirectUri,
      );

      const { tokens } = await oauth2Client.getToken(code);

      // Armazenar tokens no banco de dados (em uma implementação real, você deve criptografar esses tokens)
      await this.prisma.platformIntegration.update({
        where: { id: integrationId },
        data: {
          // Armazenar tokens como JSON em um campo adicional que precisaria ser adicionado ao modelo
          // Isso é apenas um exemplo, na implementação real você deve adicionar um campo para armazenar tokens
          // e garantir que eles sejam armazenados de forma segura
        },
      });

      return { success: true, message: 'Autenticação com Google Classroom concluída com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao processar callback de autenticação: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtém um cliente OAuth2 autenticado
   */
  private async getAuthenticatedClient(integrationId: string): Promise<OAuth2Client> {
    const integration = await this.prisma.platformIntegration.findUnique({
      where: {
        id: integrationId,
        platform: Platform.GOOGLE_CLASSROOM,
      },
    });

    if (!integration) {
      throw new NotFoundException('Integração com Google Classroom não encontrada');
    }

    // Em uma implementação real, você buscaria os tokens armazenados
    // e verificaria se eles estão válidos ou precisam ser renovados
    
    // Este é apenas um exemplo, na implementação real você deve recuperar os tokens
    // do banco de dados e verificar se eles estão válidos
    const tokens = { access_token: 'token-exemplo', refresh_token: 'refresh-token-exemplo' };

    if (!tokens || !tokens.access_token) {
      throw new UnauthorizedException('Tokens de autenticação não encontrados ou inválidos');
    }

    const oauth2Client = new google.auth.OAuth2(
      integration.clientId,
      integration.clientSecret,
      integration.redirectUri,
    );

    oauth2Client.setCredentials(tokens);

    return oauth2Client;
  }

  /**
   * Sincroniza as turmas do Google Classroom
   */
  async syncClasses(integrationId: string) {
    try {
      const auth = await this.getAuthenticatedClient(integrationId);
      const classroom = google.classroom({ version: 'v1', auth });

      // Buscar turmas
      const response = await classroom.courses.list({
        courseStates: ['ACTIVE'],
      });

      const courses = response.data.courses || [];

      // Processar cada turma
      for (const course of courses) {
        // Verificar se a classe já existe
        const existingClass = await this.prisma.classSync.findFirst({
          where: {
            integrationId,
            externalClassId: course.id || '',
          },
        });

        if (existingClass) {
          // Atualizar a classe existente
          await this.prisma.classSync.update({
            where: { id: existingClass.id },
            data: {
              className: course.name || existingClass.className,
              lastSyncedAt: new Date(),
            },
          });
        } else {
          // Criar nova classe
          await this.prisma.classSync.create({
            data: {
              integrationId,
              externalClassId: course.id || '',
              className: course.name || 'Sem nome',
              lastSyncedAt: new Date(),
            },
          });
        }

        // Sincronizar alunos
        if (course.id) {
          await this.syncStudentsForClass(integrationId, course.id);
        }
      }

      return {
        success: true,
        message: `Sincronização concluída: ${courses.length} turmas processadas`,
      };
    } catch (error) {
      this.logger.error(`Erro ao sincronizar turmas: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Sincroniza os alunos de uma turma específica
   */
  private async syncStudentsForClass(integrationId: string, courseId: string) {
    try {
      const auth = await this.getAuthenticatedClient(integrationId);
      const classroom = google.classroom({ version: 'v1', auth });

      // Buscar alunos da turma
      const response = await classroom.courses.students.list({
        courseId,
      });

      const students = response.data.students || [];

      // Buscar a turma no banco de dados
      const classSync = await this.prisma.classSync.findFirst({
        where: {
          integrationId,
          externalClassId: courseId,
        },
      });

      if (!classSync) {
        throw new Error(`Turma com ID externo ${courseId} não encontrada`);
      }

      // Processar cada aluno
      for (const student of students) {
        const profile = student.profile;
        if (!profile || !profile.emailAddress) continue;

        // Verificar se o usuário já existe
        const existingUser = await this.prisma.userSync.findFirst({
          where: {
            integrationId,
            externalUserId: profile.id || '',
          },
        });

        if (!existingUser) {
          // Criar novo usuário
          await this.prisma.userSync.create({
            data: {
              integrationId,
              externalUserId: profile.id || '',
              email: profile.emailAddress || '',
              role: 'STUDENT',
              lastSyncedAt: new Date(),
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