import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty({ description: 'Nome da escola' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Código da escola (opcional)', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Endereço da escola (opcional)', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Telefone da escola (opcional)', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Email da escola (opcional)', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Status de ativação da escola', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ description: 'ID da rede escolar (opcional)', required: false })
  @IsString()
  @IsOptional()
  networkId?: string;
} 