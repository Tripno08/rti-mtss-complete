import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  NivelIntervencao,
  AreaIntervencao,
  FrequenciaAplicacao,
} from '@prisma/client';

export class UpdateBaseInterventionDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  objetivo?: string;

  @IsOptional()
  @IsEnum(NivelIntervencao)
  nivel?: NivelIntervencao;

  @IsOptional()
  @IsEnum(AreaIntervencao)
  area?: AreaIntervencao;

  @IsOptional()
  @IsString()
  tempoEstimado?: string;

  @IsOptional()
  @IsEnum(FrequenciaAplicacao)
  frequencia?: FrequenciaAplicacao;

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