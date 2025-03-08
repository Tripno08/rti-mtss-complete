import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { TeamRole } from '@prisma/client';

export class AddTeamMemberDto {
  @ApiProperty({
    description: 'ID do usuário a ser adicionado à equipe',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Papel do membro na equipe',
    enum: TeamRole,
    example: TeamRole.TEACHER,
  })
  @IsEnum(TeamRole)
  @IsNotEmpty()
  role: TeamRole;
} 