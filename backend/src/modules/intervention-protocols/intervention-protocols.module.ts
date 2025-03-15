import { Module } from '@nestjs/common';
import { InterventionProtocolsService } from './intervention-protocols.service';
import { InterventionProtocolsController } from './intervention-protocols.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InterventionProtocolsController],
  providers: [InterventionProtocolsService],
  exports: [InterventionProtocolsService],
})
export class InterventionProtocolsModule {} 