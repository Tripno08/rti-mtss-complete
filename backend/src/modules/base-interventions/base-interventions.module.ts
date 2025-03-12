import { Module } from '@nestjs/common';
import { BaseInterventionsService } from './base-interventions.service';
import { BaseInterventionsController } from './base-interventions.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BaseInterventionsController],
  providers: [BaseInterventionsService],
  exports: [BaseInterventionsService],
})
export class BaseInterventionsModule {} 