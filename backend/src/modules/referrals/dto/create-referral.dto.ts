import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReferralStatus, ReferralPriority } from '@prisma/client';

export class CreateReferralDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsEnum(ReferralPriority)
  priority?: ReferralPriority;

  @IsOptional()
  @IsEnum(ReferralStatus)
  status?: ReferralStatus;

  @IsOptional()
  @IsString()
  externalServiceName?: string;

  @IsOptional()
  @IsString()
  externalServiceContact?: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 