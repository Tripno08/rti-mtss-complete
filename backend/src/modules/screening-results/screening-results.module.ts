import { Module } from '@nestjs/common';
import { ScreeningResultsController } from './screening-results.controller';
import { ScreeningResultsService } from './screening-results.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ScreeningResultsController],
  providers: [ScreeningResultsService, PrismaService],
  exports: [ScreeningResultsService],
})
export class ScreeningResultsModule {} 