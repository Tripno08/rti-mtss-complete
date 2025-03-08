import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateIntegrationDto {
  @ApiPropertyOptional({
    description: 'Nome da integração',
    example: 'Google Classroom - Escola XYZ (Atualizado)',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'ID do cliente OAuth',
    example: '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
  })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({
    description: 'Segredo do cliente OAuth',
    example: 'GOCSPX-abcdefghijklmnopqrstuvwxyz',
  })
  @IsString()
  @IsOptional()
  clientSecret?: string;

  @ApiPropertyOptional({
    description: 'URI de redirecionamento para OAuth',
    example: 'https://app.rtimtss.com/api/integrations/google/callback',
  })
  @IsUrl()
  @IsOptional()
  redirectUri?: string;

  @ApiPropertyOptional({
    description: 'Escopos de permissão separados por vírgula',
    example: 'https://www.googleapis.com/auth/classroom.courses.readonly,https://www.googleapis.com/auth/classroom.rosters.readonly',
  })
  @IsString()
  @IsOptional()
  scopes?: string;

  @ApiPropertyOptional({
    description: 'ID do tenant (necessário apenas para Microsoft Teams)',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({
    description: 'Status de ativação da integração',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
} 