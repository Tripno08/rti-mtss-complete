import { Module } from '@nestjs/common';
import { DificuldadesAprendizagemService } from './dificuldades-aprendizagem.service';
import { DificuldadesAprendizagemController } from './dificuldades-aprendizagem.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DificuldadesAprendizagemController],
  providers: [DificuldadesAprendizagemService, PrismaService],
  exports: [DificuldadesAprendizagemService],
})
export class DificuldadesAprendizagemModule {} 