import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { MeetingStatus } from '@prisma/client';

export class UpdateMeetingDto {
  @ApiPropertyOptional({
    description: 'Título da reunião',
    example: 'Reunião de Avaliação - 5º Ano (Atualizado)',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Data e hora da reunião',
    example: '2025-04-15T15:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    description: 'Local da reunião',
    example: 'Sala de Reuniões 4',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Status da reunião',
    enum: MeetingStatus,
  })
  @IsEnum(MeetingStatus)
  @IsOptional()
  status?: MeetingStatus;

  @ApiPropertyOptional({
    description: 'Notas ou pauta da reunião',
    example: 'Discussão sobre os resultados das avaliações recentes e planejamento de intervenções.',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Resumo da reunião (preenchido após a conclusão)',
    example: 'Foram discutidos os resultados das avaliações e definidas as próximas intervenções.',
  })
  @IsString()
  @IsOptional()
  summary?: string;
} 