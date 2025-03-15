import { Module } from '@nestjs/common';
import { SchoolNetworksService } from './school-networks.service';
import { SchoolNetworksController } from './school-networks.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SchoolNetworksController],
  providers: [SchoolNetworksService, PrismaService],
  exports: [SchoolNetworksService],
})
export class SchoolNetworksModule {} 