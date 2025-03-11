import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoriaInstrumento } from '../entities/categoria-instrumento.enum';

export class UpdateScreeningInstrumentDto {
  @ApiProperty({ description: 'Nome do instrumento de rastreio', required: false })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  nome?: string;

  @ApiProperty({ description: 'Descrição do instrumento de rastreio', required: false })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao?: string;

  @ApiProperty({ 
    description: 'Categoria do instrumento de rastreio',
    enum: CategoriaInstrumento,
    example: CategoriaInstrumento.ACADEMICO,
    required: false
  })
  @IsOptional()
  @IsEnum(CategoriaInstrumento, { message: 'Categoria inválida' })
  categoria?: CategoriaInstrumento;

  @ApiProperty({ description: 'Faixa etária recomendada', example: '6-8 anos', required: false })
  @IsOptional()
  @IsString({ message: 'A faixa etária deve ser uma string' })
  faixaEtaria?: string;

  @ApiProperty({ description: 'Tempo estimado de aplicação', example: '15-20 minutos', required: false })
  @IsOptional()
  @IsString({ message: 'O tempo de aplicação deve ser uma string' })
  tempoAplicacao?: string;

  @ApiProperty({ description: 'Instruções de aplicação do instrumento', required: false })
  @IsOptional()
  @IsString({ message: 'As instruções devem ser uma string' })
  instrucoes?: string;

  @ApiProperty({ description: 'Status de ativação do instrumento', required: false })
  @IsOptional()
  @IsBoolean({ message: 'O status de ativação deve ser um booleano' })
  ativo?: boolean;
} 