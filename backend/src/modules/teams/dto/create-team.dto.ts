import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { TeamRole } from '@prisma/client';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Nome da equipe RTI',
    example: 'Equipe de Intervenção - 5º Ano',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da equipe RTI',
    example: 'Equipe responsável pelas intervenções do 5º ano do ensino fundamental',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Status de ativação da equipe',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'IDs dos membros iniciais da equipe',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  memberIds?: string[];

  @ApiPropertyOptional({
    description: 'Papéis dos membros iniciais da equipe',
    example: [{ userId: '123e4567-e89b-12d3-a456-426614174000', role: TeamRole.COORDINATOR }],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        role: { enum: Object.values(TeamRole) },
      },
    },
  })
  @IsArray()
  @IsOptional()
  members?: Array<{ userId: string; role: TeamRole }>;

  @ApiPropertyOptional({
    description: 'IDs dos estudantes iniciais da equipe',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  studentIds?: string[];
} 