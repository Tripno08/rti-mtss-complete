import { IsDateString, IsOptional, IsNumber, IsString, IsUUID, Min, Max } from 'class-validator';

export class UpdateAssessmentDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;
} 