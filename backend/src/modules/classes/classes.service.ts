import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto) {
    return this.prisma.class.create({
      data: {
        name: createClassDto.name,
        grade: createClassDto.grade,
        subject: createClassDto.subject,
        schoolId: createClassDto.schoolId,
        teacherId: createClassDto.teacherId,
      },
    });
  }

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }

  async findBySchool(schoolId: string) {
    return this.prisma.class.findMany({
      where: { schoolId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.class.findMany({
      where: { teacherId },
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const classEntity = await this.prisma.class.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (!classEntity) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }

    return classEntity;
  }

  async findStudents(id: string) {
    // Verificar se a turma existe
    await this.findOne(id);

    // Buscar estudantes da turma
    return this.prisma.classStudent.findMany({
      where: { classId: id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
      },
    });
  }

  async addStudent(classId: string, studentId: string) {
    // Verificar se a turma existe
    await this.findOne(classId);

    // Verificar se o estudante existe
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Estudante com ID ${studentId} não encontrado`);
    }

    // Verificar se o estudante já está na turma
    const existingRelation = await this.prisma.classStudent.findFirst({
      where: {
        classId,
        studentId,
      },
    });

    if (existingRelation) {
      return existingRelation;
    }

    // Adicionar estudante à turma
    return this.prisma.classStudent.create({
      data: {
        classId,
        studentId,
        joinedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
      },
    });
  }

  async removeStudent(classId: string, studentId: string) {
    // Verificar se a turma existe
    await this.findOne(classId);

    // Verificar se o estudante existe
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Estudante com ID ${studentId} não encontrado`);
    }

    // Verificar se o estudante está na turma
    const relation = await this.prisma.classStudent.findFirst({
      where: {
        classId,
        studentId,
      },
    });

    if (!relation) {
      throw new NotFoundException(`Estudante não está matriculado nesta turma`);
    }

    // Remover estudante da turma
    await this.prisma.classStudent.delete({
      where: {
        id: relation.id,
      },
    });

    return { message: 'Estudante removido da turma com sucesso' };
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    // Verificar se a turma existe
    await this.findOne(id);

    // Preparar dados para atualização
    const data: any = {};
    if (updateClassDto.name) data.name = updateClassDto.name;
    if (updateClassDto.grade) data.grade = updateClassDto.grade;
    if (updateClassDto.subject !== undefined) data.subject = updateClassDto.subject;
    if (updateClassDto.schoolId) data.schoolId = updateClassDto.schoolId;
    if (updateClassDto.teacherId) data.teacherId = updateClassDto.teacherId;

    // Atualizar turma
    return this.prisma.class.update({
      where: { id },
      data,
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Verificar se a turma existe
    await this.findOne(id);

    // Remover relações com estudantes
    await this.prisma.classStudent.deleteMany({
      where: { classId: id },
    });

    // Remover turma
    await this.prisma.class.delete({
      where: { id },
    });

    return { message: 'Turma removida com sucesso' };
  }
} 