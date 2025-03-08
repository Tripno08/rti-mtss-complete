import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Platform } from '@prisma/client';

export class CreateIntegrationDto {
  @ApiProperty({
    description: 'Plataforma da integração',
    enum: Platform,
    example: Platform.GOOGLE_CLASSROOM,
  })
  @IsEnum(Platform)
  @IsNotEmpty()
  platform: Platform;

  @ApiProperty({
    description: 'Nome da integração',
    example: 'Google Classroom - Escola XYZ',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID do cliente OAuth',
    example: '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'Segredo do cliente OAuth',
    example: 'GOCSPX-abcdefghijklmnopqrstuvwxyz',
  })
  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @ApiProperty({
    description: 'URI de redirecionamento para OAuth',
    example: 'https://app.rtimtss.com/api/integrations/google/callback',
  })
  @IsUrl()
  @IsNotEmpty()
  redirectUri: string;

  @ApiProperty({
    description: 'Escopos de permissão separados por vírgula',
    example: 'https://www.googleapis.com/auth/classroom.courses.readonly,https://www.googleapis.com/auth/classroom.rosters.readonly',
  })
  @IsString()
  @IsNotEmpty()
  scopes: string;

  @ApiPropertyOptional({
    description: 'ID do tenant (necessário apenas para Microsoft Teams)',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @IsString()
  @IsOptional()
  tenantId?: string;
} 