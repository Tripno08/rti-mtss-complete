import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { StatusRastreio } from '../entities/status-rastreio.enum';

export class CreateScreeningDto {
  @ApiProperty({ description: 'Data de aplicação do rastreio', example: '2023-05-15T10:00:00Z' })
  @IsNotEmpty({ message: 'A data de aplicação é obrigatória' })
  @IsDateString({}, { message: 'A data de aplicação deve ser uma data válida' })
  dataAplicacao: string;

  @ApiProperty({ description: 'Observações sobre o rastreio', required: false })
  @IsOptional()
  @IsString({ message: 'As observações devem ser uma string' })
  observacoes?: string;

  @ApiProperty({ 
    description: 'Status do rastreio',
    enum: StatusRastreio,
    default: StatusRastreio.EM_ANDAMENTO,
    required: false
  })
  @IsOptional()
  @IsEnum(StatusRastreio, { message: 'Status inválido' })
  status?: StatusRastreio;

  @ApiProperty({ description: 'ID do estudante' })
  @IsNotEmpty({ message: 'O ID do estudante é obrigatório' })
  @IsUUID('4', { message: 'O ID do estudante deve ser um UUID válido' })
  estudanteId: string;

  @ApiProperty({ description: 'ID do instrumento de rastreio' })
  @IsNotEmpty({ message: 'O ID do instrumento é obrigatório' })
  @IsUUID('4', { message: 'O ID do instrumento deve ser um UUID válido' })
  instrumentoId: string;
} 