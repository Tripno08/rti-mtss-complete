import { Module } from '@nestjs/common';
import { ScreeningResultsController } from './screening-results.controller';
import { ScreeningResultsService } from './screening-results.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScreeningResultsController],
  providers: [ScreeningResultsService],
  exports: [ScreeningResultsService],
})
export class ScreeningResultsModule {} 