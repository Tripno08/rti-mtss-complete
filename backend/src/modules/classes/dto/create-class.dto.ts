import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  grade: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsNotEmpty()
  @IsUUID()
  schoolId: string;

  @IsNotEmpty()
  @IsUUID()
  teacherId: string;
} 