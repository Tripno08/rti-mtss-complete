import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';

@Injectable()
export class LessonPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLessonPlanDto: CreateLessonPlanDto) {
    try {
      return await this.prisma.lessonPlan.create({
        data: {
          title: createLessonPlanDto.title,
          description: createLessonPlanDto.description,
          objectives: createLessonPlanDto.objectives,
          resources: createLessonPlanDto.resources,
          activities: createLessonPlanDto.activities,
          assessment: createLessonPlanDto.assessment,
          duration: createLessonPlanDto.duration,
          date: createLessonPlanDto.date ? new Date(createLessonPlanDto.date) : null,
          status: createLessonPlanDto.status || 'draft',
          notes: createLessonPlanDto.notes,
          classId: createLessonPlanDto.classId,
          contentId: createLessonPlanDto.contentId,
          teacherId: createLessonPlanDto.teacherId,
        },
      });
    } catch (error) {
      throw new Error(`Erro ao criar plano de aula: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.lessonPlan.findMany({
        include: {
          class: true,
          content: true,
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar planos de aula: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const lessonPlan = await this.prisma.lessonPlan.findUnique({
        where: { id },
        include: {
          class: true,
          content: true,
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!lessonPlan) {
        throw new NotFoundException(`Plano de aula com ID ${id} não encontrado`);
      }

      return lessonPlan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao buscar plano de aula: ${error.message}`);
    }
  }

  async findByClass(classId: string) {
    try {
      return await this.prisma.lessonPlan.findMany({
        where: { classId },
        include: {
          content: true,
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar planos de aula da turma: ${error.message}`);
    }
  }

  async findByTeacher(teacherId: string) {
    try {
      return await this.prisma.lessonPlan.findMany({
        where: { teacherId },
        include: {
          class: true,
          content: true,
        },
        orderBy: {
          date: 'asc',
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar planos de aula do professor: ${error.message}`);
    }
  }

  async update(id: string, updateLessonPlanDto: UpdateLessonPlanDto) {
    try {
      const lessonPlan = await this.prisma.lessonPlan.findUnique({
        where: { id },
      });

      if (!lessonPlan) {
        throw new NotFoundException(`Plano de aula com ID ${id} não encontrado`);
      }

      return await this.prisma.lessonPlan.update({
        where: { id },
        data: {
          title: updateLessonPlanDto.title,
          description: updateLessonPlanDto.description,
          objectives: updateLessonPlanDto.objectives,
          resources: updateLessonPlanDto.resources,
          activities: updateLessonPlanDto.activities,
          assessment: updateLessonPlanDto.assessment,
          duration: updateLessonPlanDto.duration,
          date: updateLessonPlanDto.date ? new Date(updateLessonPlanDto.date) : undefined,
          status: updateLessonPlanDto.status,
          notes: updateLessonPlanDto.notes,
          classId: updateLessonPlanDto.classId,
          contentId: updateLessonPlanDto.contentId,
          teacherId: updateLessonPlanDto.teacherId,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao atualizar plano de aula: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const lessonPlan = await this.prisma.lessonPlan.findUnique({
        where: { id },
      });

      if (!lessonPlan) {
        throw new NotFoundException(`Plano de aula com ID ${id} não encontrado`);
      }

      await this.prisma.lessonPlan.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao remover plano de aula: ${error.message}`);
    }
  }
} 