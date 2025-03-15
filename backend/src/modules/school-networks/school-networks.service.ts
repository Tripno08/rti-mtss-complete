import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolNetworkDto } from './dto/create-school-network.dto';
import { UpdateSchoolNetworkDto } from './dto/update-school-network.dto';

@Injectable()
export class SchoolNetworksService {
  private readonly logger = new Logger(SchoolNetworksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createSchoolNetworkDto: CreateSchoolNetworkDto) {
    try {
      return await this.prisma.schoolNetwork.create({
        data: createSchoolNetworkDto,
      });
    } catch (error) {
      this.logger.error(`Erro ao criar rede escolar: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.schoolNetwork.findMany({
        include: {
          _count: {
            select: {
              schools: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar redes escolares: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const network = await this.prisma.schoolNetwork.findUnique({
        where: { id },
        include: {
          schools: true,
          _count: {
            select: {
              schools: true,
            },
          },
        },
      });

      if (!network) {
        throw new NotFoundException(`Rede escolar com ID ${id} não encontrada`);
      }

      return network;
    } catch (error) {
      this.logger.error(`Erro ao buscar rede escolar: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateSchoolNetworkDto: UpdateSchoolNetworkDto) {
    try {
      // Verificar se a rede existe
      await this.findOne(id);

      return await this.prisma.schoolNetwork.update({
        where: { id },
        data: updateSchoolNetworkDto,
      });
    } catch (error) {
      this.logger.error(`Erro ao atualizar rede escolar: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Verificar se a rede existe
      const network = await this.findOne(id);

      // Verificar se existem escolas associadas
      if (network.schools && network.schools.length > 0) {
        throw new BadRequestException('Não é possível remover uma rede com escolas associadas');
      }

      return await this.prisma.schoolNetwork.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Erro ao remover rede escolar: ${error.message}`, error.stack);
      throw error;
    }
  }
} 