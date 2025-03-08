import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { MeetingStatus } from '@prisma/client';

export class CreateMeetingDto {
  @ApiProperty({
    description: 'Título da reunião',
    example: 'Reunião de Avaliação - 5º Ano',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Data e hora da reunião',
    example: '2025-04-15T14:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({
    description: 'Local da reunião',
    example: 'Sala de Reuniões 3',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Status da reunião',
    enum: MeetingStatus,
    default: MeetingStatus.SCHEDULED,
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

  @ApiProperty({
    description: 'ID da equipe RTI',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @ApiPropertyOptional({
    description: 'IDs dos participantes da reunião',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  participantIds?: string[];
} 