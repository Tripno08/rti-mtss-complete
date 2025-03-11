import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoriaDificuldade } from '../entities/categoria-dificuldade.enum';

export class CreateDificuldadeAprendizagemDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsString()
  sintomas: string;

  @IsNotEmpty()
  @IsEnum(CategoriaDificuldade)
  categoria: CategoriaDificuldade;
} 