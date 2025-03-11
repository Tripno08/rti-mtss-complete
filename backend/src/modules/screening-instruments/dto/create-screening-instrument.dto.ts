import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategoriaInstrumento } from '../entities/categoria-instrumento.enum';

export class CreateScreeningInstrumentDto {
  @ApiProperty({ description: 'Nome do instrumento de rastreio' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @ApiProperty({ description: 'Descrição do instrumento de rastreio' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao: string;

  @ApiProperty({ 
    description: 'Categoria do instrumento de rastreio',
    enum: CategoriaInstrumento,
    example: CategoriaInstrumento.ACADEMICO
  })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsEnum(CategoriaInstrumento, { message: 'Categoria inválida' })
  categoria: CategoriaInstrumento;

  @ApiProperty({ description: 'Faixa etária recomendada', example: '6-8 anos' })
  @IsNotEmpty({ message: 'A faixa etária é obrigatória' })
  @IsString({ message: 'A faixa etária deve ser uma string' })
  faixaEtaria: string;

  @ApiProperty({ description: 'Tempo estimado de aplicação', example: '15-20 minutos' })
  @IsNotEmpty({ message: 'O tempo de aplicação é obrigatório' })
  @IsString({ message: 'O tempo de aplicação deve ser uma string' })
  tempoAplicacao: string;

  @ApiProperty({ description: 'Instruções de aplicação do instrumento' })
  @IsNotEmpty({ message: 'As instruções são obrigatórias' })
  @IsString({ message: 'As instruções devem ser uma string' })
  instrucoes: string;

  @ApiProperty({ description: 'Status de ativação do instrumento', default: true })
  @IsOptional()
  @IsBoolean({ message: 'O status de ativação deve ser um booleano' })
  ativo?: boolean = true;
} 