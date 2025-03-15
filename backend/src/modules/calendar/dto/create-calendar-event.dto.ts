import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsIn,
  ValidateIf,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalendarEventDto {
  @ApiProperty({ description: 'Título do evento' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descrição do evento', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Data e hora de início do evento' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Data e hora de término do evento', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Indica se o evento dura o dia todo', default: false })
  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @ApiProperty({ description: 'Local do evento', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Tipo do evento',
    enum: ['meeting', 'lesson', 'assessment', 'intervention', 'personal'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['meeting', 'lesson', 'assessment', 'intervention', 'personal'])
  type: string;

  @ApiProperty({
    description: 'Status do evento',
    enum: ['scheduled', 'cancelled', 'completed'],
    default: 'scheduled',
  })
  @IsOptional()
  @IsString()
  @IsIn(['scheduled', 'cancelled', 'completed'])
  status?: string;

  @ApiProperty({ description: 'Cor para exibição no calendário', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'Padrão de recorrência (JSON)', required: false })
  @IsOptional()
  @IsString()
  recurrence?: string;

  @ApiProperty({ description: 'ID do criador do evento' })
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @ApiProperty({ description: 'IDs dos participantes do evento', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  participantIds?: string[];

  @ApiProperty({ description: 'ID da escola relacionada', required: false })
  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @ApiProperty({ description: 'ID da turma relacionada', required: false })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({ description: 'ID do plano de aula relacionado', required: false })
  @IsOptional()
  @IsUUID()
  lessonPlanId?: string;
} 