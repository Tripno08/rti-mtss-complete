import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolNetworkDto {
  @ApiProperty({ description: 'Nome da rede escolar' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição da rede escolar (opcional)', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Código da rede escolar (opcional)', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Status de ativação da rede escolar', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
} 