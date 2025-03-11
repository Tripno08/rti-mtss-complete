import { Module } from '@nestjs/common';
import { ScreeningInstrumentsController } from './screening-instruments.controller';
import { ScreeningInstrumentsService } from './screening-instruments.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ScreeningInstrumentsController],
  providers: [ScreeningInstrumentsService, PrismaService],
  exports: [ScreeningInstrumentsService],
})
export class ScreeningInstrumentsModule {} 