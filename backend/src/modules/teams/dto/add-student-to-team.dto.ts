import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddStudentToTeamDto {
  @ApiProperty({
    description: 'ID do estudante a ser adicionado à equipe',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;
} 