import { Module } from '@nestjs/common';
import { ScreeningInstrumentsController } from './screening-instruments.controller';
import { ScreeningInstrumentsService } from './screening-instruments.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScreeningInstrumentsController],
  providers: [ScreeningInstrumentsService],
  exports: [ScreeningInstrumentsService],
})
export class ScreeningInstrumentsModule {} 