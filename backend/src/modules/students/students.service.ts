import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        name: createStudentDto.name,
        grade: createStudentDto.grade,
        dateOfBirth: new Date(createStudentDto.dateOfBirth),
        userId: createStudentDto.userId,
      },
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assessments: true,
        interventions: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Aluno não encontrado');
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    // Verificar se o aluno existe
    await this.findOne(id);

    // Preparar os dados para atualização
    const data: any = {};
    if (updateStudentDto.name) data.name = updateStudentDto.name;
    if (updateStudentDto.grade) data.grade = updateStudentDto.grade;
    if (updateStudentDto.dateOfBirth) data.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
    if (updateStudentDto.userId) data.userId = updateStudentDto.userId;

    // Atualizar aluno
    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // Verificar se o aluno existe
    await this.findOne(id);

    // Remover aluno
    await this.prisma.student.delete({
      where: { id },
    });

    return { message: 'Aluno removido com sucesso' };
  }
}
