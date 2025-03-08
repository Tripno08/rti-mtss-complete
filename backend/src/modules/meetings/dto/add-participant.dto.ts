import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AddParticipantDto {
  @ApiProperty({
    description: 'ID do usuário a ser adicionado como participante',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Papel do participante na reunião',
    example: 'Facilitador',
  })
  @IsString()
  @IsOptional()
  role?: string;
} 