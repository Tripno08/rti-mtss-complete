import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusRastreio } from '../entities/status-rastreio.enum';

export class UpdateScreeningDto {
  @ApiProperty({ description: 'Data de aplicação do rastreio', example: '2023-05-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'A data de aplicação deve ser uma data válida' })
  dataAplicacao?: string;

  @ApiProperty({ description: 'Observações sobre o rastreio', required: false })
  @IsOptional()
  @IsString({ message: 'As observações devem ser uma string' })
  observacoes?: string;

  @ApiProperty({ 
    description: 'Status do rastreio',
    enum: StatusRastreio,
    required: false
  })
  @IsOptional()
  @IsEnum(StatusRastreio, { message: 'Status inválido' })
  status?: StatusRastreio;
} 