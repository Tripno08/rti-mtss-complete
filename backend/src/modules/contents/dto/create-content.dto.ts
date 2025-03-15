import { IsNotEmpty, IsString, IsUUID, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ description: 'Título do conteúdo' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descrição do conteúdo', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Tipo do conteúdo', enum: ['lesson', 'activity', 'assessment'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['lesson', 'activity', 'assessment'])
  type: string;

  @ApiProperty({ description: 'Status do conteúdo', enum: ['draft', 'published'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['draft', 'published'])
  status: string;

  @ApiProperty({ description: 'ID da turma' })
  @IsNotEmpty()
  @IsUUID()
  classId: string;
} 