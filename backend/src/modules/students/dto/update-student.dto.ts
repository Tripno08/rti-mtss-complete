import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiProperty({ description: 'Nome do estudante', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Série/Turma do estudante', required: false })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({ description: 'Data de nascimento do estudante (formato ISO)', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ description: 'ID do usuário responsável pelo estudante', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'ID da escola', required: false })
  @IsOptional()
  @IsUUID()
  schoolId?: string;
} 