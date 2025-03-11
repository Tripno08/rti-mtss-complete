import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { NivelRisco } from '../entities/nivel-risco.enum';

export class CreateScreeningResultDto {
  @ApiProperty({ description: 'Valor do resultado', example: 4 })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  valor: number;

  @ApiProperty({ 
    description: 'Nível de risco identificado',
    enum: NivelRisco,
    required: false
  })
  @IsOptional()
  @IsEnum(NivelRisco, { message: 'Nível de risco inválido' })
  nivelRisco?: NivelRisco;

  @ApiProperty({ description: 'Observações sobre o resultado', required: false })
  @IsOptional()
  @IsString({ message: 'As observações devem ser uma string' })
  observacoes?: string;

  @ApiProperty({ description: 'ID do rastreio' })
  @IsNotEmpty({ message: 'O ID do rastreio é obrigatório' })
  @IsUUID('4', { message: 'O ID do rastreio deve ser um UUID válido' })
  rastreioId: string;

  @ApiProperty({ description: 'ID do indicador de rastreio' })
  @IsNotEmpty({ message: 'O ID do indicador é obrigatório' })
  @IsUUID('4', { message: 'O ID do indicador deve ser um UUID válido' })
  indicadorId: string;
} 