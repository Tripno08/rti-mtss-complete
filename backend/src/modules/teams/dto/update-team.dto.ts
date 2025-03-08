import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { TeamRole } from '@prisma/client';

export class UpdateTeamDto {
  @ApiPropertyOptional({
    description: 'Nome da equipe RTI',
    example: 'Equipe de Intervenção - 5º Ano (Atualizado)',
  })
  @IsString()
  @IsOptional()
  name?: string;

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
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
} 