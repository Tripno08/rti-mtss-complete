import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  async create(createContentDto: CreateContentDto) {
    return this.prisma.content.create({
      data: createContentDto,
    });
  }

  async findAll() {
    return this.prisma.content.findMany({
      include: {
        class: true,
      },
    });
  }

  async findOne(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        class: true,
      },
    });

    if (!content) {
      throw new NotFoundException(`Conteúdo com ID ${id} não encontrado`);
    }

    return content;
  }

  async findByClass(classId: string) {
    return this.prisma.content.findMany({
      where: { classId },
      include: {
        class: true,
      },
    });
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    try {
      return await this.prisma.content.update({
        where: { id },
        data: updateContentDto,
        include: {
          class: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Conteúdo com ID ${id} não encontrado`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.content.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Conteúdo com ID ${id} não encontrado`);
    }
  }
} 