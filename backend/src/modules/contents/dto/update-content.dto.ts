import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContentDto {
  @ApiProperty({ description: 'Título do conteúdo', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Descrição do conteúdo', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Tipo do conteúdo', 
    enum: ['lesson', 'activity', 'assessment'], 
    required: false 
  })
  @IsOptional()
  @IsString()
  @IsIn(['lesson', 'activity', 'assessment'])
  type?: string;

  @ApiProperty({ 
    description: 'Status do conteúdo', 
    enum: ['draft', 'published'], 
    required: false 
  })
  @IsOptional()
  @IsString()
  @IsIn(['draft', 'published'])
  status?: string;
} 