import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional, IsUUID } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário (mínimo 6 caracteres)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Papel do usuário no sistema', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'ID da escola (opcional)', required: false })
  @IsOptional()
  @IsUUID()
  schoolId?: string;
} 