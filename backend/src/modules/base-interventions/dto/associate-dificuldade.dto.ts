import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class AssociateDificuldadeDto {
  @IsNotEmpty()
  @IsUUID()
  dificuldadeId: string;

  @IsNotEmpty()
  @IsUUID()
  intervencaoId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  eficacia: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
} 