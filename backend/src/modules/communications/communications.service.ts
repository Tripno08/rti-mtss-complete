import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { UpdateCommunicationDto } from './dto/update-communication.dto';

@Injectable()
export class CommunicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommunicationDto: CreateCommunicationDto, userId: string) {
    const { studentId, ...rest } = createCommunicationDto;
    
    // Verificar se o estudante existe
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Estudante com ID ${studentId} não encontrado`);
    }

    return this.prisma.tutorCommunication.create({
      data: {
        ...rest,
        student: { connect: { id: studentId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.tutorCommunication.findMany({
      where: { userId },
      include: {
        student: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const communication = await this.prisma.tutorCommunication.findUnique({
      where: { id },
      include: {
        student: true,
        user: true,
      },
    });

    if (!communication) {
      throw new NotFoundException(`Comunicação com ID ${id} não encontrada`);
    }

    return communication;
  }

  async update(id: string, updateCommunicationDto: UpdateCommunicationDto) {
    // Verificar se a comunicação existe
    await this.findOne(id);

    return this.prisma.tutorCommunication.update({
      where: { id },
      data: updateCommunicationDto,
    });
  }

  async remove(id: string) {
    // Verificar se a comunicação existe
    await this.findOne(id);

    return this.prisma.tutorCommunication.delete({
      where: { id },
    });
  }
} 