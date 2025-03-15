import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProtocolStepDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  ordem: number;

  @IsNotEmpty()
  @IsString()
  tempoEstimado: string;

  @IsOptional()
  @IsString()
  materiaisNecessarios?: string;
}

export class CreateProtocolDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsString()
  duracaoEstimada: string;

  @IsNotEmpty()
  @IsUUID()
  baseInterventionId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProtocolStepDto)
  etapas?: CreateProtocolStepDto[];
} 