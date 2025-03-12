import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NivelIntervencao, AreaIntervencao, FrequenciaAplicacao } from '@prisma/client';

export class CreateBaseInterventionDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsString()
  objetivo: string;

  @IsNotEmpty()
  @IsEnum(NivelIntervencao)
  nivel: NivelIntervencao;

  @IsNotEmpty()
  @IsEnum(AreaIntervencao)
  area: AreaIntervencao;

  @IsNotEmpty()
  @IsString()
  tempoEstimado: string;

  @IsNotEmpty()
  @IsEnum(FrequenciaAplicacao)
  frequencia: FrequenciaAplicacao;

  @IsOptional()
  @IsString()
  materiaisNecessarios?: string;

  @IsOptional()
  @IsString()
  evidenciaCientifica?: string;

  @IsOptional()
  @IsString()
  fonteEvidencia?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
} 