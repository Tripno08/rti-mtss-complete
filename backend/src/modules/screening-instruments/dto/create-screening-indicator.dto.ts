import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { TipoIndicador } from '../entities/tipo-indicador.enum';

export class CreateScreeningIndicatorDto {
  @ApiProperty({ description: 'Nome do indicador de rastreio' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @ApiProperty({ description: 'Descrição do indicador de rastreio' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao: string;

  @ApiProperty({ 
    description: 'Tipo do indicador de rastreio',
    enum: TipoIndicador,
    example: TipoIndicador.ESCALA_LIKERT
  })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  @IsEnum(TipoIndicador, { message: 'Tipo inválido' })
  tipo: TipoIndicador;

  @ApiProperty({ description: 'Valor mínimo do indicador', example: 0 })
  @IsNotEmpty({ message: 'O valor mínimo é obrigatório' })
  @IsNumber({}, { message: 'O valor mínimo deve ser um número' })
  valorMinimo: number;

  @ApiProperty({ description: 'Valor máximo do indicador', example: 5 })
  @IsNotEmpty({ message: 'O valor máximo é obrigatório' })
  @IsNumber({}, { message: 'O valor máximo deve ser um número' })
  valorMaximo: number;

  @ApiProperty({ description: 'Ponto de corte para intervenção', example: 3 })
  @IsNotEmpty({ message: 'O ponto de corte é obrigatório' })
  @IsNumber({}, { message: 'O ponto de corte deve ser um número' })
  pontoCorte: number;

  @ApiProperty({ description: 'ID do instrumento de rastreio' })
  @IsNotEmpty({ message: 'O ID do instrumento é obrigatório' })
  @IsUUID('4', { message: 'O ID do instrumento deve ser um UUID válido' })
  instrumentoId: string;
} 