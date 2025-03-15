import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  private readonly logger = new Logger(SchoolsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createSchoolDto: CreateSchoolDto) {
    try {
      return await this.prisma.school.create({
        data: createSchoolDto,
      });
    } catch (error) {
      this.logger.error(`Erro ao criar escola: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.school.findMany({
        include: {
          network: true,
          _count: {
            select: {
              users: true,
              students: true,
              teams: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar escolas: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const school = await this.prisma.school.findUnique({
        where: { id },
        include: {
          network: true,
          _count: {
            select: {
              users: true,
              students: true,
              teams: true,
            },
          },
        },
      });

      if (!school) {
        throw new NotFoundException(`Escola com ID ${id} não encontrada`);
      }

      return school;
    } catch (error) {
      this.logger.error(`Erro ao buscar escola: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    try {
      // Verificar se a escola existe
      await this.findOne(id);

      return await this.prisma.school.update({
        where: { id },
        data: updateSchoolDto,
      });
    } catch (error) {
      this.logger.error(`Erro ao atualizar escola: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Verificar se a escola existe
      await this.findOne(id);

      return await this.prisma.school.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Erro ao remover escola: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByNetwork(networkId: string) {
    try {
      return await this.prisma.school.findMany({
        where: { networkId },
        include: {
          _count: {
            select: {
              users: true,
              students: true,
              teams: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar escolas por rede: ${error.message}`, error.stack);
      throw error;
    }
  }
} 