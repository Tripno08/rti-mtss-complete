import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { NivelDificuldade } from '../entities/nivel-dificuldade.enum';

export class CreateEstudanteDificuldadeDto {
  @IsNotEmpty()
  @IsUUID()
  estudanteId: string;

  @IsNotEmpty()
  @IsUUID()
  dificuldadeId: string;

  @IsNotEmpty()
  @IsEnum(NivelDificuldade)
  nivel: NivelDificuldade;

  @IsOptional()
  @IsString()
  observacoes?: string;
} 