import { IsDateString, IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'Nome do estudante' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Série/Turma do estudante' })
  @IsNotEmpty()
  @IsString()
  grade: string;

  @ApiProperty({ description: 'Data de nascimento do estudante (formato ISO)' })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ description: 'ID do usuário responsável pelo estudante' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID da escola (opcional)', required: false })
  @IsOptional()
  @IsUUID()
  schoolId?: string;
} 