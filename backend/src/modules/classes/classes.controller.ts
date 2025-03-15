import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  findAll() {
    return this.classesService.findAll();
  }

  @Get('school/:schoolId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  findBySchool(@Param('schoolId') schoolId: string) {
    return this.classesService.findBySchool(schoolId);
  }

  @Get('teacher/:teacherId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Get(':id/students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  findStudents(@Param('id') id: string) {
    return this.classesService.findStudents(id);
  }

  @Post(':id/students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  addStudent(@Param('id') id: string, @Body() data: { studentId: string }) {
    return this.classesService.addStudent(id, data.studentId);
  }

  @Delete(':id/students/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  removeStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.classesService.removeStudent(id, studentId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
} 