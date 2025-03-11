import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { NivelRisco } from '../entities/nivel-risco.enum';

export class UpdateScreeningResultDto {
  @ApiProperty({ description: 'Valor do resultado', example: 4, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'O valor deve ser um número' })
  valor?: number;

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
} 