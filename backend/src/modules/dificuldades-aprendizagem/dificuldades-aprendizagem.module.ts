import { Module } from '@nestjs/common';
import { DificuldadesAprendizagemController } from './dificuldades-aprendizagem.controller';
import { DificuldadesAprendizagemService } from './dificuldades-aprendizagem.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DificuldadesAprendizagemController],
  providers: [DificuldadesAprendizagemService],
  exports: [DificuldadesAprendizagemService],
})
export class DificuldadesAprendizagemModule {} 