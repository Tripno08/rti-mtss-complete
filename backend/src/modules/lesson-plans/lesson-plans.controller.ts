import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LessonPlansService } from './lesson-plans.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { LessonPlan } from './entities/lesson-plan.entity';

@ApiTags('lesson-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lesson-plans')
export class LessonPlansController {
  constructor(private readonly lessonPlansService: LessonPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo plano de aula' })
  @ApiResponse({ status: 201, description: 'Plano de aula criado com sucesso', type: LessonPlan })
  create(@Body() createLessonPlanDto: CreateLessonPlanDto) {
    return this.lessonPlansService.create(createLessonPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os planos de aula' })
  @ApiResponse({ status: 200, description: 'Lista de planos de aula', type: [LessonPlan] })
  findAll() {
    return this.lessonPlansService.findAll();
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Listar planos de aula por turma' })
  @ApiResponse({ status: 200, description: 'Lista de planos de aula da turma', type: [LessonPlan] })
  findByClass(@Param('classId') classId: string) {
    return this.lessonPlansService.findByClass(classId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Listar planos de aula por professor' })
  @ApiResponse({ status: 200, description: 'Lista de planos de aula do professor', type: [LessonPlan] })
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.lessonPlansService.findByTeacher(teacherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um plano de aula pelo ID' })
  @ApiResponse({ status: 200, description: 'Plano de aula encontrado', type: LessonPlan })
  @ApiResponse({ status: 404, description: 'Plano de aula não encontrado' })
  findOne(@Param('id') id: string) {
    return this.lessonPlansService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um plano de aula' })
  @ApiResponse({ status: 200, description: 'Plano de aula atualizado com sucesso', type: LessonPlan })
  @ApiResponse({ status: 404, description: 'Plano de aula não encontrado' })
  update(@Param('id') id: string, @Body() updateLessonPlanDto: UpdateLessonPlanDto) {
    return this.lessonPlansService.update(id, updateLessonPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um plano de aula' })
  @ApiResponse({ status: 200, description: 'Plano de aula removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano de aula não encontrado' })
  remove(@Param('id') id: string) {
    return this.lessonPlansService.remove(id);
  }
} 