import { IsNotEmpty, IsString, IsUUID, IsIn, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonPlanDto {
  @ApiProperty({ description: 'Título do plano de aula' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descrição do plano de aula', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Objetivos da aula', required: false })
  @IsOptional()
  @IsString()
  objectives?: string;

  @ApiProperty({ description: 'Recursos necessários', required: false })
  @IsOptional()
  @IsString()
  resources?: string;

  @ApiProperty({ description: 'Atividades planejadas', required: false })
  @IsOptional()
  @IsString()
  activities?: string;

  @ApiProperty({ description: 'Avaliação da aprendizagem', required: false })
  @IsOptional()
  @IsString()
  assessment?: string;

  @ApiProperty({ description: 'Duração em minutos', required: false })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiProperty({ description: 'Data planejada para a aula', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Status do plano de aula', enum: ['draft', 'published', 'completed'], default: 'draft' })
  @IsOptional()
  @IsString()
  @IsIn(['draft', 'published', 'completed'])
  status?: string;

  @ApiProperty({ description: 'Observações adicionais', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'ID da turma' })
  @IsNotEmpty()
  @IsUUID()
  classId: string;

  @ApiProperty({ description: 'ID do conteúdo relacionado', required: false })
  @IsOptional()
  @IsUUID()
  contentId?: string;

  @ApiProperty({ description: 'ID do professor' })
  @IsNotEmpty()
  @IsUUID()
  teacherId: string;
} 