import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoriaDificuldade } from '../entities/categoria-dificuldade.enum';

export class UpdateDificuldadeAprendizagemDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  sintomas?: string;

  @IsOptional()
  @IsEnum(CategoriaDificuldade)
  categoria?: CategoriaDificuldade;
} 