import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProtocolStepDto } from './create-protocol.dto';

export class UpdateProtocolStepDto extends CreateProtocolStepDto {
  @IsOptional()
  @IsString()
  id?: string;
}

export class UpdateProtocolDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  duracaoEstimada?: string;

  @IsOptional()
  @IsUUID()
  baseInterventionId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProtocolStepDto)
  etapas?: UpdateProtocolStepDto[];
} 