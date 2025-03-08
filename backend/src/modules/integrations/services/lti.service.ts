import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../../prisma/prisma.service';
import { Platform } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class LtiService {
  private readonly logger = new Logger(LtiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Cria um novo deployment LTI
   */
  async createDeployment(integrationId: string, data: {
    deploymentId: string;
    issuer: string;
    clientId: string;
    authLoginUrl: string;
    authTokenUrl: string;
    keysetUrl: string;
  }) {
    try {
      const integration = await this.prisma.platformIntegration.findUnique({
        where: {
          id: integrationId,
          platform: Platform.LTI,
        },
      });

      if (!integration) {
        throw new NotFoundException('Integração LTI não encontrada');
      }

      // Verificar se já existe um deployment com o mesmo ID
      const existingDeployment = await this.prisma.ltiDeployment.findFirst({
        where: {
          integrationId,
          deploymentId: data.deploymentId,
        },
      });

      if (existingDeployment) {
        throw new Error('Já existe um deployment com este ID');
      }

      // Criar novo deployment
      const deployment = await this.prisma.ltiDeployment.create({
        data: {
          ...data,
          integrationId,
        },
      });

      return deployment;
    } catch (error) {
      this.logger.error(`Erro ao criar deployment LTI: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Lista todos os deployments LTI para uma integração
   */
  async listDeployments(integrationId: string) {
    try {
      const integration = await this.prisma.platformIntegration.findUnique({
        where: {
          id: integrationId,
          platform: Platform.LTI,
        },
      });

      if (!integration) {
        throw new NotFoundException('Integração LTI não encontrada');
      }

      const deployments = await this.prisma.ltiDeployment.findMany({
        where: {
          integrationId,
        },
      });

      return deployments;
    } catch (error) {
      this.logger.error(`Erro ao listar deployments LTI: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Processa uma solicitação de login LTI
   */
  async handleLoginRequest(params: {
    iss: string;
    login_hint: string;
    target_link_uri: string;
    lti_message_hint?: string;
    client_id: string;
    deployment_id: string;
  }) {
    try {
      const { iss, client_id, deployment_id } = params;

      // Buscar o deployment correspondente
      const deployment = await this.prisma.ltiDeployment.findFirst({
        where: {
          issuer: iss,
          clientId: client_id,
          deploymentId: deployment_id,
          active: true,
        },
        include: {
          integration: true,
        },
      });

      if (!deployment) {
        throw new NotFoundException('Deployment LTI não encontrado ou inativo');
      }

      // Gerar estado para verificação posterior
      const state = crypto.randomBytes(32).toString('hex');

      // Gerar nonce para evitar ataques de replay
      const nonce = crypto.randomBytes(16).toString('hex');

      // Armazenar estado e nonce (em uma implementação real, você deve armazenar em um cache ou banco de dados)
      // Aqui estamos apenas simulando

      // Construir URL de redirecionamento para autenticação
      const authUrl = new URL(deployment.authLoginUrl);
      authUrl.searchParams.append('scope', 'openid');
      authUrl.searchParams.append('response_type', 'id_token');
      authUrl.searchParams.append('client_id', deployment.clientId);
      authUrl.searchParams.append('redirect_uri', params.target_link_uri);
      authUrl.searchParams.append('login_hint', params.login_hint);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('nonce', nonce);
      authUrl.searchParams.append('prompt', 'none');
      
      if (params.lti_message_hint) {
        authUrl.searchParams.append('lti_message_hint', params.lti_message_hint);
      }

      return { authUrl: authUrl.toString() };
    } catch (error) {
      this.logger.error(`Erro ao processar solicitação de login LTI: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Valida um token JWT LTI
   */
  async validateToken(token: string, expectedNonce: string, expectedState: string) {
    try {
      // Decodificar o token sem verificar a assinatura para obter o emissor
      const decoded: any = jwt.decode(token, { complete: true });
      
      if (!decoded) {
        throw new UnauthorizedException('Token inválido');
      }

      const issuer = decoded.payload.iss;
      const clientId = decoded.payload.aud;

      // Buscar o deployment correspondente
      const deployment = await this.prisma.ltiDeployment.findFirst({
        where: {
          issuer,
          clientId,
          active: true,
        },
      });

      if (!deployment) {
        throw new NotFoundException('Deployment LTI não encontrado ou inativo');
      }

      // Obter as chaves públicas do emissor
      const client = jwksClient({
        jwksUri: deployment.keysetUrl,
      });

      // Obter a chave pública correspondente ao kid no cabeçalho do token
      const key = await new Promise<string>((resolve, reject) => {
        client.getSigningKey(decoded.header.kid, (err, key) => {
          if (err) return reject(err);
          if (!key) {
            throw new Error('Chave de assinatura não encontrada');
          }
          const signingKey = key.getPublicKey();
          resolve(signingKey);
        });
      });

      // Verificar a assinatura do token
      const verified: any = jwt.verify(token, key, {
        audience: clientId,
        issuer,
      });

      // Verificar nonce para evitar ataques de replay
      if (verified.nonce !== expectedNonce) {
        throw new UnauthorizedException('Nonce inválido');
      }

      // Verificar estado para evitar ataques CSRF
      if (verified.state !== expectedState) {
        throw new UnauthorizedException('Estado inválido');
      }

      // Extrair informações do usuário e contexto
      const userData = {
        sub: verified.sub,
        name: verified.name,
        email: verified.email,
        roles: verified['https://purl.imsglobal.org/spec/lti/claim/roles'] || [],
        context: verified['https://purl.imsglobal.org/spec/lti/claim/context'] || {},
      };

      return userData;
    } catch (error) {
      this.logger.error(`Erro ao validar token LTI: ${error.message}`, error.stack);
      throw error;
    }
  }
} 