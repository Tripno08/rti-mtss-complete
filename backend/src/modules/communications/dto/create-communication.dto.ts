import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CommunicationType, CommunicationStatus } from '@prisma/client';

export class CreateCommunicationDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsEnum(CommunicationType)
  type: CommunicationType;

  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsEnum(CommunicationStatus)
  status?: CommunicationStatus;
} 